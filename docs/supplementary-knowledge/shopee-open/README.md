# Shopee Open Platform API — v2 Reference (snapshot)

> **Status:** Referensi teknis eksternal (suplemen OlshopERP)  
> **Sumber:** [Shopee Open Platform — Documents v2](https://open.shopee.com/documents/v2/)  
> **Cakupan:** seluruh endpoint **API Reference** (type=1) + Developer Guides  
> **Jumlah:** 455 endpoint + 64 guide  
> **Format:** Markdown dari payload resmi `/opservice/api/v1/doc/api/`

## Indeks per modul

| Modul | Endpoint | Folder |
| --- | ---: | --- |
| Product | 63 | [product/](./product/) |
| Logistics | 46 | [logistics/](./logistics/) |
| AMS | 36 | [ams/](./ams/) |
| GlobalProduct | 34 | [globalproduct/](./globalproduct/) |
| Ads | 25 | [ads/](./ads/) |
| Livestream | 25 | [livestream/](./livestream/) |
| Order | 22 | [order/](./order/) |
| Payment | 18 | [payment/](./payment/) |
| FirstMile | 16 | [firstmile/](./firstmile/) |
| Returns | 15 | [returns/](./returns/) |
| Video | 15 | [video/](./video/) |
| Add-On Deal | 14 | [add-on-deal/](./add-on-deal/) |
| Discount | 12 | [discount/](./discount/) |
| BrandPortal | 11 | [brandportal/](./brandportal/) |
| ShopFlashSale | 11 | [shopflashsale/](./shopflashsale/) |
| Bundle Deal | 10 | [bundle-deal/](./bundle-deal/) |
| Shop | 9 | [shop/](./shop/) |
| ShopCategory | 7 | [shopcategory/](./shopcategory/) |
| AccountHealth | 6 | [accounthealth/](./accounthealth/) |
| Follow Prize | 6 | [follow-prize/](./follow-prize/) |
| Media | 6 | [media/](./media/) |
| MediaSpace | 6 | [mediaspace/](./mediaspace/) |
| Merchant | 6 | [merchant/](./merchant/) |
| Public | 6 | [public/](./public/) |
| SBS | 6 | [sbs/](./sbs/) |
| Voucher | 6 | [voucher/](./voucher/) |
| Buybox | 5 | [buybox/](./buybox/) |
| FBS | 4 | [fbs/](./fbs/) |
| Push | 4 | [push/](./push/) |
| TopPicks | 4 | [toppicks/](./toppicks/) |
| BusinessInsights | 1 | [businessinsights/](./businessinsights/) |

## Developer Guides

Lihat [`_guides/`](./_guides/) (64 dokumen).

## Metadata crawl

- [`_meta/api-index.json`](./_meta/api-index.json)
- [`_meta/modules.json`](./_meta/modules.json)

## Catatan QA

- Ini **bukan** requirement OlshopERP; jangan dipakai sebagai AS-IS perilaku menu ERP.
- Signing request: HMAC-SHA256 atas `partner_id`, path, `timestamp`, `access_token`, `shop_id`, `partner_key`.
- Snapshot bisa tertinggal dari docs live — cek Announcement di Open Platform bila ragu.
