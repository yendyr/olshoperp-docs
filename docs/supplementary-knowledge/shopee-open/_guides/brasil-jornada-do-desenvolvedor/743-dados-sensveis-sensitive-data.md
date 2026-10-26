# Dados Sensíveis (Sensitive Data)

> **Source:** [https://open.shopee.com/developer-guide/743](https://open.shopee.com/developer-guide/743)
> **Type:** Developer Guide / Overview
> **document_id:** `743`
> **Section:** BRASIL | Jornada do Desenvolvedor / Sua trilha começa aqui!

## Content

Dados mascarados e Nota FiscalObjetivoEntender quando os dados do comprador estarão disponíveis para emissão da Nota Fiscal e como consultar essas informações pelas APIs da Shopee.
📌Lembrete: é necessário ter declarado IP Whitelist nos passos anteriores, dentro da sua aplicação.O que você fará nesta etapaVocê aprenderá quais dados do comprador podem ser retornados pelas APIs, em quais status do pedido essas informações ficam disponíveis e como verificar se um pedido já possui Nota Fiscal vinculada. Para não perder possíveis atualizações, sugerimos verificar a documentação na íntegra: https://open.shopee.com/developer-guide/382 (https://open.shopee.com/developer-guide/382) 
 
 
Antes de continuar, você deve saber- Para vendedores CNPJ, a emissão da Nota Fiscal é obrigatória.
- Os dados do comprador são disponibilizados apenas quando necessários para o processo logístico e fiscal.
- Por questões de privacidade, algumas informações são mascaradas ou nunca são retornadas pelas APIs.
- O comportamento varia de acordo com o tipo de vendedor (CPF ou CNPJ) e com o status do pedido.
Informações necessárias para emissão da Nota Fiscal ficam disponíveis APENAS nos seguintes status:- INVOICE_PENDING
- READY_TO_SHIP
- PROCESSED
- RETURN / REFUND
APIs afetadasv2.order.get_order_detail
v2.order.get_order_list
Confira sempre a documentação original na íntegra para não perder informações e atualizações.

## Content (raw HTML)

```html
<h1>Dados mascarados e Nota Fiscal</h1><h2>Objetivo</h2><p>Entender quando os dados do comprador estarão disponíveis para emissão da Nota Fiscal e como consultar essas informações pelas APIs da Shopee.</p><h3><strong>📌Lembrete: é necessário ter declarado IP Whitelist nos passos anteriores, dentro da sua aplicação.</strong></h3><figure class="image image_resized" style="width:268px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=uKqOyMcbRP34mwhJn5BM3CXeZrwR9Wm42T%2FEegcseLJRqsRGBdAZcXF7XMmyTR4XgSweaLAXHW2ZrRUVNE3c2A%3D%3D&amp;image_type=png"></figure><h2>O que você fará nesta etapa</h2><p>Você aprenderá quais dados do comprador podem ser retornados pelas APIs, em quais status do pedido essas informações ficam disponíveis e como verificar se um pedido já possui Nota Fiscal vinculada. <strong>Para não perder possíveis atualizações, sugerimos verificar a documentação na íntegra: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/382"><strong>https://open.shopee.com/developer-guide/382</strong></a><strong>&nbsp;</strong></p><p>&nbsp;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=kFswSlwBZWzMjBgvuY1pPg%2B1%2BypT%2FgcP3HgEWq4VhGDWlfcqLXJWOpu44rwYyftj9wovLFjXQHBh6dF87FrUGA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><h2>Antes de continuar, você deve saber</h2><ul><li>Para vendedores <strong>CNPJ</strong>, a emissão da Nota Fiscal é obrigatória.</li><li>Os dados do comprador são disponibilizados apenas quando necessários para o processo logístico e fiscal.</li><li>Por questões de privacidade, algumas informações são mascaradas ou nunca são retornadas pelas APIs.</li><li>O comportamento varia de acordo com o tipo de vendedor (CPF ou CNPJ) e com o status do pedido.</li></ul><h2>Informações necessárias para emissão da Nota Fiscal ficam disponíveis APENAS nos seguintes status:</h2><ul><li>INVOICE_PENDING</li><li>READY_TO_SHIP</li><li>PROCESSED</li><li>RETURN / REFUND</li></ul><h2>APIs afetadas</h2><p>v2.order.get_order_detail<br>v2.order.get_order_list</p><h3><i>Confira sempre a documentação original na íntegra para não perder informações e atualizações.</i></h3><p>&nbsp;</p>
```
