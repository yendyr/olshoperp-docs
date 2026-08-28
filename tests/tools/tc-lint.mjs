#!/usr/bin/env node
/**
 * TC Lint — jaga qa-docs bebas test case duplikat / rujukan putus.
 *
 * Cek (ERROR = exit 1):
 *  1. tc_code duplikat antar file mana pun (single-menu maupun flow)
 *  2. `recalls:` di TC flow menunjuk tc_code yang tidak ada
 *  3. (dipindah ke WARNING) `recalls:` menunjuk kode PENDING — TC-nya ada dan boleh
 *     dieksekusi; renumber yang wajib memperbarui rujukannya
 *  4. Judul (title) identik dalam menu yang sama
 *  5. File TC tanpa `tc_code` (skema non-rule-13, mis. hasil crawling MCP yang
 *     memakai `id:`/`menu_slug:`) — invisible bagi lint & tidak bisa di-recall flow
 * Cek (WARNING saja):
 *  6. `automated_spec` menunjuk file yang tidak ada
 *  7. File TC dengan tc_code PENDING-* (menunggu #renumber-tc)
 *  8. Penamaan file di luar pola rule 13 (TC-{PREFIX}-{NNN}.md / TC-{PREFIX}-DRAFT-{ts}.md)
 *  9. `related_menus` format salah / menunjuk menu tidak ada (ERROR), menyebut menu
 *     sendiri, atau `test_type: cross-menu` tanpa `related_menus` (WARNING)
 *
 * Pakai: node tests/tools/tc-lint.mjs   (atau: npm run tc:lint)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// `TC_LINT_ROOT` dipakai `tc:selftest` untuk melint repo tiruan berisi pelanggaran
// buatan — sehingga gate-nya sendiri ikut teruji, bukan cuma dipercaya.
const root = process.env.TC_LINT_ROOT
  ? path.resolve(process.env.TC_LINT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const qaDocs = path.join(root, 'qa-docs');

function* walkTcFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '_legacy'].includes(entry.name)) continue;
      yield* walkTcFiles(full);
    } else if (
      /(^TC-.*\.md|^testcase\.md)$/.test(entry.name) &&
      /(test-cases|flows)/.test(full)
    ) {
      yield full;
    }
  }
}

function parseFrontmatter(rawText) {
  const text = rawText.replace(/^﻿/, ''); // sebagian file punya BOM
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = match[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim();
  const recalls = [];
  const recallsBlock = fm.match(/^recalls:\n((?:\s+-\s+.+\n?)+)/m)?.[1];
  if (recallsBlock) {
    for (const line of recallsBlock.split('\n')) {
      const code = line.match(/-\s+(\S+)/)?.[1];
      if (code) recalls.push(code);
    }
  }

  // related_menus: `[]` (kosong) atau daftar slug (`- menu-slug`).
  // Blok mentah disimpan supaya format menyimpang bisa dilaporkan apa adanya.
  const relatedRaw = fm.match(/^related_menus:\n((?:\s+-\s+.+\n?)+)/m)?.[1] ?? '';
  const relatedMenus = relatedRaw
    .split('\n')
    .map((l) => l.match(/-\s+(.+?)\s*$/)?.[1])
    .filter(Boolean);
  // Blok `last_execution` — sumber hasil eksekusi terakhir (rule 13).
  const leBlock = fm.match(/^last_execution:\n((?:[ \t]+.*\n?)+)/m)?.[1] ?? null;
  const leGet = (k) =>
    leBlock?.match(new RegExp(`^\\s+${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim() ?? null;
  // Blok `first_execution` — tanggal/jalur run PERTAMA (set once).
  const feBlock = fm.match(/^first_execution:\n((?:[ \t]+.*\n?)+)/m)?.[1] ?? null;
  const feGet = (k) =>
    feBlock?.match(new RegExp(`^\\s+${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1]?.trim() ?? null;
  // `expected_result` bisa blok (`|`) maupun skalar satu baris — dua-duanya dipakai.
  const expected =
    fm.match(/^expected_result:\s*[|>]-?\s*\n([\s\S]*?)(?=\n[a-z_]+:|$)/m)?.[1] ??
    fm.match(/^expected_result:\s*"?(.+?)"?\s*$/m)?.[1] ??
    '';
  const trStatus = fm
    .match(/^test_result:\n((?:[ \t]+.*\n?)+)/m)?.[1]
    ?.match(/^\s+status:\s*"?([a-zA-Z_]+)"?\s*$/m)?.[1];

  return {
    doc_status: get('status'),
    origin_jira: get('origin_jira'),
    expected_result: expected,
    automated: get('automated'),
    test_result_status: trStatus ?? null,
    last_execution: leBlock
      ? { at: leGet('at'), jira: leGet('jira'), status: leGet('status'), via: leGet('via'),
          notes: leBlock.match(/^\s+notes:\s*"?([^"\n]*)"?\s*$/m)?.[1] ?? null,
          keys: [...leBlock.matchAll(/^\s+([a-z_]+):/gm)].map((m) => m[1]) }
      : null,
    first_execution: feBlock
      ? { at: feGet('at'), jira: feGet('jira'), via: feGet('via'),
          keys: [...feBlock.matchAll(/^\s+([a-z_]+):/gm)].map((m) => m[1]) }
      : null,
    tc_code: get('tc_code'),
    title: get('title'),
    test_type: get('test_type'),
    menu: get('menu'),
    automated_spec: get('automated_spec'),
    duplicate_candidate: get('duplicate_candidate'),
    relatedMenus,
    recalls,
  };
}

/** Kata signifikan judul untuk deteksi duplikat semantik (buang kata umum). */
const STOPWORDS = new Set([
  'dan','atau','dari','ke','di','pada','untuk','dengan','yang','via','the','a','an',
  'create','update','delete','verify','memastikan','membuat','lalu','then','status',
  'test','case','new','baru','—','-','+','&',
]);
function titleTokens(title) {
  return new Set(
    (title ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}
/** Kata bermakna dalam sebuah catatan — dipakai membandingkan notes vs expected. */
function words(t) {
  return new Set(
    (t || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}

function similarity(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / Math.min(a.size, b.size);
}

// Slug menu yang sah = folder di qa-docs/ (di luar _meta, _legacy, flows).
const validMenuSlugs = new Set(
  fs
    .readdirSync(qaDocs, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'flows')
    .map((d) => d.name),
);

const errors = [];
const warnings = [];
const untyped = [];
const unverified = [];
const manual = [];
const cliVerified = [];
const byCode = new Map();
const byMenuTitle = new Map();
const allDocs = [];

for (const file of walkTcFiles(qaDocs)) {
  const rel = path.relative(root, file);
  const raw = fs.readFileSync(file, 'utf-8');
  const fm = parseFrontmatter(raw);

  if (!fm.tc_code) {
    // Skema non-rule-13 (mis. hasil crawling MCP: `id:` + `menu_slug:` + author
    // "Playwright Web Crawler"). Tidak punya tc_code → tak bisa di-recall flow,
    // tak terdeteksi duplikat, dan status "passed"-nya tidak reproducible.
    const legacyId = raw.match(/^id:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
    errors.push(
      `Skema TC tidak sesuai rule 13 (tanpa \`tc_code\`): ${rel}` +
        (legacyId ? ` — memakai \`id: ${legacyId}\`` : '') +
        ` → konversi ke frontmatter rule 13 (tc_code/menu/steps/expected_result) + nama TC-{PREFIX}-DRAFT-{timestamp}.md`,
    );
    continue;
  }

  const base = path.basename(file);
  // Pola sah: TC-{PREFIX}[-{SEGMEN}...]-{NNN}.md atau TC-{PREFIX}-DRAFT-{timestamp}.md
  if (
    base !== 'testcase.md' &&
    !/^TC-[A-Z0-9]+(?:-[A-Z0-9]+)*-(?:\d{3}|DRAFT-\d{14})\.md$/.test(base)
  ) {
    warnings.push(`Nama file di luar pola rule 13 §2: ${rel}`);
  }

  allDocs.push({ rel, ...fm });

  if (byCode.has(fm.tc_code)) {
    errors.push(`tc_code DUPLIKAT: ${fm.tc_code} — ${byCode.get(fm.tc_code)} vs ${rel}`);
  } else {
    byCode.set(fm.tc_code, rel);
  }

  if (fm.menu && fm.title) {
    const key = `${fm.menu}::${fm.title.toLowerCase()}`;
    if (byMenuTitle.has(key)) {
      errors.push(`Judul DUPLIKAT di menu ${fm.menu}: "${fm.title}" — ${byMenuTitle.get(key)} vs ${rel}`);
    } else {
      byMenuTitle.set(key, rel);
    }
  }

  if (/^PENDING-/.test(fm.tc_code)) {
    warnings.push(`DRAFT menunggu #renumber-tc: ${rel} (${fm.tc_code})`);
  }

  // Klasifikasi jenis pengujian (rule 13 §3A). Wajib untuk TC baru; TC lama
  // di-backfill bertahap (lihat `npm run tc:coverage`).
  const VALID_TEST_TYPES = ['happy', 'negative', 'edge', 'permission', 'regression', 'cross-menu'];
  if (fm.test_type && !VALID_TEST_TYPES.includes(fm.test_type)) {
    errors.push(
      `test_type tidak sah "${fm.test_type}": ${rel} → pilih salah satu: ${VALID_TEST_TYPES.join(', ')}`,
    );
  } else if (!fm.test_type) {
    if (/^PENDING-/.test(fm.tc_code)) {
      errors.push(
        `TC baru tanpa \`test_type\`: ${rel} → wajib diisi (rule 13 §3A): ${VALID_TEST_TYPES.join(', ')}`,
      );
    } else {
      untyped.push(rel);
    }
  }

  // ── Status dokumen vs hasil eksekusi (rule 13 §3) ──────────────────────────
  // `status` = daur hidup DOKUMEN. Hasil run TIDAK pernah tinggal di sini —
  // tempatnya `last_execution`, dan hanya reporter CLI yang berhak mengisinya.
  const DOC_STATUS = ['draft', 'review', 'approved', 'deprecated'];
  if (fm.doc_status && !DOC_STATUS.includes(fm.doc_status)) {
    errors.push(
      `status dokumen tidak sah "${fm.doc_status}": ${rel} → pilih: ${DOC_STATUS.join(', ')}.` +
        ` Hasil eksekusi bukan status dokumen — tempatnya \`last_execution.status\``,
    );
  }

  const RUN_STATUS = ['passed', 'failed', 'blocked', 'skipped', 'unknown', 'not_run'];
  const LE_KEYS = ['at', 'jira', 'status', 'via'];
  const FE_KEYS = ['at', 'via', 'jira'];
  // `notes` hanya sah untuk run manual — di situlah actual result ditulis manusia.
  const LE_KEYS_MANUAL = [...LE_KEYS, 'notes'];
  const le = fm.last_execution;
  if (!le) {
    errors.push(
      `Tidak ada blok \`last_execution\`: ${rel} → wajib ada (boleh semua null/not_run).` +
        ` Ini satu-satunya tempat hasil eksekusi dicatat`,
    );
  } else {
    const missing = LE_KEYS.filter((k) => !le.keys.includes(k));
    const allowed = /^(manual|card):/.test(le.via ?? '') ? LE_KEYS_MANUAL : LE_KEYS;
    const extra = le.keys.filter((k) => !allowed.includes(k));
    if (missing.length || extra.length) {
      errors.push(
        `Bentuk \`last_execution\` menyimpang: ${rel} →` +
          (missing.length ? ` kurang ${missing.join(', ')};` : '') +
          (extra.length ? ` key asing ${extra.join(', ')};` : '') +
          ` wajib tepat {${LE_KEYS.join(', ')}} (rule 13 §3)`,
      );
    }
    if (le.status && !RUN_STATUS.includes(le.status)) {
      errors.push(
        `last_execution.status tidak sah "${le.status}": ${rel} → pilih: ${RUN_STATUS.join(', ')}`,
      );
    }
    // Bug pola nyata (ETM-15637, 2026-08-28): last_execution.jira diisi kode card
    // padahal TC belum pernah dieksekusi (status not_run, at & via kosong) —
    // origin_jira dan last_execution.jira TERTUKAR. origin_jira = asal TC (boleh
    // diisi kapan saja), last_execution.jira = card run INI (hanya sah kalau memang
    // sudah run — auto-ditulis reporter CLI, bukan diisi manual saat create TC).
    if (
      le.status === 'not_run' &&
      (!le.at || le.at === 'null') &&
      (!le.via || le.via === 'null') &&
      le.jira && le.jira !== 'null'
    ) {
      errors.push(
        `last_execution.jira="${le.jira}" terisi padahal TC belum pernah dieksekusi ` +
          `(status: not_run, at & via kosong): ${rel} → ini \`origin_jira\`, bukan ` +
          `\`last_execution.jira\`. Pindahkan ke \`origin_jira: ${le.jira}\`, kosongkan ` +
          `\`last_execution.jira: null\` (rule 13 §"origin_jira dan last_execution")`,
      );
    }
    // Aturan mutlak #1/#2 ditegakkan mesin: hasil hanya sah dari run Playwright CLI,
    // dan buktinya adalah `via` yang menunjuk file spec yang benar-benar ada.
    const viaLegacy = le.via?.startsWith('legacy:');
    const viaManual = le.via?.startsWith('manual:');
    const viaCard = le.via?.startsWith('card:');
    const viaMcp = /mcp/i.test(le.via ?? '');
    if (viaMcp) {
      errors.push(
        `last_execution.via menyebut MCP: ${rel} ("${le.via}") →` +
          ` verifikasi lewat MCP BUKAN hasil test (aturan mutlak #1/#2).` +
          ` Set status: unknown + via: "legacy:manual", atau jalankan ulang lewat Playwright CLI`,
      );
    } else if (['passed', 'failed'].includes(le.status) && !viaLegacy) {
      // Hasil apa pun wajib menyebut SIAPA/APA yang menghasilkannya.
      if (!le.via || le.via === 'null') {
        errors.push(
          `last_execution.status: ${le.status} tanpa \`via\`: ${rel} →` +
            ` hasil wajib menyebut asalnya: path spec (run CLI) atau \`manual:{Nama}\``,
        );
      } else if (viaManual) {
        const who = le.via.slice('manual:'.length).trim();
        if (!who) {
          warnings.push(
            `last_execution.via manual tanpa nama: ${rel} →` +
              ` boleh (\`manual\` anonim / \`manual:{device}\`), tapi kalau tahu siapa,` +
              ` tulis \`manual:{Nama}\` — telusur lebih mudah kalau TC ini gagal`,
          );
        }
        // Ditandai dari card Done tapi mengaku run manual → salah jalur. Kalau dasarnya
        // card (bukan eksekusi manual yang benar-benar dilakukan), via-nya `card:{ETM}`.
        if (le.notes && /\b[A-Z]{2,}-\d+\b[\s\S]*\b(done|selesai|closed|resolved)\b/i.test(le.notes)) {
          errors.push(
            `via manual tapi notes berdasar status card: ${rel} (notes: "${le.notes}") →` +
              ` kalau TC ini ditandai dari card Done (bukan kamu jalankan manual), pakai` +
              ` \`via: "card:{ETM-xxxxx}"\` — lihat rule 16 § Card Done. Kalau kamu` +
              ` BENAR-BENAR menjalankannya, tulis actual result yang teramati, bukan status card`,
          );
        }
        if (!le.keys.includes('notes')) {
          errors.push(
            `Run manual tanpa \`notes\`: ${rel} →` +
              ` tulis actual result singkat di \`notes\`. Tanpa itu "${le.status}" cuma klaim,` +
              ` tidak ada yang bisa direview`,
          );
        }
        // `notes` harus ACTUAL result. Kalau isinya cuma mengulang expected_result,
        // artinya tidak ada informasi baru — penguji tidak benar-benar melaporkan apa
        // yang terjadi, atau agent mengarang dari expected.
        const n = words(le.notes);
        const e = words(fm.expected_result);
        if (n.size >= 3 && e.size) {
          let shared = 0;
          for (const w of n) if (e.has(w)) shared++;
          if (shared / n.size >= 0.6) {
            warnings.push(
              `\`notes\` mirip sekali dengan expected_result: ${rel} →` +
                ` notes harus ACTUAL result (apa yang BENAR-BENAR terjadi: pesan persis,` +
                ` idealnya notes berisi apa yang BENAR-BENAR terlihat (pesan persis,` +
                ` nilai yang muncul). Kalau memang tidak ada revisi dari expected, abaikan.`,
            );
          }
        }
        // Status card Jira BUKAN bukti pengujian (rule 12). Pola "Card X Done" sebagai
        // isi notes berarti tidak ada satu pun perilaku yang benar-benar diamati.
        const CARD_AS_PROOF =
          /^\s*(card\s+)?[A-Z]{2,}-\d+\s*(sudah\s+)?(done|closed|selesai|resolved)\s*\.?\s*$/i;
        if (le.notes && CARD_AS_PROOF.test(le.notes)) {
          errors.push(
            `Status card dipakai sebagai bukti lulus: ${rel} (notes: "${le.notes}") →` +
              ` card Done = pekerjaan selesai, BUKAN pengujian terbukti (rule 12).` +
              ` Tulis apa yang benar-benar diamati saat TC ini dijalankan, atau kembalikan` +
              ` ke status: not_run dan tanyakan hasilnya ke penguji`,
          );
        } else if (le.notes && words(le.notes).size < 5) {
          errors.push(
            `\`notes\` terlalu tipis untuk jadi actual result: ${rel} (notes: "${le.notes}") →` +
              ` sebutkan yang teramati (pesan/nilai/kondisi layar), bukan satu frasa status`,
          );
        }
        if (/^manual:\s*(qa|tim|team|all|semua)\b/i.test(le.via ?? '')) {
          warnings.push(
            `Penguji manual tidak spesifik: ${rel} (via: "${le.via}") —` +
              ` "${le.via.split(':')[1]?.trim()}" bukan orang. Kalau TC ini gagal, tidak ada` +
              ` yang bisa ditanya`,
          );
        }

        // `jira` di last_execution = card untuk run INI, bukan asal-usul TC.
        if (le.jira && le.jira !== 'null' && le.jira === fm.origin_jira) {
          warnings.push(
            `last_execution.jira sama dengan origin_jira (${le.jira}): ${rel} —` +
              ` pastikan run ini memang untuk card itu, bukan hasil menyalin asal-usul`,
          );
        }
        manual.push(rel);
      } else if (viaCard) {
        // Ditandai berdasarkan card Jira Done (SOP: Done = sudah ditest). Identitas
        // penguji dari kredensial Jira, jadi tidak perlu nama manual (rule 16 § Card Done).
        const etm = le.via.slice('card:'.length).trim();
        if (!/^ETM-\d+$/.test(etm)) {
          errors.push(`via card kode tidak valid: ${rel} ("${etm}") → tulis \`card:ETM-{angka}\``);
        }
        if (!le.jira || le.jira === 'null' || le.jira !== etm) {
          errors.push(
            `via card:${etm} tapi last_execution.jira != ${etm}: ${rel} →` +
              ` isi \`jira: ${etm}\` (card yang jadi dasar penandaan)`,
          );
        }
        if (!le.keys.includes('notes')) {
          errors.push(`via card tanpa \`notes\`: ${rel} → sebut dasarnya, mis. "Ditandai berdasarkan card ${etm} Done"`);
        }
        // via card = pencatat TIDAK menjalankan test sendiri. Notes DILARANG mengarang
        // detail eksekusi seolah dia yang menjalankan/menyaksikan (celah kegagalan F).
        if (le.notes && /(di|pada)\s+staging|berhasil\s+di\b|sukses\s+di\b|passed\s+di\b|dijalankan|dieksekusi/i.test(le.notes)) {
          errors.push(
            `via card tapi notes mengarang detail eksekusi: ${rel} (notes: "${le.notes}") →` +
              ` menandai dari card BUKAN menjalankan test. Notes cukup sebut dasarnya` +
              ` ("berdasarkan card ${etm} Done"); jangan klaim "berhasil di staging" dsb yang` +
              ` tidak kamu lakukan. Kalau card Done disertai catatan, cerminkan itu`,
          );
        }
        manual.push(rel);
      } else if (!fs.existsSync(path.join(root, le.via))) {
        errors.push(
          `last_execution.via menunjuk spec yang tidak ada: ${le.via} (di ${rel}) →` +
            ` kalau ini run manual, tulis \`manual:{Nama}\` + \`notes\`, bukan path spec`,
        );
      } else {
        cliVerified.push(rel);
      }
    }
    if (viaLegacy && ['passed', 'failed'].includes(le.status)) unverified.push(rel);
  }

  const fe = fm.first_execution;
  if (!fe) {
    warnings.push(
      `Tidak ada blok \`first_execution\`: ${rel} → tambahkan { at, via, jira } (null sampai run pertama).` +
        ` Jalankan \`npm run tc:backfill-first-execution\` untuk backfill massal`,
    );
  } else {
    const feMissing = FE_KEYS.filter((k) => !fe.keys.includes(k));
    const feExtra = fe.keys.filter((k) => !FE_KEYS.includes(k));
    if (feMissing.length || feExtra.length) {
      errors.push(
        `Bentuk \`first_execution\` menyimpang: ${rel} →` +
          (feMissing.length ? ` kurang ${feMissing.join(', ')};` : '') +
          (feExtra.length ? ` key asing ${feExtra.join(', ')};` : '') +
          ` wajib tepat {${FE_KEYS.join(', ')}} (rule 13 §first_execution)`,
      );
    }
    for (const [field, val] of [['first_execution.jira', fe.jira]]) {
      if (!val || val === 'null' || val === '~') continue;
      if (/^ETM-\d+$/.test(val)) continue;
      if (/^[A-Z]{2,}-\d+$/.test(val)) {
        warnings.push(`${field} pakai site non-ETM: ${rel} ("${val}") — rule 12: hanya ETM`);
      } else {
        errors.push(`${field} format tidak valid: ${rel} ("${val}") → wajib \`ETM-{angka}\``);
      }
    }
    const feAt = fe.at && fe.at !== 'null' ? fe.at.replace(/^"|"$/g, '') : null;
    const leAt = le?.at && le.at !== 'null' ? le.at.replace(/^"|"$/g, '') : null;
    if (feAt && leAt && feAt > leAt) {
      errors.push(
        `first_execution.at (${feAt}) setelah last_execution.at (${leAt}): ${rel} →` +
          ` tanggal pertama tidak boleh lebih baru dari terakhir`,
      );
    }
    if (leAt && !feAt && le && le.status && le.status !== 'not_run') {
      errors.push(
        `last_execution sudah terisi tapi first_execution.at kosong: ${rel} →` +
          ` jalankan \`npm run tc:backfill-first-execution\` atau \`#sync-jira-done\``,
      );
    }
    if (feAt && le && le.status === 'not_run' && (!leAt || leAt === 'null')) {
      warnings.push(
        `first_execution.at terisi tapi last_execution belum run: ${rel} → verifikasi konsistensi`,
      );
    }
  }

  // `test_result` = arsip diagnostik (log_summary/timestamp), BUKAN sumber kebenaran.
  const TR_STATUS = ['passed', 'failed', 'blocked', 'skipped', 'not_run'];
  if (fm.test_result_status && !TR_STATUS.includes(fm.test_result_status)) {
    errors.push(
      `test_result.status tidak sah "${fm.test_result_status}": ${rel} →` +
        ` pilih: ${TR_STATUS.join(', ')} (dan ingat: yang dibaca tooling adalah \`last_execution\`)`,
    );
  }

  // `related_menus` — daftar slug menu lain yang tersentuh TC ini. Dipakai manusia
  // untuk menelusuri dampak lintas menu; formatnya harus konsisten supaya bisa
  // di-grep dan (nanti) dibaca tooling.
  for (const entry of fm.relatedMenus) {
    if (/:/.test(entry)) {
      errors.push(
        `related_menus format salah di ${rel}: "${entry}" —` +
          ` tulis slug langsung (\`- ${entry.split(':').pop().trim()}\`), bukan pasangan key/value`,
      );
    } else if (!validMenuSlugs.has(entry)) {
      errors.push(
        `related_menus menunjuk menu yang tidak ada: "${entry}" (di ${rel})` +
          ` — cek ejaan slug terhadap folder qa-docs/`,
      );
    } else if (entry === fm.menu) {
      warnings.push(`related_menus menyebut menunya sendiri (${entry}): ${rel}`);
    }
  }
  if (fm.test_type === 'cross-menu' && fm.relatedMenus.length === 0) {
    warnings.push(
      `test_type cross-menu tapi \`related_menus\` kosong: ${rel}` +
        ` — isi menu lain yang tersentuh supaya dampak lintas menunya bisa ditelusuri`,
    );
  }

  // Konsistensi kode Jira — sumber data yang harus valid (rule 12: site hanya ETM).
  // origin_jira & last_execution.jira harus `null` atau `ETM-{angka}`. Format rusak
  // (tanpa dash, typo prefix, angka saja) = error; prefix non-ETM = warning (rule 12).
  const JIRA_OK = /^ETM-\d+$/;
  const JIRA_SHAPE = /^[A-Za-z]+-?\d+$/;
  for (const [field, val] of [['origin_jira', fm.origin_jira], ['last_execution.jira', fm.last_execution?.jira]]) {
    if (!val || val === 'null' || val === '~') continue;
    if (JIRA_OK.test(val)) continue;
    if (/^[A-Z]{2,}-\d+$/.test(val)) {
      warnings.push(`${field} pakai site non-ETM: ${rel} ("${val}") — rule 12: hanya ETM`);
    } else {
      errors.push(
        `${field} format tidak valid: ${rel} ("${val}") → wajib \`ETM-{angka}\`` +
          (JIRA_SHAPE.test(val) ? ` (kemungkinan kurang tanda "-" atau salah prefix)` : ``),
      );
    }
  }

  // Gate anti-duplikat: TC yang ditandai kandidat duplikat TIDAK BOLEH lolos ke
  // #renumber-tc — begitu dapat nomor final, duplikat jadi "resmi" dan sulit dicabut.
  if (fm.duplicate_candidate) {
    errors.push(
      `TC ditandai kandidat duplikat dari ${fm.duplicate_candidate}: ${rel}` +
        ` → putuskan SEBELUM #renumber-tc: hapus file ini, ATAU hapus field` +
        ` \`duplicate_candidate\` kalau sudah dipastikan unik (jelaskan bedanya di summary)`,
    );
  }

  if (fm.automated_spec && fm.automated_spec !== 'null') {
    const specPath = path.join(root, fm.automated_spec);
    if (!fs.existsSync(specPath)) {
      warnings.push(`automated_spec tidak ditemukan: ${fm.automated_spec} (di ${rel})`);
    } else if (!/@(TC|FLOW|ETM)-/.test(fs.readFileSync(specPath, 'utf-8'))) {
      // `npm test` hanya menjalankan spec bertag — spec tanpa tag tidak akan
      // pernah jalan di suite walau TC-nya mengklaim automated.
      errors.push(
        `Spec dirujuk TC tapi TIDAK bertag @TC-*/@FLOW-*/@ETM-*: ${fm.automated_spec} (dirujuk ${rel})` +
          ` → tambahkan tag di judul test, kalau tidak spec ini tidak ikut \`npm test\``,
      );
    }
  }
}

// Jaring pengaman pasca-renumber: konstanta di tests/scenarios/ yang menunjuk kode TC
// yang tidak ada lagi = rujukan putus (biasanya karena renumber lupa memperbaruinya,
// rule 13 §9 langkah 8). Dicek terpisah dari `recalls:` karena letaknya di kode.
const scenarioDir = path.join(root, 'tests', 'scenarios');
if (fs.existsSync(scenarioDir)) {
  for (const f of fs.readdirSync(scenarioDir)) {
    if (!f.endsWith('.ts')) continue;
    const rel = `tests/scenarios/${f}`;
    const text = fs.readFileSync(path.join(scenarioDir, f), 'utf-8');
    for (const m of text.matchAll(/'((?:TC|PENDING)-[A-Z0-9-]+)'/g)) {
      const code = m[1];
      // Nilai konstanta bisa gabungan ("TC-A + TC-B") — pecah dan cek satu per satu.
      for (const part of code.split(/\s*\+\s*/)) {
        if (!part || byCode.has(part)) continue;
        errors.push(
          `${rel} menunjuk TC yang tidak ada: ${part}` +
            ` → rujukan putus. Cek \`npm run tc:refs\` dan perbarui (rule 13 §9 langkah 8)`,
        );
      }
    }
  }
}

// Catatan: deteksi duplikat via kemiripan judul sengaja TIDAK dipakai — TC ERP
// memang berpola (mis. "X CREATE — …" vs "X IMPORT — …" adalah varian sah), sehingga
// noise-nya tinggi, sementara duplikat nyata sering berjudul beda bahasa (ID vs EN)
// dan lolos. Anti-duplikat ditegakkan lewat: (a) proses "cek TC existing sebelum buat
// baru" (rule 13), (b) gate `duplicate_candidate` di atas yang memblokir #renumber-tc.

for (const doc of allDocs) {
  for (const recalled of doc.recalls) {
    if (/^PENDING-/.test(recalled)) {
      // Bukan error: TC-nya ADA dan boleh dieksekusi. Yang perlu diingat hanya
      // bahwa #renumber-tc wajib memperbarui rujukan ini (rule 13 §9 langkah 8).
      warnings.push(
        `${doc.rel} me-recall TC yang belum bernomor (${recalled}) —` +
          ` pastikan #renumber-tc ikut memperbarui rujukan ini`,
      );
    } else if (!byCode.has(recalled)) {
      errors.push(`${doc.rel} me-recall TC yang tidak ada: ${recalled}`);
    }
  }
}

console.log(`TC Lint — ${allDocs.length} dokumen TC dipindai`);
console.log(
  `  ℹ️  Asal hasil: ${cliVerified.length} run CLI · ${manual.length} manual ·` +
    ` ${unverified.length} warisan (belum terverifikasi)`,
);
if (unverified.length) {
  console.log(
    `  ℹ️  ${unverified.length} TC hasilnya masih warisan (\`via: legacy:*\`) — belum pernah` +
      ` diverifikasi reporter CLI. Angka ini HARUS turun tiap run nyata; kalau tidak turun,` +
      ` berarti spec-nya tidak benar-benar jalan.`,
  );
}
if (untyped.length) {
  console.log(
    `  ℹ️  ${untyped.length} TC lama belum punya \`test_type\` (rule 13 §3A) —` +
      ` backfill bertahap, cek prioritas: npm run tc:coverage`,
  );
}
for (const w of warnings) console.log(`  ⚠️  ${w}`);
for (const e of errors) console.log(`  ❌ ${e}`);
if (errors.length) {
  console.log(`\n${errors.length} error — perbaiki sebelum menambah/mengeksekusi TC terkait.`);
  process.exit(1);
}
console.log(`Bersih${warnings.length ? ` (${warnings.length} warning)` : ''} — tidak ada duplikat/rujukan putus.`);
