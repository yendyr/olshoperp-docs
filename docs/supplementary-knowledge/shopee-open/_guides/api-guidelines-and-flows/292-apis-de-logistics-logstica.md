# APIs de Logistics (Logística)

> **Source:** [https://open.shopee.com/developer-guide/292](https://open.shopee.com/developer-guide/292)
> **Type:** Developer Guide / Overview
> **document_id:** `292`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

Fluxo de Chamadas na v2
 
 
O fluxo de chamadas na v2 que relaciona aos canais de envio é conforme:
 
1. A Shopee habilita o canal de envio para o vendedor. (ex.: Correios, aberto a todos os vendedores, Total Express, Sequoia, Loggi, ShopeeXpress).
 
2. Para verificar o canal logístico habilitado em sua loja:
- Basta chamar o endpoint: v2.logistics.get_channel_list
 
3. O vendedor deve definir o canal logístico para cada item de acordo com o que foi liberado para ele pela Shopee:
- Para habilitar/desabilitar os canais de envio do produto: v2.product.add_item ou v2.product.update_item usando os params dentro de logistic_info.
 
4. O vendedor recebe o pedido já com o canal de envio selecionado pelo comprador.
 
5. Para saber se é preciso informar a NF-e para um pedido antes de fazer a organização de envio (ship_order), você pode usar a chamada v2.order.get_order_list com o param "order_status": "INVOICE_PENDING".
- Para informar a NF-e use a chamada v2.order.add_invoice_data.
- Para conferir os dados da NF-e que já foram enviados: v2.order.get_order_detail com o param "response_optional_fields": "invoice_data" e verificar o param "invoice_data".
- Nos casos em que for necessário, a NF-e deve ser informada antes da chamada v2.logistics.ship_order.
 
6. Dependendo do canal de envio selecionado pelo comprador, o vendedor irá postar o pacote ou esperar a coleta.
a) Para saber se é coleta (pickup) ou postagem (dropoff): v2.logistics.get_shipping_parameter
b) Para fazer a organização de envio do pedido: v2.logistics.ship_order
i. Se for dropoff (hoje só temos os Correios como dropoff): caso o info_needed for vazio ("dropoff": []), a request do ship_order deverá ser: 
 
{

"order_sn":"201212DCXXXXX"

"dropoff":{

}

} 
ii. Se for pickup (hoje todos os outros são pickup, incluindo Coleta Correios): caso o info_needed tenha "pickup": ["address_id","pickup_time_id"], a request do ship_order deverá ser:
 
{

"order_sn":"201212DCXXXXX"

,"pickup":{

"address_id":pickup.address_list.address_id do get_shipping_parameter,

,"pickup_time_id": pickup.address_list.time_slot_list. pickup_time_id do get_shipping_parameter

}

} 
iii. Depois disso, para obter o código de rastreio basta chamar o endpoint: v2.logistics.get_tracking_number;
 
7. Todas as etiquetas de envio de pedidos da Shopee devem ser geradas pela Shopee. Com o código de rastreio já gerado, para gerar a etiqueta de envio:
a) Para obter os possíveis params para gerar a etiqueta: v2.logistics.get_shipping_document_parameter
- A response "selectable_shipping_document_type": ["NORMAL_AIR_WAYBILL","THERMAL_AIR_WAYBILL"] informa que a etiqueta pode ser gerada respectivamente em formato .pdf ou .zip (contendo a etiqueta em um .txt em formato ZPL + PDF com a declaração de conteúdo).
 
b) Para pedir para a Shopee gerar a etiqueta de um ou mais pedidos:
- v2.logistics.create_shipping_document
- É preciso enviar o parâmetro "tracking_number".
 
c) Para saber se a etiqueta já foi gerada ou ainda está sendo processada: 
- v2.logistics.get_shipping_document_resultOrder com response "status": "READY" já podem ter a etiqueta obtida.
 
d) Para obter a etiqueta depois que tiver sido gerada pela Shopee:
- v2.logistics.download_shipping_document
 
Todos os status dos pedidos são alterados pela Shopee.
 
Mais detalhes sobre o fluxo de chamadas de pedidos pode ser encontrado em nossa documentação na seção:
"Arrange Shipment & Get TrackingNo & Print AirwayBill": https://open.shopee.com/developer-guide/27 (https://open.shopee.com/developer-guide/27)
 
FAQ 
- Todos os envios são feitos com os canais de envio (transportadoras) direto com a Shopee. 
 
