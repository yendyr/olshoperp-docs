# Logística do Vendedor (API de Cotação)

> **Source:** [https://open.shopee.com/developer-guide/286](https://open.shopee.com/developer-guide/286)
> **Type:** Developer Guide / Overview
> **document_id:** `286`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

O que é o canal Logística do vendedor  
Este canal permite que o vendedor utilize sua própria logística para cotação e envio de pedidos.
- A cotação de frete é feita a partir da URL de cotação disponibilizada pelo vendedor.
- O preço de envio e prazo de entrega são fornecidos pelo próprio vendedor.
- O rastreamento dos pedidos é simplificado, ficando sob responsabilidade do vendedor enviar os eventos de “despachado”, “entrega” ou “falha na entrega” via OpenAPI.
 
Obs: Este canal será disponibilizado a vendedores específicos, cujos produtos não são suportados pela logística própria da Shopee por conta de dimensões e peso, de acordo com as regras estabelecidas pelo time comercial da Shopee.
URL Cotação de frete 
É a ferramenta que permite ao vendedor enviar para a Shopee o custo do frete e prazo estimados que serão exibidos ao comprador no momento da compra. Para que o vendedor possa utilizar esse recurso, é preciso atender os requisitos de homologação pré-estabelecidos.
 
*O vendedor tem a opção de integrar diretamente com a Shopee para conectar sua URL de cotação ou se conectar via um Integrador-HUB.
Requisitos para homologação/Integração 
Diferente dos outros tipos de integração, a integração da API de cotação e atualização de status de pedido (do canal seller logistics), exigem uma avaliação e aprovação do time Shopee antes de começar a operar. Para ser aprovado pelo time da Shopee é necessário:
- Cumprimento do contrato da API de cotação de frete:- Configurar e disponibilizar a URL via método HTTP POST.
- Cada solicitação (request) deve conter apenas um item de um vendedor.
- A URL não tem uma estrutura específica, proporcionando flexibilidade na configuração.

- Payload padrão da requisição e resposta de cotação (e validação com URL da Shopee)
- Tempo de resposta limite de 400ms.
- Tabela de contingência cadastrada diretamente pela Central do Vendedor.
- Monitoramento de erros (e desenvolvimento das mensagens solicitadas)
- Desenvolvimento API de atualização de status (“update_tracking_status);- Obs: Os requisitos acima devem ser cumpridos pelo “próprio sistema” do vendedor ou pelo seu ERP/HUB/Integração. Vale ressaltar que sem eles os pedidos serão cancelados, pois o fluxo não pode ser realizado via Central do Vendedor de forma manual.
- Obs2: Todos que desenvolverem a API de cotação, também devem desenvolver a API de atualização de status;
- Obs3: O APP Seller Logistics, só é usado para URL de cotação, para usar qualquer API é necessário a criação de um segundo APP;

- Passar e-mail de confirmação e aprovação do time da Shopee via ticket (https://open.shopee.com/myconsole/ticket-system/raise-ticket/) (envolvendo todos critérios acima).
 
Para conseguir realizar a integração e os testes acima também é necessário:
a) Criar novo APP Seller Logistic na Open Platform e autorizar os sellers a esse APP
b) Ter um APP que seja capaz de chamar a OpenAPI para atualização de status (e também autorizar os sellers a esse APP)
Teste de Homologação1. Fluxo Logístico do pedido: Será necessário a criação de pelo menos 2 pedidos, que precisarão ser atualizados até os seguintes status:
- order 1: delivery_done
- order 2: delivery_failed
2. Teste de Cotação no item: Um teste interno de cotação também será feito diretamente em um dos anúncios da loja.
Ambas etapas terão validação interna (essas validações podem levar alguns dias) e daremos a confirmação ao parceiro via ticket que foi aberto pelo mesmo.
 
Observação: Ao completar o fluxo de atualização de status você se compromete que esses status estão corretamente mapeados, integrados e automatizados para envio para API da Shopee. Os pedidos dos vendedores não são atualizados de forma manual pela Shopee, apenas pelo recebimento dos status via API. Caso ocorra problemas futuros, o canal poderá ser desativado após análise da Shopee.
 
(A inclusão interna do parceiro como opção de TMS para RMs solicitarem ativação de lojas, é responsabilidade de outro time interno e o processo de atualização leva, em torno, de 15 dias úteis.)
Criar APP Seller Logistics e autorizar sellers  
Uma vez que sua conta na Open Platform já esteja ativa, o próximo passo é criar um APP que será usado apenas para conectar sua URL de cotação a Shopee e respectivos sellers(shop_Id).
Segue passo a passo, abaixo:
 
1. Fazer Login na Open Platform e entrar na aba “Console”:
 
2. Em “App List” clicar em “+ Add new APP”:
 
3. Selecionar a “App Category” como “Seller Logistics”:
 
4. Inserir no “App Description” as URLs que serão usadas em Live (produção) e em Test (ambiente de teste), e clicar em “Submit”.
*sem problemas se houver apenas uma URL;
 
5. Assim o APP já estará criado, então, só seguir com a solicitação de “Go-Live”, que vai disponibilizar o APP no ambiente de produção em até 24 horas.
 
6. Só é necessário preencher mais algumas infos antes.
Caso não seja possível fornecer um “username” e “password”, podem preencher como no print abaixo:
 
7. Para “App IP”, informar o IP principal da sua aplicação (vale ressaltar que não vamos limitar o acesso apenas a esse IP).
E para “Other IT Assets Declaration”, preencher como no print abaixo.
 
24 horas após a solicitação do “Go-live” o partner_id de Live será liberado e você será notificado via e-mail. Assim que receber o e-mail, os próximos passos são:
 
