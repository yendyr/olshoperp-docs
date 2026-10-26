# APIs de Order (Pedido)

> **Source:** [https://open.shopee.com/developer-guide/383](https://open.shopee.com/developer-guide/383)
> **Type:** Developer Guide / Overview
> **document_id:** `383`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

Fluxo de order 
 Identificando uma nova order 
Atualmente existem duas formas de identificarmos uma nova order via API:
 
1 - Push Mechanism (Webhooks):
 
Com o Push Mechanism ativado sempre que uma nova order for criada ou mudar de status, um novo Push será enviado para o link informado (callback URL), a qual você precisa configurar para responder de acordo com esses requisitos de resposta HTTP:
- Incluir código de status 2xx;
- Incluir um corpo vazio (método POST);
 
Atualmente é possível ativar o Push Mechanism:
 
a) API "v2.push.set_push_config": informando quais Push devem ser ativados, o Push para criação e mudança de status das orders é o "order_status":
 
- Segue exemplo de request:
 
{

"push_config": {

"order_status": 1,

},

"callback_url": "www.site.com.br"

} 
b) Open Platform: faça login na Open Platform > Console > App Management > Push Mechanism > Set Push e "ligar" nesse botões abaixo os Webhooks que deseja:
2 - Pela API v2.get_order_list: (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1)
 
Chamando a API get_order_list, seu response trará todas as order_sn do ShopId e período específico;
 
- Inserindo o parâmetro opcional "response_optional_fields=order_status", o response também apresentará os status das orders, como no exemplo abaixo:
 
Request:
curl --location --request GET

'https://partner.shopeemobile.com/api/v2/order/get_order_list?timestamp=timestamp&shop_id=shop_id&partner_id=partner_id&access_token=access_token&page_size=2&response_optional_fields=order_status&time_range_field=create_time&time_from=1607235072&time_to=1608271872&sign=sign&cursor=""' 
Response:
{

"error": "",

"message": "",

"response": {

"more": true,

"next_cursor":"2",

"order_list": [{

"order_sn": "201218V2Y6E59M",

"order_status": “READY_TO_SHIP”

},

{

"order_sn": "201218V2W2SG1E",

"order_status": “PENDING_INVOICE”

},

]

},

"request_id": "XXXXXXXXXXXXXXXXXX"

} 
Status das orders na OpenAPI 
As orders podem ter 8 diferentes status na OpenAPI:
 
1 - UNPAID: 
Para orders que acabaram de ser criadas e ainda não foi possível validar o pagamento.
Normalmente orders de Boleto ou Pix apresentam esse status, pois as orders de Cartão de Crédito são validadas em minutos (às vezes até segundos).
 
2 - INVOICE_PENDING:
Esse status atualmente aparece apenas na API v2.get_order_list (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1) e faz referência a orders que ainda não foi informado seus dados de invoice (usado apenas para orders não Correios).
 
3 - READY_TO_SHIP:
Para orders Correios que já tiveram sua confirmação de pagamento, ou para orders não correios onde os dados de invoice já foram enviados com sucesso.
 
Orders nesse status estão prontas para Organização de envio (v2.ship_order (https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1)). Lembrando que é recomendado iniciar a organização de envio (ship_order) após 1 hora da confirmação de pagamento, pois dentro desse período o Buyer pode cancelar a pedido sem aprovação do Seller.
 
4 - PROCESSED: 
Orders que já tiveram organização de envio (v2.ship_order) e ainda não foi gerado o tracking Number.
 
5 - SHIPEED:
Após o pacote ser entregue ao parceiro logístico.
 
6 - TO_CONFIRM_RECEIVE:
Aguardando confirmação do buyer de recebimento.
 
7 - COMPLETED:
Quando a order chega a seu destino final, seja ele a casa do buyer, ou nos casos de devolução, retorna ao Seller.
 
8 - TO_RETURN:
Status quando buyer abre a solicitação de devolução do pedido.
 
9 - CANCELLED:
Quando a order é Cancelada, que pode ocorrer quando o buyer cancela o pedido, quando o Seller não organiza o pedido ou quando o pedido é perdido durante a entrega.
 
