# Boas práticas antes de abrir um ticket

> **Source:** [https://open.shopee.com/developer-guide/747](https://open.shopee.com/developer-guide/747)
> **Type:** Developer Guide / Overview
> **document_id:** `747`
> **Section:** BRASIL | Jornada do Desenvolvedor / Sua trilha começa aqui!

## Content

Boas práticas antes de abrir um ticketPara agilizar a investigação e reduzir o tempo de resolução, envie sempre as evidências técnicas necessárias, de acordo com o tipo de problema.
Erros em chamadas de APISempre envie:
- Endpoint utilizado;
- Request completo;;
- Response completo;
- Request ID;
- Data e horário da requisição;
- Evidências geradas nas últimas 24 horas.
Importante: Tickets sem Request ID ou com evidências antigas podem não ser passíveis de investigação.
Erros no fluxo de autorização da loja (Authorization / OAuth)Sempre envie:
- Vídeo completo do fluxo, desde o início até o erro;
- Arquivo HAR da tentativa;
- URL de autorização utilizada;
- Partner ID;
- Ambiente (Sandbox ou Produção);
- Data e horário da tentativa;
- Número de telefone ou e-mail utilizado para realizar o login (pode ser mascarado);
- Mensagem de erro apresentada.
Não é necessário enviar Request ID caso o erro ocorra antes da chamada da API get_access_token.
Erros relacionados ao OTP (código de verificação)Sempre envie:
- Vídeo completo da tentativa;
- Arquivo HAR;
- Número de telefone (ou e-mail, quando aplicável) utilizado para receber o código;
- Data e horário da tentativa;
- Mensagem de erro apresentada;
- Ambiente (Sandbox ou Produção).
Erros durante a obtenção do Access TokenAlém das evidências acima, envie também:
- URL completa de redirecionamento recebida após a autorização;
- Request completo para v2.public.get_access_token;
- Response completo;
- Request ID;
- Data e horário da requisição.
Erros relacionados a Webhooks / Push NotificationsSempre envie:
- URL do Callback;
- Evento configurado;
- Request recebido (Headers e Body);
- Response retornado pelo servidor;
- Código HTTP retornado;
- Data e horário da ocorrência;
- Request ID (quando disponível).
Erros relacionados a Upload de Arquivos ou ImagensSempre envie:
- Endpoint utilizado;
- Request completo;
- Response completo;
- Request ID;
- Arquivo utilizado no teste (quando possível);
- URL retornada pelo upload (quando aplicável);
- Data e horário da tentativa.
Antes de abrir um ticketVerifique se:
- A documentação da API foi consultada;
- O endpoint pertence à categoria do seu aplicativo;
- O aplicativo possui as permissões necessárias;
- O Access Token está válido;
- A assinatura (Sign) foi gerada corretamente;
- O horário do servidor está sincronizado;
- O problema foi reproduzido recentemente (últimas 24 horas).
 
Quanto mais completas forem as evidências enviadas, mais rápida será a investigação. Em muitos casos, a ausência de informações essenciais impede a análise técnica e pode resultar na solicitação de novas evidências antes do início da investigação.

## Content (raw HTML)

```html
<h1>Boas práticas antes de abrir um ticket</h1><p>Para agilizar a investigação e reduzir o tempo de resolução, envie sempre as evidências técnicas necessárias, de acordo com o tipo de problema.</p><h2>Erros em chamadas de API</h2><p>Sempre envie:</p><ul><li>Endpoint utilizado;</li><li>Request completo;;</li><li>Response completo;</li><li>Request ID;</li><li>Data e horário da requisição;</li><li>Evidências geradas nas <strong>últimas 24 horas</strong>.</li></ul><p><strong>Importante:</strong> Tickets sem Request ID ou com evidências antigas podem não ser passíveis de investigação.</p><h2>Erros no fluxo de autorização da loja (Authorization / OAuth)</h2><p>Sempre envie:</p><ul><li>Vídeo completo do fluxo, desde o início até o erro;</li><li>Arquivo HAR da tentativa;</li><li>URL de autorização utilizada;</li><li>Partner ID;</li><li>Ambiente (Sandbox ou Produção);</li><li>Data e horário da tentativa;</li><li>Número de telefone ou e-mail utilizado para realizar o login (pode ser mascarado);</li><li>Mensagem de erro apresentada.</li></ul><p>Não é necessário enviar Request ID caso o erro ocorra antes da chamada da API get_access_token.</p><h2>Erros relacionados ao OTP (código de verificação)</h2><p>Sempre envie:</p><ul><li>Vídeo completo da tentativa;</li><li>Arquivo HAR;</li><li>Número de telefone (ou e-mail, quando aplicável) utilizado para receber o código;</li><li>Data e horário da tentativa;</li><li>Mensagem de erro apresentada;</li><li>Ambiente (Sandbox ou Produção).</li></ul><h2>Erros durante a obtenção do Access Token</h2><p>Além das evidências acima, envie também:</p><ul><li>URL completa de redirecionamento recebida após a autorização;</li><li>Request completo para v2.public.get_access_token;</li><li>Response completo;</li><li>Request ID;</li><li>Data e horário da requisição.</li></ul><h2>Erros relacionados a Webhooks / Push Notifications</h2><p>Sempre envie:</p><ul><li>URL do Callback;</li><li>Evento configurado;</li><li>Request recebido (Headers e Body);</li><li>Response retornado pelo servidor;</li><li>Código HTTP retornado;</li><li>Data e horário da ocorrência;</li><li>Request ID (quando disponível).</li></ul><h2>Erros relacionados a Upload de Arquivos ou Imagens</h2><p>Sempre envie:</p><ul><li>Endpoint utilizado;</li><li>Request completo;</li><li>Response completo;</li><li>Request ID;</li><li>Arquivo utilizado no teste (quando possível);</li><li>URL retornada pelo upload (quando aplicável);</li><li>Data e horário da tentativa.</li></ul><h2>Antes de abrir um ticket</h2><p>Verifique se:</p><ul><li>A documentação da API foi consultada;</li><li>O endpoint pertence à categoria do seu aplicativo;</li><li>O aplicativo possui as permissões necessárias;</li><li>O Access Token está válido;</li><li>A assinatura (Sign) foi gerada corretamente;</li><li>O horário do servidor está sincronizado;</li><li>O problema foi reproduzido recentemente (últimas 24 horas).</li></ul><p>&nbsp;</p><h3><i><strong>Quanto mais completas forem as evidências enviadas, mais rápida será a investigação. Em muitos casos, a ausência de informações essenciais impede a análise técnica e pode resultar na solicitação de novas evidências antes do início da investigação.</strong></i></h3>
```