1 - Abrir um ticket na Plataforma de Tickets da OP (https://open.shopee.com/myconsole/ticket-system/raise-ticket/), com o assunto “Seller Logistics” informando o shop_id (ou quais Shop IDs) pretende conectar a sua URL, assim que recebermos a solicitação e o time da Shopee finalizando a conexão da URL, e permitindo avançar com a autorização do seller.
Obs: cada shop_id só pode estar conectado a uma URL aqui na Shopee;
 
2 - Realizar o fluxo de autorização para o seu seller, conforme passo a passo do link (https://open.shopee.com/developer-guide/20) (até o tópico 4 do “Autorizando com uma conta de loja”).
 
3 - Assim que o time da Shopee responder seu ticket, confirmando que a configuração foi feita e seu seller realizar o fluxo de autorização, já será possível realizar os primeiros testes em LIVE.
 Payload padrão da requisição e resposta de cotaçãoParâmetros da requisição (query) 
URL Request Parameters:
-ExemploHTTP AddressURLhttps://api.frete/URL fornecida pelo ERP ou sellerNomeTipoExemploDescriçãopartner_idint1O ID do parceiro é atribuído após o registro ser bem-sucedido. Obrigatório para todas as solicitações.timestamptimestamp1610000000Indica o carimbo de data/hora da solicitação. Obrigatório para todas as solicitações. Expira em 5 minutos.signstringe318d3e932719916a9f9ebb57e2011961
bd47abfa54a36e040d050d8931596e2Assinatura gerada pela base string "{}{}{}"%(parnter_id, api full path, timestamp) e partner_key via algoritmo HMAC-SHA256. Mais detalhes: 
https://open.shopee.com/documents?module=87&type=2&id=58&version=2 (https://open.shopee.com/documents?module=87&type=2&id=58&version=2) 
 
Body Request Parameters:
NomeTipoObrigatórioExemploDescriçãoshop_idintTrue112345678Identificador único de cada vendedororigin_zip_codestringTrue12345000CEP do vendedor com 8 dígitos, apenas números sem ponto e traçodestination_zip_codestringTrue12345000CEP do comprador com 8 dígitos, apenas números sem ponto e traçoitemsarrayTrue-Lista de produtos item_idintTrue12345678Identificação do item na Shopee skustringFalseitem_skuSKU cadastrado pelo seller na Shopee model_idintFalse12345678Identificação do modelo cadastrado na Shopee.
Obs: nas cotações da PDP, o model_id e category_id são enviados como zero, mas na página de checkout são enviamos normalmente.
 category_idintTrue12345678Categoria do item cadastrada na Shopee.
Obs: nas cotações da PDP, o model_id e category_id são enviados como zero, mas na página de checkout são enviamos normalmente
 quantityintTrue12345678Quantidade de itens pricefloatFalse150.4Preço do produto dimensionsobjectTrue-Dimensões do produto  lengthintTrue10Comprimento em centímetros  widthintTrue10Largura em centímetros  heightintTrue10Altura em centímetros   weightintTrue100Peso em gramas 
Response Parameters / Resposta da Cotação (erro):
NomeTipoObrigatórioExemploDescriçãoerrorstringTrue-Identificador da cotação realizada pelo sellermessagestringTrue-CEP do comprador request_idstringTrue-Identificador da cahamada da API 
Response Parameters / Resposta da Cotação (sucesso):
NomeTipoObrigatórioExemploDescriçãoquotation_idintTrue091234000Identificador da cotação realizada pelo sellerdestination_zip_codestringTrue091234000CEP do comprador packagesarrayTrue-Lista de pacotes dimensionsobjectTrue-Dimensões do produto  lengthintTrue10Comprimento em centímetros  widthintTrue10Largura em centímetros  heightintTrue10Altura em centímetros  weightintTrue100Peso em gramas itemsarrayTrue-lista de produtos  item_idintTrue12345678Identificação do item na Shopee  skustringFalsesku_itemSKU cadastrado pelo seller na Shopee  model_idintFalse12345678Identificação do modelo cadastrado na Shopee  category_idintFalse12345678Categoria do item cadastrada na Shopee  quantity_idintTrue2Quantidade de itens  priceintTrue150.4Preço do produto  dimensionsobjectTrue-Dimensões do produto   lengthintTrue10Comprimento em centímetros   widthintTrue10Largura em centímetros   heightintTrue10Altura em centímetros   weightintTrue100Peso em gramas quotationsarrayTrue-Lista de cotações de frete  pricefloatTrue150.4Valor do frete exibido ao comprador  handling_timeintTrue20Tempo de preparação do pedido em dias úteis. Sempre deve ser maior ou igual a 1.
Esse tempo limita o tempo de emissão de NF e organização de envio do vendedor.
  shipping_timeintTrue10Tempo de transporte do pedido em dias úteis  promise_timeintTrue30Somatório do tempo de preparação + tempo de transporte  service_codestringTrueM1020Código que identifica a transportadora no contexto do vendedor (código irá retornar no parâmetro “shipping_carrier” na API get_order_detail, ex: “Logística do Vendedor - M1020”.)Exemplo de requisiçãocurl --location 'https://api.frete/?partner_id=123456&sign=6b664c45535a544455524f6b565776706752784455784978574361444e795a4c&timestamp=1709843385' \
--header 'Content-Type: application/json' \
--data '{
    "shop_id": 601216389,
    "origin_zip_code": "87952525",
    "destination_zip_code": "17036785",
    "items": [
        {
            "item_id": 892569034,
            "model_id": 1,
            "sku": "",
            "category_id": 1,
            "quantity": 1,
            "price": 12.5,
            "dimensions": {
                "length": 1,
                "width": 1,
                "height": 1,
                "weight": 150
            }
        }
    ]
}'Exemplo de retorno (sucesso) 
- Usar HTTP status code 200
{
    "quotation_id": 1709843321,
    "destination_zip_code": "17036785",
    "packages": [
        {
            "dimensions": {
                "length": 35,
                "width": 90,
                "height": 114,
                "weight": 27300
            },
            "items": [
                {
                    "item_id": 892569034,
                    "model_id": 1,
                    "sku": "",
                    "category_id": 1,
                    "quantity": 1,
                    "price": 12.5,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 150
                    }
                }
            ],
            "quotations": [
                {
                    "price": 93.55,
                    "handling_time": 1,
                    "shipping_time": 7,
                    "promise_time": 8,
                    "service_code": "50"
                }
            ]
        }
    ]
}Exemplo de retorno (erro) 
- Usar HTTP status code 403
{
    "request_id": "Id da requisição",
    "error": "coluna Error",
    "message": "coluna Message"
}Retorno padrão para erros não mapeados na tabela de erros 
- Usar HTTP status code 500
{
    "request_id": "65e9e26dd9d2565e9e26dd9d64",
    "error": "Internal system error",
    "message": "internal system error"
}Códigos de retorno esperadosHTTP status codeErrorMessageAtiva
Contingência
200success API call, error Emptysuccess API call, error EmptyFalse403error_partner_idthere is no partner_id in queryFalse403error_partner_idpartner_id is invalidFalse403error_ signthere is no sign in queryFalse403error_ signyour sign is invalidFalse403error_timestampthere is no timestamp in queryFalse403error_timestampyour timestamp is invalidFalse403error_ shop_idthere is no shop_id in bodyFalse403error_ shop_idThe shop_id is invalidFalse403Invalid origin_zip_codeThe origin_zip_code is invalidFalse403invalid destination_zip_codeThe destination_zip_code is invalidFalse403error_destination_zip_codeNo shipping channel is available.False403Invalid item_idThe item_id is invalidFalse403Invalid model_idThe model_id is invalidFalse403Invalid skuThe sku is not validFalse403invalid category_idThe category_id is invalidFalse403invalid quantityThe quantity is invalidFalse403invalid priceThe price is invalidFalse403error_dimensionsThe dimensions is invalidFalse403error_lengthThe length is invalidFalse403error_widthThe width is invalidFalse403error_heightThe height is invalidFalse403error_weightThe weight is invalidFalse500Internal system errorinternal system errorTrue 
Validação dos responses (com URL da Shopee)- Para garantir que o response está no formato esperado, temos uma URL que deve ser usada para validar e informar as correções necessárias.
- URL: "https://seller-quotation-api.uat.shps-br-services.com/validate_quotation_endpoint"
- Dentro do parâmetro "x-quotation-id" deve ser usado para inserir a URL que será cadastrada na Shopee.
- Segue payload de exemplo de como utilizar a URL de validação do formato de response:
curl --location 'https://seller-quotation-api.uat.shps-br-services.com/validate_quotation_endpoint' \
--header 'api-key: 8a50d1d005d0649b5bdd9b13f0e871e0bd6439bd8e146577a6d51935a5ccea7c' \
--header 'x-partner-id: 2007416' \
--header 'x-quotation-api-url: https://api.cotação/shopee' \
--header 'x-sign: 658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53' \
--header 'Content-Type: application/json' \
--data '{
    "shop_id": 549724933,
    "origin_zip_code": "16200850",
    "destination_zip_code": "16200850",
    "items": [
        {
            "item_id": 10010394,
            "sku": "10010394",
            "model_id": 1,
            "category_id": 1,
            "quantity": 1,
            "price": 277.67,
            "dimensions": {
                "length": 1,
                "width": 1,
                "height": 1,
                "weight": 10
            }
        }
    ]
}' 
- Segue response sem erros (pode ser identificado quando o parâmetro "validation_errors" estiver vazio ("validation_errors:[]"):
{
    "validation_errors": [],
    "details": {
        "called_api": "https://api.cotação/shopee",
        "with_params": {
            "sign": "658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53",
            "partner_id": 2007416,
            "timestamp": 1713445311
        },
        "with_body": {
            "shop_id": 549724933,
            "origin_zip_code": "16200850",
            "destination_zip_code": "16200850",
            "items": [
                {
                    "item_id": 10010394,
                    "model_id": 1,
                    "sku": "10010394",
                    "category_id": 1,
                    "quantity": 1,
                    "price": 277.67,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 10
                    }
                }
            ]
        },
        "response_from_quotation_api": {
            "status_code": 200,
            "response_body": {
                "quotation_id": 617788888,
                "destination_zip_code": "16200850",
                "packages": [
                    {
                        "dimensions": {
                            "length": 1,
                            "width": 1,
                            "height": 1,
                            "weight": 10
                        },
                        "items": [
                            {
                                "item_id": 10010394,
                                "sku": "10010394",
                                "model_id": 1,
                                "category_id": 1,
                                "quantity": 1,
                                "price": 277.67,
                                "dimensions": {
                                    "length": 1,
                                    "width": 1,
                                    "height": 1,
                                    "weight": 10
                                }
                            }
                        ],
                        "quotations": [
                            {
                                "price": 34.9,
                                "handling_time": 5,
                                "shipping_time": 10,
                                "promise_time": 20,
                                "service_code": "2018605604"
                            }
                        ]
                    }
                ]
            },
            "method_called": "POST"
        }
    }
} 
- Segue response com exemplo de erros a serem corrigidos:
{
    "validation_errors": "Input should be a valid string: ('error',)",
    "details": {
        "called_api": "https://api.cotação/shopee": {
            "sign": "658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53",
            "partner_id": 2007416,
            "timestamp": 1713472133
        },
        "with_body": {
            "shop_id": 549724933,
            "origin_zip_code": "16200850",
            "destination_zip_code": "16200850",
            "items": [
                {
                    "item_id": 10010394,
                    "model_id": 0,
                    "sku": "10010394",
                    "category_id": 1,
                    "quantity": 1,
                    "price": 277.67,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 10
                    }
                }
            ]
        },
        "response_from_quotation_api": {
            "status_code": 403,
            "response_body": {
                "request_id": "17134721330005",
                "error": 403,
                "message": "there is no partner_id in query",
                "msger": "Nao foi possivel concluir sua solicitacao."
            },
            "method_called": "POST"
        }
    }
} Tempo de resposta limite (da cotação)  
- Considerando que o checkout é o momento mais crítico da experiência do usuário durante a compra, é essencial garantir a melhor experiência possível ao comprador.
- O tempo de resposta limite é de 1s. É necessário realizar um teste de carga para garantir que essa exigência seja atendida.
- Tempos de resposta superiores a 1s não serão permitidos, inviabilizando a integração. Dessa forma, manter a otimização desse parâmetro é fator crucial para proporcionar a melhor experiência possível ao comprador.
Tabela de contingência  
- Este recurso tem como finalidade apoiar no cálculo do frete, caso ocorra algum problema na cotação de frete via API (timeout ou retorno 500 para as requisições).
Configurações de valor de frete para contingência 
- Para que a contingência funcione, é necessário que o vendedor cadastre os valores de frete e habilite o canal Logística do vendedor, conforme passos descritos abaixo.
- Na Central do Vendedor, acesse Configurações de Envio e clique no botão Configuração do canal:
Preenchimento do valor de frete de contingência 
Em seguida, será carregada a tela para preenchimento do valor de frete. O valor de frete pode ser preenchido por estado (valor único) ou por localidade.
Valor de frete único por estado 
- Selecione os estados
- Preencha o campo valor do frete
- Clique em Salvar
Valor de frete único por cidade 
- Selecione os estados
- Desabilite o botão Flat rate for this area
- Desmarque a opção Select All Cities e selecione as cidades que deseja informar o valor do frete
- Preencha o campo Rate das respectivas cidades
- Clique em Salvar
Habilitação do canal Logística do vendedorPrazo de entrega para valor de frete de contingência 
- O prazo de entrega será fixo, quando acionada a tabela de contingência:- Prazo mínimo: 10 dias corridos
- Prazo máximo: 20 dias úteis