Segue comparação de status entre OpenAPI e Seller Center (que também pode ser encontrada na nossa Documentação (https://open.shopee.com/developer-guide/31)):
 
OpenAPISellerCenterUNPAIDNão PagoREADY_TO_SHIPA enviar (A enviar)IN_CANCELCancelado (A responder)CANCELLEDCancelado (Cancelado)SHIPPEDA enviar (Processado)TO_RETURNEnviadoTO_CONFIRM_RECEIVEDevolução ReembolsoCOMPLETEDShipping (Shipped) 
Cancelamento de pedidos 
Para cancelamento de pedidos do lado do Seller, utilize a API v2.cancel_order (https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&type=1), algumas regras:
 
1 - Não é possível cancelar uma order após a organização de envio e geração do tracking_number;
 
2 - Existem 4 motivos disponíveis para cancelamento:
- OUT_OF_STOCK: Para quando o estoque tiver acabado (sempre que esse for o motivo é necessário o envio do array “”item_list”:[“item_id”, “model_id”]” );
- CUSTOMER_REQUEST: Quando o Buyer solicita e não consegue mais cancelar sem sua autorização;
- UNDELIVERABLE_AREA: Quando o endereço solicitado não está dentro da sua área de entrega;
- COD_NOT_SUPPORTED: Cash in Delivery, não disponível para o Brasil.
 
Segue exemplo de request body para cancelamento de order:
 
{

"order_sn": "201020SQQ5K2EP",

"cancel_reason": "OUT_OF_STOCK",

"item_list": [{

"item_id": 1680783,

"model_id": 327890123

}

]

} 
Caso receba a mensagem de erro: 
 
"Can not cancel this order.": é porque o pedido não pode ser cancelado por já ter sido gerado seu "tracking_number", ou porque a order já foi cancelada. Qualquer situação diferente dessas duas, por gentileza nos acionar via Plataforma de Tickets (https://open.shopee.com/myconsole/ticket-system/raise-ticket/)).
 
Já para solicitação de cancelamento de pedido do lado do buyer, utilize a API v2.handle_buyer_cancellation (https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&type=1) para aceitar ou rejeitar a solicitação de cancelamento.
 
Dúvidas frequentes (FAQ) 
1 - Seguem algumas APIs que não são usadas para integrações no Brasil:
 
"v2.order.split_order";
"v2.order.unsplit_order";
"v2.order.get_buyer_invoice_info";
"v2.order.get_pending_buyer_invoice_order_list";
"v2.order.upload_invoice_doc";
"v2.order.download_invoice_doc";
 
2 - Por que foi possível criar uma order se o estoque foi zerado semana passada?
 
Existem dois cenários possíveis, um deles é que o Seller tem um estoque separado e reservado para campanhas, a outra possibilidade é que uma order antiga foi cancelada e restaurou o estoque (toda order cancelada restaura o estoque automaticamente).

## Content (raw HTML)

```html
<h2><strong>Fluxo de order</strong></h2><p>&nbsp;</p><figure class="image"><img src="https://cf.shopee.sg/file/f2bfc2e016b095f9bc0325e2b3979c10"></figure><h2>&nbsp;</h2><h2><strong>Identificando uma nova order</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Atualmente existem duas formas de identificarmos uma nova order via API:</span></p><p>&nbsp;</p><p><strong>1 - Push Mechanism (Webhooks):</strong></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Com o Push Mechanism ativado sempre que uma nova order for criada ou mudar de status, um novo Push será enviado para o link informado (callback URL), a qual você precisa configurar para responder de acordo com esses requisitos de resposta HTTP:</span></p><ol><li><span style="background-color:rgb(255,255,255);color:rgb(0,0,0);">Incluir código de status 2xx;</span></li><li><span style="background-color:rgb(255,255,255);color:rgb(0,0,0);">Incluir um corpo vazio (método POST);</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Atualmente é possível ativar o Push Mechanism:</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">a) API "</span><span style="background-color:rgb(255,255,255);color:rgb(0,0,0);">v2.push.set_push_config": informando quais Push devem ser ativados, o Push para criação e mudança de status das orders é o "order_status":</span></p><p>&nbsp;</p><ol><li><span style="background-color:rgb(255,255,255);color:rgb(0,0,0);">Segue exemplo de request:</span></li></ol><p>&nbsp;</p><pre><code class="java hljs">{

"push_config": {

"order_status": 1,

},

"callback_url": "www.site.com.br"

}</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(0,0,0);">b) Open Platform: faça login na Open Platform &gt; Console &gt; App Management &gt; Push Mechanism &gt; Set Push e "ligar" nesse botões abaixo os Webhooks que deseja:</span></p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=1xwkte6qdiCTaaSGeVzOHtm7u9catV5AyyGLACwSS%2F4pRM2ZYtt50Zl2ASUi8Ot8vE12gkqbY0RCESEnsVbINQ%3D%3D&amp;image_type=jpg"></figure><p><strong>2 - Pela API </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><strong>v2.get_order_list:</strong></a></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Chamando a API get_order_list, seu response trará todas as order_sn do ShopId e período específico;</span></p><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Inserindo&nbsp;o parâmetro opcional "response_optional_fields=order_status", o response também apresentará os status das orders, como no exemplo abaixo:</span></li></ol><p>&nbsp;</p><p><strong>Request:</strong></p><pre><code class="java hljs">curl --location --request GET

'https://partner.shopeemobile.com/api/v2/order/get_order_list?timestamp=timestamp&amp;shop_id=shop_id&amp;partner_id=partner_id&amp;access_token=access_token&amp;page_size=2&amp;response_optional_fields=order_status&amp;time_range_field=create_time&amp;time_from=1607235072&amp;time_to=1608271872&amp;sign=sign&amp;cursor=""'</code></pre><p>&nbsp;</p><p><strong>Response:</strong></p><pre><code class="java hljs">{

"error": "",

"message": "",

"response": {

"more": true,

"next_cursor":"2",

"order_list": [{

"order_sn": "201218V2Y6E59M",

"order_status": “READY_TO_SHIP”

},

{

"order_sn": "201218V2W2SG1E",

"order_status": “PENDING_INVOICE”

},

]

},

"request_id": "XXXXXXXXXXXXXXXXXX"

}</code></pre><p>&nbsp;</p><h2><strong>Status das orders na OpenAPI</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">As orders podem ter 8 diferentes status na OpenAPI:</span></p><p>&nbsp;</p><p><strong>1 - UNPAID:&nbsp;</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Para orders que acabaram de ser criadas e ainda não foi possível validar o pagamento.</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Normalmente orders de Boleto ou Pix apresentam esse status, pois as orders de Cartão de Crédito são validadas em minutos (às vezes até segundos).</span></p><p>&nbsp;</p><p><strong>2 - INVOICE_PENDING:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Esse status atualmente aparece apenas na API </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><strong>v2.get_order_list</strong></a><span style="background-color:transparent;color:rgb(0,0,0);"> e faz referência a orders que ainda não foi informado seus dados de invoice (usado apenas para orders não Correios).</span></p><p>&nbsp;</p><p><strong>3 - READY_TO_SHIP:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Para orders Correios que já tiveram sua confirmação de pagamento, ou para orders não correios onde os dados de invoice já foram enviados com sucesso.</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Orders nesse status estão prontas para Organização de envio (</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&amp;type=1"><strong>v2.ship_order</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">). Lembrando que é recomendado iniciar a organização de envio (ship_order) após 1 hora da confirmação de pagamento, pois dentro desse período o Buyer pode cancelar a pedido sem aprovação do Seller.</span></p><p>&nbsp;</p><p><strong>4 - PROCESSED:&nbsp;</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Orders que já tiveram organização de envio (v2.ship_order) e ainda não foi gerado o tracking Number.</span></p><p>&nbsp;</p><p><strong>5 - SHIPEED:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Após o pacote ser entregue ao parceiro logístico.</span></p><p>&nbsp;</p><p><strong>6 - TO_CONFIRM_RECEIVE:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Aguardando confirmação do buyer de recebimento.</span></p><p>&nbsp;</p><p><strong>7 - COMPLETED:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Quando a order chega a seu destino final, seja ele a casa do buyer, ou nos casos de devolução, retorna ao Seller.</span></p><p>&nbsp;</p><p><strong>8 - TO_RETURN:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Status quando buyer abre a solicitação de devolução do pedido.</span></p><p>&nbsp;</p><p><strong>9 - CANCELLED:</strong></p><p><span style="background-color:transparent;color:rgb(0,0,0);">Quando a order é Cancelada, que pode ocorrer quando o buyer cancela o pedido, quando o Seller não organiza o pedido ou quando o pedido é perdido durante a entrega.</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Segue comparação de status entre OpenAPI e Seller Center (que também pode ser encontrada na nossa </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/31"><strong>Documentação</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">):</span></p><p>&nbsp;</p><figure class="table"><table><tbody><tr><td colspan="1" rowspan="1"><strong>OpenAPI</strong></td><td colspan="1" rowspan="1"><strong>SellerCenter</strong></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">UNPAID</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Não Pago</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">READY_TO_SHIP</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">A enviar (A enviar)</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">IN_CANCEL</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Cancelado (A responder)</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">CANCELLED</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Cancelado (Cancelado)</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">SHIPPED</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">A enviar (Processado)</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">TO_RETURN</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Enviado</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">TO_CONFIRM_RECEIVE</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Devolução Reembolso</span></td></tr><tr><td colspan="1" rowspan="1"><span style="color:rgb(0,0,0);">COMPLETED</span></td><td colspan="1" rowspan="1"><span style="background-color:transparent;color:rgb(0,0,0);">Shipping (Shipped)</span></td></tr></tbody></table></figure><p>&nbsp;</p><h2><strong>Cancelamento de pedidos</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Para cancelamento de pedidos do lado do Seller, utilize a API </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&amp;type=1"><strong>v2.cancel_order</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">, algumas regras:</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">1 - Não é possível cancelar uma order após a organização de envio e geração do tracking_number;</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">2 - Existem 4 motivos disponíveis para cancelamento:</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">OUT_OF_STOCK: Para quando o estoque tiver acabado (sempre que esse for o motivo é necessário o envio do array “”item_list”:[“item_id”, “model_id”]” );</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">CUSTOMER_REQUEST: Quando o Buyer solicita e não consegue mais cancelar sem sua autorização;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">UNDELIVERABLE_AREA: Quando o endereço solicitado não está dentro da sua área de entrega;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">COD_NOT_SUPPORTED: Cash in Delivery, não disponível para o Brasil.</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Segue exemplo de request body para cancelamento de order:</span></p><p>&nbsp;</p><pre><code class="java hljs">{

"order_sn": "201020SQQ5K2EP",

"cancel_reason": "OUT_OF_STOCK",

"item_list": [{

"item_id": 1680783,

"model_id": 327890123

}

]

}</code></pre><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Caso receba a mensagem de erro:&nbsp;</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">"Can not cancel this order.": é porque o pedido não pode ser cancelado por já ter sido gerado seu "tracking_number", ou porque a order já foi cancelada. Qualquer situação diferente dessas duas, por gentileza nos acionar via </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/"><strong>Plataforma de Tickets</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">).</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Já para solicitação de cancelamento de pedido do lado do buyer, utilize a API </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&amp;type=1"><strong>v2.handle_buyer_cancellation</strong></a><span style="background-color:transparent;color:rgb(0,0,0);"> para aceitar ou rejeitar a solicitação de cancelamento.</span></p><p>&nbsp;</p><h2><strong>Dúvidas frequentes (FAQ)</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">1 - Seguem algumas APIs que </span><strong>não são usadas</strong><span style="background-color:transparent;color:rgb(0,0,0);"> para integrações no Brasil:</span></p><p>&nbsp;</p><p><i>"v2.order.split_order";</i></p><p><i>"v2.order.unsplit_order";</i></p><p><i>"v2.order.get_buyer_invoice_info";</i></p><p><i>"v2.order.get_pending_buyer_invoice_order_list";</i></p><p><i>"v2.order.upload_invoice_doc";</i></p><p><i>"v2.order.download_invoice_doc";</i></p><p>&nbsp;</p><p><strong>2 - Por que foi possível criar uma order se o estoque foi zerado semana passada?</strong></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Existem dois cenários possíveis, um deles é que o Seller tem um estoque separado e reservado para campanhas, a outra possibilidade é que uma order antiga foi cancelada e restaurou o estoque (toda order cancelada restaura o estoque automaticamente).</span></p>
```