- Na Shopee o frete é pago pelo comprador ou pela Shopee. 
 
- Todas as etiquetas de envio são geradas pela Shopee, um vendedor ou Integradora/ERP nunca deve gerar a etiqueta por conta própria ou alterar a etiqueta da Shopee para nenhum canal de envio. 
 
- Cada vendedor possui um único canal de envio, ou seja, diferentes vendedores podem ter acesso a diferentes canais de envio. 
- Por exemplo, o vendedor 1 tem acesso aos Correios, e o vendedor 2 possui acesso somente à Loggi. 
 
- A Shopee pode habilitar ou desabilitar o acesso de um vendedor a um canal de envio a qualquer momento. 
 
- Pedidos dos Correios não possuem a função para informar a NF-e. 
 
- O vendedor pode emitir a NF-e caso tenha configurado a Shopee como Invoice Issuer.
 
- Quando recebemos os dados da NF-e, avaliamos se: 
- A chave de acesso da NF-e já não foi usada em outro pedido, caso a mesma chave seja informada para mais de um pedido, ela não será aceita. 
- A chave de acesso da NF-e e os dados que o vendedor informou no cadastro de vendedor da Shopee (CNPJ e UF), ou nos outros campos da NF-e (série, número da NF-e, mês/ano, UF) são compatíveis. 
- Se a data da NF-e é posterior à data de pagamento do pedido pelo comprador. 
 
- A documentação e suas chamadas pode ser encontrada em: 
- V2: https://open.shopee.com/documents?version=2.
 