Status dos pedidos e rastreamento Desenvolvimento API de atualização de status: 
A atualização de status dos pedidos e rastreamento se dará por meio da API de atualização de tracking e será feita com base no número do pedido criado na Shopee (ID do Pedido, também conhecido por OrderSN). No qual também será obrigatório informar o número de rastreio.
Para atualização do número do rastreio e status do pedido deve ser utilizado o endpoint v2.logistics.update_tracking_status (OpenAPI). Os status possíveis são:
- Pedido Enviado (logistics_pickup_done)- A URL e o tracking number podem ser enviados na atualização do status do pedido para Enviado.

- Pedido Entregue (logistics_delivery_done)- O status Entregue só será recebido, caso o pedido já possua status o status Enviado.

- Falha na Entrega (logistics_delivery_failed)- O status Falha na Entrega só será recebido, caso o pedido já possua status o status Enviado.

 
IMPORTANTE: após envio dos status Pedido Entregue ou Falha na Entrega não será mais permitida atualização de status, pois ambos são status finalizadores;
*os parâmetros tracking_number e tracking_url devem ser enviados apenas na atualização do status para logistics_pickup_done.
 
Segue link para documentação da API “/api/v2/logistics/update_tracking_status (https://open.shopee.com/documents/v2/v2.logistics.update_tracking_status?module=95&type=1)”.
Fluxo e status de pedidos do canal  Regras de comissão e frete para o canal 
- O desconto máximo do frete para o comprador é de R$ 20, caso o vendedor esteja no Programa de Frete Grátis
- O vendedor terá uma coparticipação no desconto oferecido ao cliente.
FAQ: 
1 - Todos os vendedores tem acesso ao canal Logística do Vendedor?
R: Somente vendedores gerenciados tem acesso ao canal, para mais informações procure seu Gerente de contas.
 
2 - Como identificar uma cotação no pedido?
R: Uma vez um pedido criado com uma cotação de sucesso, o parâmetro “service_code”, será retornado no parâmetro “shipping_carrier” da API get_order_detail. 
Ex1: 
- “service_code” enviado: “Canal X”
- retorno do parâmetro “shipping_carrier”: “Logística do vendedor - Canal X”
Ex2: 
- Tabela de contingência ativada.
- retorno do parâmetro “shipping_carrier”: “Logística do vendedor”
 
3 - Posso usar o APP Seller Logistics para chamar a OpenAPI?
R: Não, esse tipo de APP só é usado para API de cotação (URL de cotação).
 
Para mais dúvidas técnicas, abrir um ticket na Plataforma de Tickets da OP (https://open.shopee.com/myconsole/ticket-system/raise-ticket/).
Para dúvidas sobre acesso ao canal logístico, segue link.

## Content (raw HTML)

```html
<h1>O que é o canal Logística do vendedor&nbsp;</h1><p>&nbsp;</p><p>Este canal permite que o vendedor utilize sua própria logística para cotação e envio de pedidos.</p><ul><li>A cotação de frete é feita a partir da URL de cotação disponibilizada pelo vendedor.</li><li>O preço de envio e prazo de entrega são fornecidos pelo próprio vendedor.</li><li>O rastreamento dos pedidos é simplificado, ficando sob responsabilidade do vendedor enviar os eventos de “despachado”, “entrega” ou “falha na entrega” via OpenAPI.</li></ul><p>&nbsp;</p><p><i><strong>Obs:</strong> Este canal será disponibilizado a vendedores específicos, cujos produtos não são suportados pela logística própria da Shopee por conta de dimensões e peso, de acordo com as regras estabelecidas pelo time comercial da Shopee.</i></p><h1>URL Cotação de frete</h1><p>&nbsp;</p><p>É a ferramenta que permite ao vendedor enviar para a Shopee o custo do frete e prazo estimados que serão exibidos ao comprador no momento da compra. Para que o vendedor possa utilizar esse recurso, é preciso atender os requisitos de homologação pré-estabelecidos.</p><p>&nbsp;</p><p><i>*O vendedor tem a opção de integrar diretamente com a Shopee para conectar sua URL de cotação ou se conectar via um Integrador-HUB.</i></p><h1>Requisitos para homologação/Integração</h1><p>&nbsp;</p><p>Diferente dos outros tipos de integração, a integração da API de cotação e atualização de status de pedido (do canal seller logistics), exigem uma avaliação e aprovação do time Shopee antes de começar a operar. Para ser aprovado pelo time da Shopee é necessário:</p><ul><li>Cumprimento do contrato da API de cotação de frete:<ul><li>Configurar e disponibilizar a URL via método HTTP POST.</li><li>Cada solicitação (request) deve conter apenas um item de um vendedor.</li><li>A URL não tem uma estrutura específica, proporcionando flexibilidade na configuração.</li></ul></li><li>Payload padrão da requisição e resposta de cotação (e validação com URL da Shopee)</li><li>Tempo de resposta limite de 400ms.</li><li>Tabela de contingência cadastrada diretamente pela Central do Vendedor.</li><li>Monitoramento de erros (e desenvolvimento das mensagens solicitadas)</li><li>Desenvolvimento API de atualização de status (“update_tracking_status);<ul><li><i><strong>Obs: </strong>Os requisitos acima devem ser cumpridos pelo “próprio sistema” do vendedor ou pelo seu ERP/HUB/Integração. Vale ressaltar que sem eles os pedidos serão cancelados, pois o fluxo não pode ser realizado via Central do Vendedor de forma manual.</i></li><li><i><strong>Obs2:</strong> Todos que desenvolverem a API de cotação, também devem desenvolver a API de atualização de status;</i></li><li><i><strong>Obs3:</strong> O APP Seller Logistics, só é usado para URL de cotação, para usar qualquer API é necessário a criação de um segundo APP;</i></li></ul></li><li>Passar e-mail de confirmação e aprovação do time da Shopee <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/">via ticket</a> (envolvendo todos critérios acima).</li></ul><p>&nbsp;</p><p>Para conseguir realizar a integração e os testes acima também é necessário:</p><p>a) Criar novo APP Seller Logistic na Open Platform e autorizar os sellers a esse APP</p><p>b) Ter um APP que seja capaz de chamar a OpenAPI para atualização de status (e também autorizar os sellers a esse APP)</p><h2>Teste de Homologação</h2><p>1. Fluxo Logístico do pedido: Será necessário a criação de pelo menos 2 pedidos, que precisarão ser atualizados até os seguintes status:</p><p><i>- order 1: delivery_done</i></p><p><i>- order 2: delivery_failed</i></p><p>2. Teste de Cotação no item: Um teste interno de cotação também será feito diretamente em um dos anúncios da loja.</p><p>Ambas etapas terão validação interna (essas validações podem levar alguns dias) e daremos a confirmação ao parceiro via ticket que foi aberto pelo mesmo.</p><p>&nbsp;</p><p>Observação: Ao completar o fluxo de <strong>atualização de status</strong> você se compromete que esses status estão corretamente mapeados, integrados e automatizados para envio para API da Shopee. Os pedidos dos vendedores não são atualizados de forma manual pela Shopee, apenas pelo recebimento dos status via API. Caso ocorra problemas futuros, o canal poderá ser desativado após análise da Shopee.</p><p>&nbsp;</p><p>(A inclusão interna do parceiro como opção de TMS para RMs solicitarem ativação de lojas, é responsabilidade de outro time interno e o processo de atualização leva, em torno, de 15 dias úteis.)</p><h1>Criar APP Seller Logistics e autorizar sellers&nbsp;</h1><p>&nbsp;</p><p>Uma vez que sua conta na Open Platform já esteja ativa, o próximo passo é criar um APP que será usado apenas para conectar sua URL de cotação a Shopee e respectivos sellers(shop_Id).</p><p>Segue passo a passo, abaixo:</p><p>&nbsp;</p><p>1. Fazer Login na Open Platform e entrar na aba “Console”:</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=8dhYhblm%2FlT3sEGKh5synM1mGE7qxTcXnRgX2qr%2B1miAs7MhkfJsLepUtX9XcStrTyRmX8aOWC4yvGKBV5i8xw%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>2. Em “App List” clicar em “+ Add new APP”:</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=BtBro5U%2BNrU9jHhAb9RpFjJ5GmTfZqPTiLaPOlBFOyv9S%2F0Zf7azJkPoAco%2FHbK%2FTQgZ6r1%2FKdLXgGAQeQ0e4g%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>3. Selecionar a “App Category” como “Seller Logistics”:</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Sv5yW4Y%2F8xvWECI296njkyyMjHqfNJaml2ZchYPSi5ic5qHWFrc1mw82SkGGdApJMehI7pUOwUA8xZHDQ%2Bjg7A%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>4. Inserir no “App Description” as URLs que serão usadas em Live (produção) e em Test (ambiente de teste), e clicar em “Submit”.</p><p>*sem problemas se houver apenas uma URL;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=SDzAxRWWV3Jw3M0LHU1vrMW%2Fgu%2BpMgu%2F5UN5AuvACe1nV1%2BsWSaUR4C5KdjUgBUn3jXkuceu8fFoAIr8jxLSPg%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>5. Assim o APP já estará criado, então, só seguir com a solicitação de “Go-Live”, que vai disponibilizar o APP no ambiente de produção em até 24 horas.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=i%2BNnpU4d3%2Fg81BlB643wC1WpAsWxeqG7xK11%2BryzeFpzTWPYYVq3yxEvYPJzZ7V%2FaaV4Lxfc%2Fgl13VC6UOPDGg%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>6. Só é necessário preencher mais algumas infos antes.</p><p>Caso não seja possível fornecer um “username” e “password”, podem preencher como no print abaixo:</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=So38FJiibg0jTVT62sS8PvZkMtpb7PfayVf1b12SxUrLazGJdYSkQgPZZv9VLJ512Q22KMRKQzAyG8Pg3JgkKg%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>7. Para “App IP”, informar o IP principal da sua aplicação (vale ressaltar que não vamos limitar o acesso apenas a esse IP).</p><p>E para “Other IT Assets Declaration”, preencher como no print abaixo.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Jx8ukNF5yojqAm6sTTwJvtqVwqyHDDzmLg%2FpY7003hPkLDzXbxUrwBIZBStYDNxWmS0AITs8W9E2GlK3nWi2fQ%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>24 horas após a solicitação do “Go-live” o partner_id de Live será liberado e você será notificado via e-mail. Assim que receber o e-mail, os próximos passos são:</p><p>&nbsp;</p><p>1 - Abrir um ticket na <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/"><u>Plataforma de Tickets da OP</u></a>, com o assunto “Seller Logistics” informando o shop_id (ou quais Shop IDs) pretende conectar a sua URL, assim que recebermos a solicitação e o time da Shopee finalizando a conexão da URL, e permitindo avançar com a autorização do seller.</p><p>Obs: cada shop_id só pode estar conectado a uma URL aqui na Shopee;</p><p>&nbsp;</p><p>2 - Realizar o fluxo de autorização para o seu seller, conforme passo a passo do <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>link</u></a> (até o tópico 4 do “Autorizando com uma conta de loja”).</p><p>&nbsp;</p><p>3 - Assim que o time da Shopee responder seu ticket, confirmando que a configuração foi feita e seu seller realizar o fluxo de autorização, já será possível realizar os primeiros testes em LIVE.</p><h2>&nbsp;</h2><h2>Payload padrão da requisição e resposta de cotação</h2><h3>Parâmetros da requisição (query)</h3><p>&nbsp;</p><p>URL Request Parameters:</p><figure class="table"><table><thead><tr><th>-</th><th>Exemplo</th><th>HTTP Address</th></tr></thead><tbody><tr><td>URL</td><td>https://api.frete/</td><td>URL fornecida pelo ERP ou seller</td></tr></tbody></table></figure><figure class="table"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Exemplo</th><th>Descrição</th></tr></thead><tbody><tr><td>partner_id</td><td>int</td><td>1</td><td>O ID do parceiro é atribuído após o registro ser bem-sucedido. Obrigatório para todas as solicitações.</td></tr><tr><td>timestamp</td><td>timestamp</td><td>1610000000</td><td>Indica o carimbo de data/hora da solicitação. Obrigatório para todas as solicitações. Expira em 5 minutos.</td></tr><tr><td>sign</td><td>string</td><td>e318d3e932719916a9f9ebb57e2011961<br>bd47abfa54a36e040d050d8931596e2</td><td><p>Assinatura gerada pela base string "{}{}{}"%(parnter_id, api full path, timestamp) e partner_key via algoritmo HMAC-SHA256. Mais detalhes:&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents?module=87&amp;type=2&amp;id=58&amp;version=2"><u>https://open.shopee.com/documents?module=87&amp;type=2&amp;id=58&amp;version=2</u></a>&nbsp;</p></td></tr></tbody></table></figure><p>&nbsp;</p><p>Body Request Parameters:</p><figure class="table"><table><thead><tr><th colspan="3">Nome</th><th>Tipo</th><th>Obrigatório</th><th>Exemplo</th><th>Descrição</th></tr></thead><tbody><tr><td colspan="3">shop_id</td><td>int</td><td>True</td><td>112345678</td><td>Identificador único de cada vendedor</td></tr><tr><td colspan="3">origin_zip_code</td><td>string</td><td>True</td><td>12345000</td><td>CEP do vendedor com 8 dígitos, apenas números sem ponto e traço</td></tr><tr><td colspan="3">destination_zip_code</td><td>string</td><td>True</td><td>12345000</td><td>CEP do comprador com 8 dígitos, apenas números sem ponto e traço</td></tr><tr><td colspan="3">items</td><td>array</td><td>True</td><td>-</td><td>Lista de produtos</td></tr><tr><td>&nbsp;</td><td colspan="2">item_id</td><td>int</td><td>True</td><td>12345678</td><td>Identificação do item na Shopee</td></tr><tr><td>&nbsp;</td><td colspan="2">sku</td><td>string</td><td>False</td><td>item_sku</td><td>SKU cadastrado pelo seller na Shopee</td></tr><tr><td>&nbsp;</td><td colspan="2">model_id</td><td>int</td><td>False</td><td>12345678</td><td><p>Identificação do modelo cadastrado na Shopee.</p><p><i><strong>Obs: </strong>nas cotações da PDP, o model_id e category_id são enviados como zero, mas na página de checkout são enviamos normalmente</i>.</p></td></tr><tr><td>&nbsp;</td><td colspan="2">category_id</td><td>int</td><td>True</td><td>12345678</td><td><p>Categoria do item cadastrada na Shopee.</p><p><i><strong>Obs: </strong>nas cotações da PDP, o model_id e category_id são enviados como zero, mas na página de checkout são enviamos normalmente</i></p></td></tr><tr><td>&nbsp;</td><td colspan="2">quantity</td><td>int</td><td>True</td><td>12345678</td><td>Quantidade de itens</td></tr><tr><td>&nbsp;</td><td colspan="2">price</td><td>float</td><td>False</td><td>150.4</td><td>Preço do produto</td></tr><tr><td>&nbsp;</td><td colspan="2">dimensions</td><td>object</td><td>True</td><td>-</td><td>Dimensões do produto</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>length</td><td>int</td><td>True</td><td>10</td><td>Comprimento em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>width</td><td>int</td><td>True</td><td>10</td><td>Largura em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>height</td><td>int</td><td>True</td><td>10</td><td>Altura em centímetros&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>weight</td><td>int</td><td>True</td><td>100</td><td>Peso em gramas</td></tr></tbody></table></figure><p>&nbsp;</p><p>Response Parameters / Resposta da Cotação (erro):</p><figure class="table"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Obrigatório</th><th>Exemplo</th><th>Descrição</th></tr></thead><tbody><tr><td>error</td><td>string</td><td>True</td><td>-</td><td>Identificador da cotação realizada pelo seller</td></tr><tr><td>message</td><td>string</td><td>True</td><td>-</td><td>CEP do comprador&nbsp;</td></tr><tr><td>request_id</td><td>string</td><td>True</td><td>-</td><td>Identificador da cahamada da API</td></tr></tbody></table></figure><p>&nbsp;</p><p>Response Parameters / Resposta da Cotação (sucesso):</p><figure class="table"><table><thead><tr><th colspan="4">Nome</th><th>Tipo</th><th>Obrigatório</th><th>Exemplo</th><th>Descrição</th></tr></thead><tbody><tr><td colspan="4">quotation_id</td><td>int</td><td>True</td><td>091234000</td><td>Identificador da cotação realizada pelo seller</td></tr><tr><td colspan="4">destination_zip_code</td><td>string</td><td>True</td><td>091234000</td><td>CEP do comprador&nbsp;</td></tr><tr><td colspan="4">packages</td><td>array</td><td>True</td><td>-</td><td>Lista de pacotes</td></tr><tr><td>&nbsp;</td><td colspan="3">dimensions</td><td>object</td><td>True</td><td>-</td><td>Dimensões do produto</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">length</td><td>int</td><td>True</td><td>10</td><td>Comprimento em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">width</td><td>int</td><td>True</td><td>10</td><td>Largura em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">height</td><td>int</td><td>True</td><td>10</td><td>Altura em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">weight</td><td>int</td><td>True</td><td>100</td><td>Peso em gramas</td></tr><tr><td>&nbsp;</td><td colspan="3">items</td><td>array</td><td>True</td><td>-</td><td>lista de produtos</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">item_id</td><td>int</td><td>True</td><td>12345678</td><td>Identificação do item na Shopee</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">sku</td><td>string</td><td>False</td><td>sku_item</td><td>SKU cadastrado pelo seller na Shopee</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">model_id</td><td>int</td><td>False</td><td>12345678</td><td>Identificação do modelo cadastrado na Shopee</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">category_id</td><td>int</td><td>False</td><td>12345678</td><td>Categoria do item cadastrada na Shopee</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">quantity_id</td><td>int</td><td>True</td><td>2</td><td>Quantidade de itens</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">price</td><td>int</td><td>True</td><td>150.4</td><td>Preço do produto</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">dimensions</td><td>object</td><td>True</td><td>-</td><td>Dimensões do produto</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>length</td><td>int</td><td>True</td><td>10</td><td>Comprimento em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>width</td><td>int</td><td>True</td><td>10</td><td>Largura em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>height</td><td>int</td><td>True</td><td>10</td><td>Altura em centímetros</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>weight</td><td>int</td><td>True</td><td>100</td><td>Peso em gramas</td></tr><tr><td>&nbsp;</td><td colspan="3">quotations</td><td>array</td><td>True</td><td>-</td><td>Lista de cotações de frete</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">price</td><td>float</td><td>True</td><td>150.4</td><td>Valor do frete exibido ao comprador</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">handling_time</td><td>int</td><td>True</td><td>20</td><td><p>Tempo de preparação do pedido em dias úteis. Sempre deve ser maior ou igual a 1.</p><p>Esse tempo limita o tempo de emissão de NF e organização de envio do vendedor.</p></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">shipping_time</td><td>int</td><td>True</td><td>10</td><td>Tempo de transporte do pedido em dias úteis</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">promise_time</td><td>int</td><td>True</td><td>30</td><td>Somatório do tempo de preparação + tempo de transporte</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td colspan="2">service_code</td><td>string</td><td>True</td><td>M1020</td><td>Código que identifica a transportadora no contexto do vendedor (código irá retornar no parâmetro “shipping_carrier” na API get_order_detail, ex: “Logística do Vendedor - M1020”.)</td></tr></tbody></table></figure><h3>Exemplo de requisição</h3><pre><code class="curl hljs">curl --location 'https://api.frete/?partner_id=123456&amp;sign=6b664c45535a544455524f6b565776706752784455784978574361444e795a4c&amp;timestamp=1709843385' \
--header 'Content-Type: application/json' \
--data '{
    "shop_id": 601216389,
    "origin_zip_code": "87952525",
    "destination_zip_code": "17036785",
    "items": [
        {
            "item_id": 892569034,
            "model_id": 1,
            "sku": "",
            "category_id": 1,
            "quantity": 1,
            "price": 12.5,
            "dimensions": {
                "length": 1,
                "width": 1,
                "height": 1,
                "weight": 150
            }
        }
    ]
}'</code></pre><h3>Exemplo de retorno (sucesso)</h3><p>&nbsp;</p><ul><li>Usar HTTP status code 200</li></ul><pre><code class="json hljs">{
    "quotation_id": 1709843321,
    "destination_zip_code": "17036785",
    "packages": [
        {
            "dimensions": {
                "length": 35,
                "width": 90,
                "height": 114,
                "weight": 27300
            },
            "items": [
                {
                    "item_id": 892569034,
                    "model_id": 1,
                    "sku": "",
                    "category_id": 1,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"quantity": 1,
                    "price": 12.5,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 150
                    }
                }
            ],
            "quotations": [
                {
                    "price": 93.55,
                    "handling_time": 1,
                    "shipping_time": 7,
                    "promise_time": 8,
                    "service_code": "50"
                }
            ]
        }
    ]
}</code></pre><h3>Exemplo de retorno (erro)</h3><p>&nbsp;</p><ul><li>Usar HTTP status code 403</li></ul><pre><code class="json hljs">{
    "request_id": "Id da requisição",
    "error": "coluna Error",
    "message": "coluna Message"
}</code></pre><h3>Retorno padrão para erros não mapeados na tabela de erros</h3><p>&nbsp;</p><ul><li>Usar HTTP status code 500</li></ul><pre><code class="json hljs">{
    "request_id": "65e9e26dd9d2565e9e26dd9d64",
    "error": "Internal system error",
    "message": "internal system error"
}</code></pre><h3>Códigos de retorno esperados</h3><figure class="table"><table><thead><tr><th><strong>HTTP status code</strong></th><th><strong>Error</strong></th><th><strong>Message</strong></th><th><p><strong>Ativa</strong></p><p><strong>Contingência</strong></p></th></tr></thead><tbody><tr><td>200</td><td>success API call, error Empty</td><td>success API call, error Empty</td><td>False</td></tr><tr><td>403</td><td>error_partner_id</td><td>there is no partner_id in query</td><td>False</td></tr><tr><td>403</td><td>error_partner_id</td><td>partner_id is invalid</td><td>False</td></tr><tr><td>403</td><td>error_ sign</td><td>there is no sign in query</td><td>False</td></tr><tr><td>403</td><td>error_ sign</td><td>your sign is invalid</td><td>False</td></tr><tr><td>403</td><td>error_timestamp</td><td>there is no timestamp in query</td><td>False</td></tr><tr><td>403</td><td>error_timestamp</td><td>your timestamp is invalid</td><td>False</td></tr><tr><td>403</td><td>error_ shop_id</td><td>there is no shop_id in body</td><td>False</td></tr><tr><td>403</td><td>error_ shop_id</td><td>The shop_id is invalid</td><td>False</td></tr><tr><td>403</td><td>Invalid origin_zip_code</td><td>The origin_zip_code is invalid</td><td>False</td></tr><tr><td>403</td><td>invalid destination_zip_code</td><td>The destination_zip_code is invalid</td><td>False</td></tr><tr><td>403</td><td>error_destination_zip_code</td><td>No shipping channel is available.</td><td>False</td></tr><tr><td>403</td><td>Invalid item_id</td><td>The item_id is invalid</td><td>False</td></tr><tr><td>403</td><td>Invalid model_id</td><td>The model_id is invalid</td><td>False</td></tr><tr><td>403</td><td>Invalid sku</td><td>The sku is not valid</td><td>False</td></tr><tr><td>403</td><td>invalid category_id</td><td>The category_id is invalid</td><td>False</td></tr><tr><td>403</td><td>invalid quantity</td><td>The quantity is invalid</td><td>False</td></tr><tr><td>403</td><td>invalid price</td><td>The price is invalid</td><td>False</td></tr><tr><td>403</td><td>error_dimensions</td><td>The dimensions is invalid</td><td>False</td></tr><tr><td>403</td><td>error_length</td><td>The length is invalid</td><td>False</td></tr><tr><td>403</td><td>error_width</td><td>The width is invalid</td><td>False</td></tr><tr><td>403</td><td>error_height</td><td>The height is invalid</td><td>False</td></tr><tr><td>403</td><td>error_weight</td><td>The weight is invalid</td><td>False</td></tr><tr><td>500</td><td>Internal system error</td><td>internal system error</td><td>True</td></tr></tbody></table></figure><p>&nbsp;</p><h3>Validação dos responses (com URL da Shopee)</h3><ul><li>Para garantir que o response está no formato esperado, temos uma URL que deve ser usada para validar e informar as correções necessárias.</li><li>URL: "<span style="background-color:rgb(255,255,255);color:rgb(33,33,33);">https://seller-quotation-api.uat.shps-br-services.com/validate_quotation_endpoint"</span></li><li><span style="background-color:rgb(255,255,255);color:rgb(33,33,33);">Dentro do parâmetro "x-quotation-id" deve ser usado para inserir a URL que será cadastrada na Shopee.</span></li><li>Segue payload de exemplo de como utilizar a URL de validação do formato de response:</li></ul><pre><code class="json hljs">curl --location 'https://seller-quotation-api.uat.shps-br-services.com/validate_quotation_endpoint' \
--header 'api-key: 8a50d1d005d0649b5bdd9b13f0e871e0bd6439bd8e146577a6d51935a5ccea7c' \
--header 'x-partner-id: 2007416' \
--header 'x-quotation-api-url: https://api.cotação/shopee' \
--header 'x-sign: 658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53' \
--header 'Content-Type: application/json' \
--data '{
    "shop_id": 549724933,
    "origin_zip_code": "16200850",
    "destination_zip_code": "16200850",
    "items": [
        {
            "item_id": 10010394,
            "sku": "10010394",
            "model_id": 1,
            "category_id": 1,
            "quantity": 1,
            "price": 277.67,
            "dimensions": {
                "length": 1,
                "width": 1,
                "height": 1,
                "weight": 10
            }
        }
    ]
}'</code></pre><p>&nbsp;</p><ul><li>Segue response sem erros (pode ser identificado quando o parâmetro "validation_errors" estiver vazio ("validation_errors:[]"):</li></ul><pre><code class="json hljs">{
    "validation_errors": [],
    "details": {
        "called_api": "https://api.cotação/shopee",
        "with_params": {
            "sign": "658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53",
            "partner_id": 2007416,
            "timestamp": 1713445311
        },
        "with_body": {
            "shop_id": 549724933,
            "origin_zip_code": "16200850",
            "destination_zip_code": "16200850",
            "items": [
                {
                    "item_id": 10010394,
                    "model_id": 1,
                    "sku": "10010394",
                    "category_id": 1,
                    "quantity": 1,
                    "price": 277.67,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 10
                    }
                }
            ]
        },
        "response_from_quotation_api": {
            "status_code": 200,
            "response_body": {
                "quotation_id": 617788888,
                "destination_zip_code": "16200850",
                "packages": [
                    {
                        "dimensions": {
                            "length": 1,
                            "width": 1,
                            "height": 1,
                            "weight": 10
                        },
                        "items": [
                            {
                                "item_id": 10010394,
                                "sku": "10010394",
                                "model_id": 1,
                                "category_id": 1,
                                "quantity": 1,
                                "price": 277.67,
                                "dimensions": {
                                    "length": 1,
                                    "width": 1,
                                    "height": 1,
                                    "weight": 10
                                }
                            }
                        ],
                        "quotations": [
                            {
                                "price": 34.9,
                                "handling_time": 5,
                                "shipping_time": 10,
                                "promise_time": 20,
                                "service_code": "2018605604"
                            }
                        ]
                    }
                ]
            },
            "method_called": "POST"
        }
    }
}</code></pre><p>&nbsp;</p><ul><li>Segue response com exemplo de erros a serem corrigidos:</li></ul><pre><code class="json hljs">{
    "validation_errors": "Input should be a valid string: ('error',)",
    "details": {
        "called_api": "https://api.cotação/shopee": {
            "sign": "658ABD0FD8D8525C0A87B0E360A5C518C2987E5B4A3D20542A4B11594E11CE53",
            "partner_id": 2007416,
            "timestamp": 1713472133
        },
        "with_body": {
            "shop_id": 549724933,
            "origin_zip_code": "16200850",
            "destination_zip_code": "16200850",
            "items": [
                {
                    "item_id": 10010394,
                    "model_id": 0,
                    "sku": "10010394",
                    "category_id": 1,
                    "quantity": 1,
                    "price": 277.67,
                    "dimensions": {
                        "length": 1,
                        "width": 1,
                        "height": 1,
                        "weight": 10
                    }
                }
            ]
        },
        "response_from_quotation_api": {
            "status_code": 403,
            "response_body": {
                "request_id": "17134721330005",
                "error": 403,
                "message": "there is no partner_id in query",
                "msger": "Nao foi possivel concluir sua solicitacao."
            },
            "method_called": "POST"
        }
    }
}</code></pre><h2>&nbsp;</h2><h2>Tempo de resposta limite (da cotação)&nbsp;</h2><p>&nbsp;</p><ul><li>Considerando que o checkout é o momento mais crítico da experiência do usuário durante a compra, é essencial garantir a melhor experiência possível ao comprador.</li><li>O tempo de resposta limite é de 1s. É necessário realizar um teste de carga para garantir que essa exigência seja atendida.</li><li>Tempos de resposta superiores a 1s não serão permitidos, inviabilizando a integração. Dessa forma, manter a otimização desse parâmetro é fator crucial para proporcionar a melhor experiência possível ao comprador.</li></ul><h1>Tabela de contingência&nbsp;</h1><p>&nbsp;</p><ul><li>Este recurso tem como finalidade apoiar no cálculo do frete, caso ocorra algum problema na cotação de frete via API (timeout ou retorno 500 para as requisições).</li></ul><h2>Configurações de valor de frete para contingência</h2><p>&nbsp;</p><ul><li>Para que a contingência funcione, é necessário que o vendedor cadastre os valores de frete e habilite o canal <strong>Logística do vendedor</strong>, conforme passos descritos abaixo.</li><li>Na Central do Vendedor, acesse <strong>Configurações de Envio</strong> e clique no botão <strong>Configuração do canal</strong>:</li></ul><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=axLhajSfgEBV5VxcLQac2I4DJ819EKiVG4BaFBpeX7tyXMFC2yOiY%2FZBjpzXXh3sXL0w14jP4jGdv%2FBXysWqdw%3D%3D&amp;image_type=png"></figure><h2>Preenchimento do valor de frete de contingência</h2><p>&nbsp;</p><p>Em seguida, será carregada a tela para preenchimento do valor de frete. O valor de frete pode ser preenchido por estado (valor único) ou por localidade.</p><h2>Valor de frete único por estado</h2><p>&nbsp;</p><ol><li>Selecione os estados</li><li>Preencha o campo valor do frete</li><li>Clique em Salvar</li></ol><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=iqTvUj9g1dDUR6lK8Pwvg8k9uw%2Fq5EE7RaMwhoFeOlbziKeMF0U%2BO8VSx0R%2BeUrSgXDYT0TDrFeS%2F%2FBQIe%2BGgg%3D%3D&amp;image_type=png"></figure><h2>Valor de frete único por cidade</h2><p>&nbsp;</p><ol><li>Selecione os estados</li><li>Desabilite o botão <i>Flat rate for this area</i></li><li>Desmarque a opção <i>Select All Cities</i> e selecione as cidades que deseja informar o valor do frete</li><li>Preencha o campo <i>Rate</i> das respectivas cidades</li><li>Clique em <i>Salvar</i></li></ol><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=sZze5JgkTw23vTywAHTztpHkGHSM9rxVpFct3lL9NiVPSh5rmsN27ykkw4C88%2BpqFmPwPBpyKfaEKPsnrJ9OYw%3D%3D&amp;image_type=png"></figure><h2>Habilitação do canal Logística do vendedor</h2><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=GQqkuXNOHGSpwREwhv0g2lS9mxDBBwrUyEFQCb5OQVo05wb8tAC2k7w1Cs1Jd8b6XthNygVM2H4abUA0sYKzwg%3D%3D&amp;image_type=png"></figure><h2>Prazo de entrega para valor de frete de contingência</h2><p>&nbsp;</p><ul><li>O prazo de entrega será fixo, quando acionada a tabela de contingência:<ul><li>Prazo mínimo: 10 dias corridos</li><li>Prazo máximo: 20 dias úteis</li></ul></li></ul><h1>Status dos pedidos e rastreamento&nbsp;</h1><h2>Desenvolvimento API de atualização de status:</h2><p>&nbsp;</p><p>A atualização de status dos pedidos e rastreamento se dará por meio da API de atualização de tracking e será feita com base no número do pedido criado na Shopee (ID do Pedido, também conhecido por OrderSN). No qual também será obrigatório informar o número de rastreio.</p><p>Para atualização do número do rastreio e status do pedido deve ser utilizado o endpoint <i><strong>v2.logistics.update_tracking_status (OpenAPI)</strong></i>. Os status possíveis são:</p><ol><li>Pedido Enviado (logistics_pickup_done)<ul><li>A URL e o tracking number podem ser enviados na atualização do status do pedido para Enviado.</li></ul></li><li>Pedido Entregue (logistics_delivery_done)<ul><li>O status Entregue só será recebido, caso o pedido já possua status o status Enviado.</li></ul></li><li>Falha na Entrega (logistics_delivery_failed)<ul><li>O status Falha na Entrega só será recebido, caso o pedido já possua status o status Enviado.</li></ul></li></ol><p>&nbsp;</p><p><i><strong>IMPORTANTE</strong>: após envio dos status Pedido Entregue ou Falha na Entrega não será mais permitida atualização de status, pois ambos são status finalizadores;</i></p><p><i>*os parâmetros <strong>tracking_number</strong> e <strong>tracking_url</strong> devem ser enviados apenas na atualização do status para <strong>logistics_pickup_done</strong>.</i></p><p>&nbsp;</p><p><i>Segue link para documentação da API “</i><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.update_tracking_status?module=95&amp;type=1"><i><u>/api/v2/logistics/update_tracking_status</u></i></a><i>”.</i></p><h1>Fluxo e status de pedidos do canal&nbsp;</h1><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=HlNk8Kk68dG3rPlRrgb8OWB34bmSuKnrsCJ853GXcbyVIwQuLCgjCC%2Bodz65bQANuqyn3AQ1Y53h6LPXIVE3dg%3D%3D&amp;image_type=png"></figure><h1>&nbsp;</h1><h1>Regras de comissão e frete para o canal</h1><p>&nbsp;</p><ul><li>O desconto máximo do frete para o comprador é de R$ 20, caso o vendedor esteja no Programa de Frete Grátis</li><li>O vendedor terá uma coparticipação no desconto oferecido ao cliente.</li></ul><figure class="image image_resized" style="width:526px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=up740NiZdB4UHEVPAFbqCvpVwa056ylU1CFeHpzc6b3gvhCcXjSAUdGiVrz2ZZQzKEyODTGilTg%2FlmU7vWLR7Q%3D%3D&amp;image_type=png"></figure><h1>FAQ:</h1><p>&nbsp;</p><p>1 - Todos os vendedores tem acesso ao canal Logística do Vendedor?</p><p>R: Somente vendedores gerenciados tem acesso ao canal, para mais informações procure seu Gerente de contas.</p><p>&nbsp;</p><p>2 - Como identificar uma cotação no pedido?</p><p>R: Uma vez um pedido criado com uma cotação de sucesso, o parâmetro “service_code”, será retornado no parâmetro “shipping_carrier” da API get_order_detail.&nbsp;</p><p>Ex1:&nbsp;</p><ul><li>“service_code” enviado: “Canal X”</li><li>retorno do parâmetro “shipping_carrier”: “Logística do vendedor - Canal X”</li></ul><p>Ex2:&nbsp;</p><ul><li>Tabela de contingência ativada.</li><li>retorno do parâmetro “shipping_carrier”: “Logística do vendedor”</li></ul><p>&nbsp;</p><p>3 - Posso usar o APP Seller Logistics para chamar a OpenAPI?</p><p>R: Não, esse tipo de APP só é usado para API de cotação (URL de cotação).</p><p>&nbsp;</p><p>Para mais dúvidas técnicas, abrir um ticket na <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/"><u>Plataforma de Tickets da OP</u></a>.</p><p>Para dúvidas sobre acesso ao canal logístico, segue link.</p>
```
