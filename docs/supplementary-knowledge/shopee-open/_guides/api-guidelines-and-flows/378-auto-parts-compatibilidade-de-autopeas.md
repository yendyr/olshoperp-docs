# AUTO PARTS: COMPATIBILIDADE DE AUTOPEÇAS

> **Source:** [https://open.shopee.com/developer-guide/378](https://open.shopee.com/developer-guide/378)
> **Type:** Developer Guide / Overview
> **document_id:** `378`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

A partir do dia 24 de junho de 2024 está disponível na Shopee a feature que permite adicionar compatibilidade entre veículos e produtos de auto peças. Com isso alguns endpoints foram criados e outros tiveram atualizações relacionadas a esse tema.
Vantagens no uso da feature de compatibilidade 
- Sellers poderão configurar itens mais completos, com os dados de veículos compatíveis com seus produtos;
- Os itens com compatibilidade preenchida irão aparecer em posições de melhor relevância na página de resultados da pesquisa (SRP) do buyer;
- O buyer terá maior confiabilidade na compra, uma vez que será mais fácil confirmar se um item é de fato compatível com seu veículo.
 
Considerando esse cenário, se o seus clientes (os sellers) trabalham com itens de autopeças, recomendamos fortemente que implementem os novos endpoints na plataforma de vocês.
Estrutura dos dados 
Os dados dos veículos são armazenados da seguinte forma:
ParâmetroSignificadoExemplobrand_idO id de uma marca específica.5770brand_nameO nome da marca relacionada a cada brand_id."Chevrolet"model_idO id de um modelo específico.5905model_nameO nome do modelo relacionado ao model_id."Chevette"year_idO id de cada ano.5712year_nameO ano relacionado a um dado year_id."1979"version_idA id de cada versão de um veículo.5907version_nameO nome da versão associada ao version_id."Hatch" 
Estabelecido isso, é importante reforçar que os parâmetros listados acima seguem a seguinte relação de dependência: brand > model > year > version.
Novos endpoints: 
v2.product.get_all_vehicle_list
 
- Como o nome indica, é o endpoint responsável por trazer toda a lista de veículos presente na base de dados da Shopee. Para usá-lo, o parâmetro obrigatório é o tamanho da página (page_size) que pode ser de no máximo 100 itens. Mais detalhes do endpoint você encontra em sua página do API Reference (https://open.shopee.com/documents/v2/v2.product.get_all_vehicle_list?module=89&type=1).
- Exemplo de retorno do endpoint:
{
    "error": "",
    "message": "",
    "warning": "",
    "request_id": "6535ecb33a3f8c6900c8d2b515f3c821",
    "response": {
        "vehicle_list": [
            {
                "brand_id": 5770,
                "brand_name": "Chevrolet",
                "model_id": 5905,
                "model_name": "Chevette",
                "year_id": 5712,
                "year_name": "1979",
                "version_id": 5907,
                "version_name": "Hatch"
            },
            {
                "brand_id": 5770,
                "brand_name": "Chevrolet",
                "model_id": 5905,
                "model_name": "Chevette",
                "year_id": 5712,
                "year_name": "1979",
                "version_id": 5906,
                "version_name": "S"
            }....
           ],
        "has_next_page": true,
        "next_offset": 61
    }
} 
v2.product.get_vehicle_list_by_compatibility_detail
 
- Nesse endpoint é possível identificar os detalhes para cada um dos elementos do veículo (marca / modelo / ano / versão). O parâmetro obrigatório é o "compatibility_details" onde você pode especificar que nível de detalhamento deseja ver. Parâmetros opcionais (brand_id / model_id / year_id / version_id) ajudam no refinamento da busca. Mais informações em sua página na API Reference (https://open.shopee.com/documents/v2/v2.product.get_vehicle_list_by_compatibility_detail?module=89&type=1).
- Exemplos de chamadas no endpoint:
RequestResponsecompatibility_details="Brand"

"response": {
                "compatibility_tree": [
                    {
                       "compatibility_details": [
                            {
                                 "brand_id": 12345,
                                 "brand_name": "Toyota",
                            },
                            {
                                 "brand_id": 13524,
                                 "brand_name": "Renault",
                            },
                            {
                                "brand_id": 14235,
                                "brand_name": "Chevrolet",
                            },
 …compatibility_brand_id=12345&compatibility_details="Model"

"response": {
               "compatibility_tree": [
                   {
                  "compatibility_details": [
                            {
                                 "model_id": 222234,
                               "model_name": "Etios",
                            },
                            {
                                "model_id": 234234,
                                 "model_name": "Corolla",
                            },
                            {
                                 "model_id": 225243,
                                 "model_name": "Bandeirante",
                           },
 …Mudanças em endpoints existentes 
Alguns endpoints sofreram ajustes para que possam se adequar ao fluxo de compatibilidade, são eles:
- V2.product.add_item;
- V2.product.update_item;
- v2.product.get_item_base_info;
 
Nos dois primeiros endpoints é possível inserir as informações de compatibilidade para itens novos / existentes, respectivamente. No terceiro as mudanças auxiliam a confirmar se as informações de compatibilidade foram adicionadas corretamente.
 
Exemplo de estrutura para chamadas no v2.product.add_item e v2.product.update_item
    "compatibility_info": {
        "vehicle_info_list": [
            {
                "brand_id": 5770,
                "model_id": 5911,
                "year_id": 5590,
                "version_id": 5912
            },
            {
                "brand_id": 5508,
                "model_id": 5509,
                "year_id": 5516
            },
            {
                "brand_id": 5770,
                "model_id": 5905
            }
        ]
    },    
 
Algumas considerações importantes:
- Se um determinado produto é compatível com todas as versões de um determinado ano, basta informar os ids para brand, model e year, o sistema entenderá que todas as versões daquele ano deverão ser inseridas na lista de compatibilidade;
			{
                "brand_id": 5508,
                "model_id": 5509,
                "year_id": 5516
            } 
- De maneira similar, se todas as versões de todos os anos de um dado modelo forem compatíveis com o produto, basta informar os ids para brand e model;
            {
                "brand_id": 5770,
                "model_id": 5905
            } 
- O v2.product.update_item poderá ser usado normalmente para adicionar as informações de compatibilidade em itens existentes que não a possuam. Nesse caso, basta informar a lista de compatibilidade conforme exemplos acima;
 
- ATENÇÃO: Ao usar o v2.product.update_item para adicionar compatibilidade em um item que já possui veículos em sua lista, você deverá informar a lista de ids existente atualmente no item + os novos ids de compatibilidade. Caso contrário, a lista de ids existente será sobreposta pelos novos ids informados na chamada do update item.
 
Se restar alguma dúvida no uso dos novos endpoints, basta abrir um ticket (https://open.shopee.com/myconsole/ticket-system/raise-ticket/) e iremos te auxiliar a integrar corretamente com a nova funcionalidade.

## Content (raw HTML)

```html
<p>A partir do dia 24 de junho de 2024 está disponível na Shopee a feature que permite adicionar compatibilidade entre veículos e produtos de auto peças. Com isso alguns endpoints foram criados e outros tiveram atualizações relacionadas a esse tema.</p><h3><span style="color:#EE4D2D;"><strong>Vantagens no uso da feature de compatibilidade</strong></span></h3><p>&nbsp;</p><ul><li>Sellers poderão configurar itens mais completos, com os dados de veículos compatíveis com seus produtos;</li><li>Os itens com compatibilidade preenchida irão aparecer em posições de melhor relevância na página de resultados da pesquisa (SRP) do buyer;</li><li>O buyer terá maior confiabilidade na compra, uma vez que será mais fácil confirmar se um item é de fato compatível com seu veículo.</li></ul><p>&nbsp;</p><p>Considerando esse cenário, se o seus clientes (os sellers) trabalham com itens de autopeças, recomendamos fortemente que implementem os novos endpoints na plataforma de vocês.</p><h3><span style="color:#EE4D2D;"><strong>Estrutura dos dados</strong></span></h3><p>&nbsp;</p><p>Os dados dos veículos são armazenados da seguinte forma:</p><figure class="table"><table><thead><tr><th>Parâmetro</th><th>Significado</th><th>Exemplo</th></tr></thead><tbody><tr><td>brand_id</td><td>O id de uma marca específica.</td><td><span style="color:#098658;">5770</span></td></tr><tr><td>brand_name</td><td>O nome da marca relacionada a cada brand_id.</td><td><span style="color:#0451a5;">"Chevrolet"</span></td></tr><tr><td>model_id</td><td>O id de um modelo específico.</td><td><span style="color:#098658;">5905</span></td></tr><tr><td>model_name</td><td>O nome do modelo relacionado ao model_id.</td><td><span style="color:#0451a5;">"Chevette"</span></td></tr><tr><td>year_id</td><td>O id de cada ano.</td><td><span style="color:#098658;">5712</span></td></tr><tr><td>year_name</td><td>O ano relacionado a um dado year_id.</td><td><span style="color:#0451a5;">"1979"</span></td></tr><tr><td>version_id</td><td>A id de cada versão de um veículo.</td><td><span style="color:#098658;">5907</span></td></tr><tr><td>version_name</td><td>O nome da versão associada ao version_id.</td><td><span style="color:#0451a5;">"Hatch"</span></td></tr></tbody></table></figure><p>&nbsp;</p><p>Estabelecido isso, é importante reforçar que os parâmetros listados acima seguem a seguinte relação de dependência: brand &gt; model &gt; year &gt; version.</p><h3><span style="color:#EE4D2D;"><strong>Novos endpoints:</strong></span></h3><p>&nbsp;</p><p><span style="color:#EE4D2D;"><strong>v2.product.get_all_vehicle_list</strong></span></p><p>&nbsp;</p><ul><li><span style="color:#2B2C2D;">Como o nome indica, é o endpoint responsável por trazer toda a lista de veículos presente na base de dados da Shopee. Para usá-lo, o parâmetro obrigatório é o tamanho da página (page_size) que pode ser de no máximo 100 itens. Mais detalhes do endpoint você encontra em </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_all_vehicle_list?module=89&amp;type=1">sua página do API Reference</a><span style="color:#2B2C2D;">.</span></li><li>Exemplo de retorno do endpoint:</li></ul><pre><code class="python hljs">{
    "error": "",
    "message": "",
    "warning": "",
    "request_id": "6535ecb33a3f8c6900c8d2b515f3c821",
    "response": {
        "vehicle_list": [
            {
                "brand_id": 5770,
                "brand_name": "Chevrolet",
                "model_id": 5905,
                "model_name": "Chevette",
                "year_id": 5712,
                "year_name": "1979",
                "version_id": 5907,
                "version_name": "Hatch"
            },
            {
                "brand_id": 5770,
                "brand_name": "Chevrolet",
                "model_id": 5905,
                "model_name": "Chevette",
                "year_id": 5712,
                "year_name": "1979",
                "version_id": 5906,
                "version_name": "S"
            }....
           ],
        "has_next_page": true,
        "next_offset": 61
    }
}</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:#EE4D2D;"><strong>v2.product.get_vehicle_list_by_compatibility_detail</strong></span></p><p>&nbsp;</p><ul><li>Nesse endpoint é possível identificar os detalhes para cada um dos elementos do veículo (marca / modelo / ano / versão). O parâmetro obrigatório é o "compatibility_details" onde você pode especificar que nível de detalhamento deseja ver. Parâmetros opcionais (brand_id / model_id / year_id / version_id) ajudam no refinamento da busca. Mais informações em sua <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_vehicle_list_by_compatibility_detail?module=89&amp;type=1">página na API Reference</a>.</li><li>Exemplos de chamadas no endpoint:</li></ul><figure class="table"><table><thead><tr><th><strong>Request</strong></th><th><strong>Response</strong></th></tr></thead><tbody><tr><td><strong>compatibility_details</strong>="Brand"</td><td><pre><code class="python hljs">

"response": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"compatibility_tree": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"compatibility_details": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_id": 12345,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_name": "Toyota",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_id": 13524,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_name": "Renault",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_id": 14235,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"brand_name": "Chevrolet",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 …</code></pre></td></tr><tr><td><strong>compatibility_brand_id</strong>=12345&amp;<strong>compatibility_details</strong>="Model"</td><td><pre><code class="python hljs">

"response": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"compatibility_tree": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"compatibility_details": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 222234,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_name": "Etios",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 234234,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_name": "Corolla",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 225243,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_name": "Bandeirante",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 …</code></pre></td></tr></tbody></table></figure><h3><span style="color:#EE4D2D;">Mudanças em endpoints existentes</span></h3><p>&nbsp;</p><p><span style="color:#2B2C2D;">Alguns endpoints sofreram ajustes para que possam se adequar ao fluxo de compatibilidade, são eles:</span></p><ul><li><span style="color:#EE4D2D;">V2.product.add_item;</span></li><li><span style="color:#EE4D2D;">V2.product.update_item;</span></li><li><span style="color:#EE4D2D;">v2.product.get_item_base_info;</span></li></ul><p>&nbsp;</p><p><span style="color:#2B2C2D;">Nos dois primeiros endpoints é possível inserir as informações de compatibilidade para itens novos / existentes, respectivamente. No terceiro as mudanças auxiliam a confirmar se as informações de compatibilidade foram adicionadas corretamente.</span></p><p>&nbsp;</p><p><span style="color:#EE4D2D;">Exemplo de estrutura para chamadas no v2.product.add_item e v2.product.update_item</span></p><pre><code class="python hljs">    "compatibility_info": {
        "vehicle_info_list": [
            {
                "brand_id": 5770,
                "model_id": 5911,
                "year_id": 5590,
                "version_id": 5912
            },
            {
                "brand_id": 5508,
                "model_id": 5509,
                "year_id": 5516
            },
            {
                "brand_id": 5770,
                "model_id": 5905
            }
        ]
    },</code></pre><p>&nbsp; &nbsp;&nbsp;</p><p>&nbsp;</p><p>Algumas considerações importantes:</p><ul><li>Se um determinado produto é compatível com todas as versões de um determinado ano, basta informar os ids para brand, model e year, o sistema entenderá que todas as versões daquele ano deverão ser inseridas na lista de compatibilidade;</li></ul><pre><code class="python hljs">			{
                "brand_id": 5508,
                "model_id": 5509,
                "year_id": 5516
            }</code></pre><p>&nbsp;</p><ul><li>De maneira similar, se todas as versões de todos os anos de um dado modelo forem compatíveis com o produto, basta informar os ids para brand e model;</li></ul><pre><code class="python hljs">            {
                "brand_id": 5770,
                "model_id": 5905
            }</code></pre><p>&nbsp;</p><ul><li>O v2.product.update_item poderá ser usado normalmente para adicionar as informações de compatibilidade em itens existentes que não a possuam. Nesse caso, basta informar a lista de compatibilidade conforme exemplos acima;</li></ul><p>&nbsp;</p><ul><li><span style="color:#EE4D2D;"><strong>ATENÇÃO:</strong></span> Ao usar o v2.product.update_item <span style="background-color:#E9EEF6;"><strong>para adicionar compatibilidade em um item que já possui veículos em sua lista</strong>, você deverá informar a lista de ids existente atualmente no item + os novos ids de compatibilidade</span>. Caso contrário, a lista de ids existente será sobreposta pelos novos ids informados na chamada do update item.</li></ul><p>&nbsp;</p><p>Se restar alguma dúvida no uso dos novos endpoints, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/">basta abrir um ticket</a> e iremos te auxiliar a integrar corretamente com a nova funcionalidade.</p>
```