Para dúvidas ou abertura de chamados, clique aqui (https://open.shopee.com/myconsole/ticket-system/raise-ticket/).

## Content (raw HTML)

```html
<p>&nbsp;<strong>Fluxo de Chamadas na v2</strong></p><p>&nbsp;</p><figure class="image"><img src="https://cf.shopee.sg/file/8dca5e13068fa92eace8a072b9146b91"></figure><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">O fluxo de chamadas na v2 que relaciona aos canais de envio é conforme:</span></p><p>&nbsp;</p><p><strong>1. </strong><span style="background-color:transparent;color:rgb(0,0,0);">A Shopee habilita o canal de envio para o vendedor. (ex.: Correios, aberto a todos os vendedores, Total Express, Sequoia, Loggi, ShopeeXpress).</span></p><p>&nbsp;</p><p><strong>2. </strong><span style="background-color:transparent;color:rgb(0,0,0);">Para verificar o canal logístico habilitado em sua loja:</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Basta chamar o endpoint: v2.logistics.get_channel_list</span></li></ol><p>&nbsp;</p><p><strong>3. </strong><span style="background-color:transparent;color:rgb(0,0,0);">O vendedor deve definir o canal logístico para cada item de acordo com o que foi liberado para ele pela Shopee:</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Para habilitar/desabilitar os canais de envio do produto: v2.product.add_item ou v2.product.update_item usando os params dentro de logistic_info.</span></li></ol><p>&nbsp;</p><p><strong>4. </strong><span style="background-color:transparent;color:rgb(0,0,0);">O vendedor recebe o pedido já com o canal de envio selecionado pelo comprador.</span></p><p>&nbsp;</p><p><strong>5. </strong><span style="background-color:transparent;color:rgb(0,0,0);">Para saber se é preciso informar a NF-e para um pedido antes de fazer a organização de envio (ship_order), você pode usar a chamada v2.order.get_order_list com o param "order_status": "INVOICE_PENDING".</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Para informar a NF-e use a chamada v2.order.add_invoice_data.</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Para conferir os dados da NF-e que já foram enviados: v2.order.get_order_detail com o param "response_optional_fields": "invoice_data" e verificar o param "invoice_data".</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Nos casos em que for necessário, a NF-e deve ser informada antes da chamada v2.logistics.ship_order.</span></li></ol><p>&nbsp;</p><p><strong>6.</strong><span style="background-color:transparent;color:rgb(0,0,0);"> Dependendo do canal de envio selecionado pelo comprador, o vendedor irá postar o pacote ou esperar a coleta.</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">a) Para saber se é coleta (pickup) ou postagem (dropoff): v2.logistics.get_shipping_parameter</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">b) Para fazer a organização de envio do pedido: v2.logistics.ship_order</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">i. Se for dropoff (hoje só temos os Correios como dropoff): caso o info_needed for vazio ("dropoff": []), a request do ship_order deverá ser:&nbsp;</span></p><p>&nbsp;</p><pre><code class="python hljs">{

"order_sn":"201212DCXXXXX"

"dropoff":{

}

}</code></pre><p>&nbsp;</p><p>ii. <span style="background-color:transparent;color:rgb(0,0,0);">Se for pickup (hoje todos os outros são pickup, incluindo Coleta Correios): caso o info_needed tenha "pickup": ["address_id","pickup_time_id"], a request do ship_order deverá ser:</span></p><p>&nbsp;</p><pre><code class="python hljs">{

"order_sn":"201212DCXXXXX"

,"pickup":{

"address_id":pickup.address_list.address_id do get_shipping_parameter,

,"pickup_time_id": pickup.address_list.time_slot_list. pickup_time_id do get_shipping_parameter

}

}</code></pre><p>&nbsp;</p><p>iii. <span style="background-color:transparent;color:rgb(0,0,0);">Depois disso, para obter o código de rastreio basta chamar o endpoint: v2.logistics.get_tracking_number;</span></p><p>&nbsp;</p><p><strong>7. </strong><span style="background-color:transparent;color:rgb(0,0,0);">Todas as etiquetas de envio de pedidos da Shopee devem ser geradas pela Shopee. Com o código de rastreio já gerado, para gerar a etiqueta de envio:</span></p><p>a) Para obter os possíveis params para gerar a etiqueta: v2.logistics.get_shipping_document_parameter</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">A response "selectable_shipping_document_type": ["NORMAL_AIR_WAYBILL","THERMAL_AIR_WAYBILL"] informa que a etiqueta pode ser gerada respectivamente em formato .pdf ou .zip (contendo a etiqueta em um .txt em formato ZPL + PDF com a declaração de conteúdo).</span></li></ol><p>&nbsp;</p><p>b) <span style="background-color:transparent;color:rgb(0,0,0);">Para pedir para a Shopee gerar a etiqueta de um ou mais pedidos:</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">v2.logistics.create_shipping_document</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">É preciso enviar o parâmetro "tracking_number".</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">c) Para saber se a etiqueta já foi gerada ou ainda está sendo processada:&nbsp;</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">v2.logistics.get_shipping_document_resultOrder com response "status": "READY" já podem ter a etiqueta obtida.</span></li></ol><p>&nbsp;</p><p>d) <span style="background-color:transparent;color:rgb(0,0,0);">Para obter a etiqueta depois que tiver sido gerada pela Shopee:</span></p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">v2.logistics.download_shipping_document</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Todos os status dos pedidos são alterados pela Shopee.</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Mais detalhes sobre o fluxo de chamadas de pedidos pode ser encontrado em nossa documentação na seção:</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">"Arrange Shipment &amp; Get TrackingNo &amp; Print AirwayBill": </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/27">https://open.shopee.com/developer-guide/27</a></p><p>&nbsp;</p><h2><strong>FAQ</strong></h2><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Todos os envios são feitos com os canais de envio (transportadoras) direto com a Shopee.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Na Shopee o frete é pago pelo comprador ou pela Shopee.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Todas as etiquetas de envio são geradas pela Shopee, um vendedor ou Integradora/ERP nunca deve gerar a etiqueta por conta própria ou alterar a etiqueta da Shopee para nenhum canal de envio.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Cada vendedor possui um único canal de envio, ou seja, diferentes vendedores podem ter acesso a diferentes canais de envio.&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Por exemplo, o vendedor 1 tem acesso aos Correios, e o vendedor 2 possui acesso somente à Loggi.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">A Shopee pode habilitar ou desabilitar o acesso de um vendedor a um canal de envio a qualquer momento.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Pedidos dos Correios não possuem a função para informar a NF-e.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">O vendedor pode emitir a NF-e caso tenha configurado a Shopee como Invoice Issuer.</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Quando recebemos os dados da NF-e, avaliamos se:&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">A chave de acesso da NF-e já não foi usada em outro pedido, caso a mesma chave seja informada para mais de um pedido, ela não será aceita.&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">A chave de acesso da NF-e e os dados que o vendedor informou no cadastro de vendedor da Shopee (CNPJ e UF), ou nos outros campos da NF-e (série, número da NF-e, mês/ano, UF) são compatíveis.&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Se a data da NF-e é posterior à data de pagamento do pedido pelo comprador.&nbsp;</span></li></ol><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">A documentação e suas chamadas pode ser encontrada em:&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">V2: https://open.shopee.com/documents?version=2.</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Para dúvidas ou abertura de chamados, </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/"><strong>clique aqui</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">.</span></p>
```
