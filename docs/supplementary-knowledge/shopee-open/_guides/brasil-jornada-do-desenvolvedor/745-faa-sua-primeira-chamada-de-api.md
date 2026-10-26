# Faça sua primeira chamada de API

> **Source:** [https://open.shopee.com/developer-guide/745](https://open.shopee.com/developer-guide/745)
> **Type:** Developer Guide / Overview
> **document_id:** `745`
> **Section:** BRASIL | Jornada do Desenvolvedor / Sua trilha começa aqui!

## Content

Faça sua primeira chamada de APIObjetivoRealizar sua primeira chamada autenticada para uma API privada da Shopee.
O que você fará nesta etapaVocê escolherá uma API, montará a requisição, gerará a assinatura (sign) e enviará sua primeira solicitação para a Shopee utilizando uma loja já autorizada.
Acesse V2.0 API Call Flow (https://open.shopee.com/developer-guide/27) para verificar exemplos do fluxo de chamada de uma API.
Antes de continuar, você deve saber- Cada chamada para APIs privadas precisa ser assinada utilizando sua Partner Key.
- O timestamp faz parte da assinatura e possui tempo limitado de validade.
- APIs privadas exigem Access Token e Shop ID.
- Cada endpoint possui parâmetros obrigatórios e opcionais específicos.
- O Request ID retornado na resposta deve ser utilizado para investigação de problemas junto ao suporte.
- Consulte sempre a API Reference antes de implementar um endpoint.
Confira API Reference para obter a lista completa- APIs
- Endpoints
- API Permission (quais Apps podem acessar aquela API)
- 📚 https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&type=1 (https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&type=1) 
Erros comuns- Wrong Sign- Partner Key incorreta.
- Timestamp expirado.
- Assinatura calculada incorretamente.
- URL ou parâmetros utilizados de forma diferente do cálculo da assinatura.

- Invalid Access Token- O Access Token expirou.
- A loja ainda não foi autorizada.
- O Access Token pertence a outra loja.

- Permission Denied- O endpoint não faz parte da categoria do App criada.

📚 Leia também:V2.0 Data Definition (https://V2.0)

## Content (raw HTML)

```html
<h1>Faça sua primeira chamada de API</h1><h2>Objetivo</h2><p>Realizar sua primeira chamada autenticada para uma API privada da Shopee.</p><h2>O que você fará nesta etapa</h2><p>Você escolherá uma API, montará a requisição, gerará a assinatura (sign) e enviará sua primeira solicitação para a Shopee utilizando uma loja já autorizada.</p><p>Acesse <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/27">V2.0 API Call Flow</a> para verificar exemplos do <strong>fluxo de chamada de uma API.</strong></p><h2>Antes de continuar, você deve saber</h2><ul><li>Cada chamada para APIs privadas precisa ser assinada utilizando sua <strong>Partner Key</strong>.</li><li>O <strong>timestamp</strong> faz parte da assinatura e possui tempo limitado de validade.</li><li>APIs privadas exigem <strong>Access Token</strong> e <strong>Shop ID</strong>.</li><li>Cada endpoint possui parâmetros obrigatórios e opcionais específicos.</li><li>O <strong>Request ID</strong> retornado na resposta deve ser utilizado para investigação de problemas junto ao suporte.</li><li>Consulte sempre a <strong>API Reference</strong> antes de implementar um endpoint.</li></ul><h2>Confira API Reference para obter a lista completa</h2><ul><li>APIs</li><li>Endpoints</li><li>API Permission (quais Apps podem acessar aquela API)</li><li>📚 <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&amp;type=1">https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product?module=127&amp;type=1</a>&nbsp;</li></ul><figure class="image image_resized" style="width:994px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=ytHc0pVrjGxpPowoV6DEAQTi1vStI6MKghONMIPoAbMqcOBtICvLF%2FxIWfmK2FKHgYzdk6IzRNdyo%2Bi4%2FdOAHg%3D%3D&amp;image_type=png"></figure><h2>Erros comuns</h2><ul><li><strong>Wrong Sign</strong><ul><li>Partner Key incorreta.</li><li>Timestamp expirado.</li><li>Assinatura calculada incorretamente.</li><li>URL ou parâmetros utilizados de forma diferente do cálculo da assinatura.</li></ul></li><li><strong>Invalid Access Token</strong><ul><li>O Access Token expirou.</li><li>A loja ainda não foi autorizada.</li><li>O Access Token pertence a outra loja.</li></ul></li><li><strong>Permission Denied</strong><ul><li>O endpoint não faz parte da categoria do App criada.</li></ul></li></ul><h2>📚 <strong>Leia também:</strong></h2><p><a target="_blank" rel="noopener noreferrer" href="https://V2.0 Data Definition"><span style="background-color:rgb(255,255,255);color:rgb(255,86,15);">V2.0 Data Definition</span></a></p>
```
