# Ferramenta de Log da Open Platform

> **Source:** [https://open.shopee.com/developer-guide/381](https://open.shopee.com/developer-guide/381)
> **Type:** Developer Guide / Overview
> **document_id:** `381`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

A Shopee Open Platform possui uma ferramenta de log, que disponibiliza para o desenvolvedor o acesso aos logs dos últimos 7 dias do seu partner_id que já está em produção (Live). Atualmente, é possível consultar os dados dos logs a partir de 20 de Setembro de 2022.

 
Acesso aos Logs da API 
Acesse a ferramenta clicando aqui (https://open.shopee.com/console/tools/api-access-log).
 
- Podem ser consultados os logs da API correspondente ao seu Live Partner dos últimos sete dias, se as solicitações retornaram sucesso ou não;
- Poderá verificar no log os parâmetros da request/response, os códigos de status e outras informações da API que foi chamada;
- Suporta pesquisa rápida através do request_id da sua chamada, dessa forma poderá encontrar com precisão o log pelo request_id que foi retornado no parâmetro de resposta da API;
- Suporta pesquisa por palavra-chave, por exemplo, pode ser inserido na busca a string de order_sn, ou mensagem de erro para procurar nos logs;
- Abrir um chamado de forma rápida, basta clicar no botão Raise a Ticket do lado direito da lista do log, e todas as informações relevantes serão copiadas automaticamente para o formulário de abertura de ticket;
- Visualizar a documentação da API rapidamente, basta clicar no botão View API Detail do lado direito da lista do log, e a documentação da API será aberta em uma nova página.
 
Abertura de chamado através da ferramenta de log da API 
1) Selecione o partner_id que deseja verificar os logs;
2) Caso possua o request_id, basta copiar o request_id no campo Request ID. Caso não possua o request_id da chamada, basta utilizar a palavra-chave que deseja procurar no campo Keywords;
3) O campo API Path pode ser utilizado para filtrar as chamadas no seu histórico de logs;
4) O campo Request Time (UTC-03:00) pode ser utilizado para filtrar as chamadas pelo intervalo de datas;
5) Clique em Search;
6) Clique em Raise a Ticket;
7) Você será redirecionado para o nosso formulário de abertura de chamado, já com as informações mais relevantes, como: 
 
- Developer Email;
- L1 Question Category;
- L2 Question Category;
- Partner ID
- API Version
- API Category
- API Name
- Request 
- Response
- Request ID
 
8) Basta preencher o campo Question Description com a sua dúvida; 
 
 
9) Caso necessário, você poderá anexar arquivos relevantes para a abertura desse ticket, basta adicionar na seção File;
 
 
10) Após preencher, clique em Submit e complete o Captcha;
11) Seu chamado terá sido submetido com sucesso.
 
Acesso aos Logs de Push 
Acesse a ferramenta clicando aqui (https://open.shopee.com/console/tools/push-log).
 
- Podem ser consultados os logs de Push correspondente ao seu Live Partner dos últimos sete dias, se o push retornou com sucesso ou não;
- Se as mensagens não foram enviadas com sucesso, será enviado o motivo na mensagem de erro.
 
Existem três situações em que o push não é bem sucedido:
 
1) Sem resposta da url de callback, mensagem de erro: "Shopee has sent the push to your callback url, but we didn't get any response with 2xx code within the requested timeout seconds, please check your service."
 
2) Recebemos uma resposta com um código que não é 2xx, mensagem de erro: "Shopee has sent the push to your callback url, but the response code we got from your callback url is not 2xx, please check your service."
 
3) Outros motivos, mensagem de erro: "System error."
 
É possível pesquisar por palavra-chave, por exemplo, pode ser inserido na busca a string de order_sn, ou mensagem de erro para procurar nos logs de Push.
 
Lembre-se de preencher todos os campos obrigatórios (campos marcados com *):
 
- Partner ID;
- Push Mechanism;
- Send Time (UTC-03:00) - alterar para a data desejada (disponível log dos últimos 7 dias);
- Send Result.
 
Caso opte por buscar por uma palavra-chave específica, basta utilizar o campo Keywords, por exemplo a order_sn, e depois basta clicar em Search. A lista de logs de push e suas informações aparecerão nos resultados.

## Content (raw HTML)

```html
<p><span style="background-color:transparent;color:rgb(0,0,0);">A Shopee Open Platform possui uma ferramenta de log, que disponibiliza para o desenvolvedor o acesso aos logs dos últimos 7 dias do seu </span><strong>partner_id </strong><span style="background-color:transparent;color:rgb(0,0,0);">que já está em produção (Live). Atualmente, é possível consultar os dados dos logs a partir de 20 de Setembro de 2022.</span></p><p><br>&nbsp;</p><h2><strong>Acesso aos Logs da API</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Acesse a ferramenta </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/console/tools/api-access-log"><strong>clicando aqui</strong></a><span style="background-color:transparent;color:rgb(0,0,0);">.</span></p><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Podem ser consultados os logs da API correspondente ao seu Live Partner dos últimos sete dias, se as solicitações retornaram sucesso ou não;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Poderá verificar no log os parâmetros da request/response, os códigos de status e outras informações da API que foi chamada;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Suporta pesquisa rápida através do request_id da sua chamada, dessa forma poderá encontrar com precisão o log pelo request_id que foi retornado no parâmetro de resposta da API;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Suporta pesquisa por palavra-chave, por exemplo, pode ser inserido na busca a string de order_sn, ou mensagem de erro para procurar nos logs;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Abrir um chamado de forma rápida, basta clicar no botão </span><strong>Raise a Ticket</strong><span style="background-color:transparent;color:rgb(0,0,0);"> do lado direito da lista do log, e todas as informações relevantes serão copiadas automaticamente para o formulário de abertura de ticket;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Visualizar a documentação da API rapidamente, basta clicar no botão </span><strong>View API Detail</strong><span style="background-color:transparent;color:rgb(0,0,0);"> do lado direito da lista do log, e a documentação da API será aberta em uma nova página.</span></li></ol><p>&nbsp;</p><h2><strong>Abertura de chamado através da ferramenta de log da API</strong></h2><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">1) Selecione o partner_id que deseja verificar os logs;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">2) Caso possua o request_id, basta copiar o request_id no campo </span><strong>Request ID</strong><span style="background-color:transparent;color:rgb(0,0,0);">. Caso não possua o request_id da chamada, basta utilizar a palavra-chave que deseja procurar no campo </span><strong>Keywords</strong><span style="background-color:transparent;color:rgb(0,0,0);">;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">3) O campo </span><strong>API Path</strong><span style="background-color:transparent;color:rgb(0,0,0);"> pode ser utilizado para filtrar as chamadas no seu histórico de logs;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">4) O campo </span><strong>Request Time (UTC-03:00) </strong><span style="background-color:transparent;color:rgb(0,0,0);">pode ser utilizado para filtrar as chamadas pelo intervalo de datas;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">5) Clique em </span><strong>Search</strong><span style="background-color:transparent;color:rgb(0,0,0);">;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">6) Clique em </span><strong>Raise a Ticket</strong><span style="background-color:transparent;color:rgb(0,0,0);">;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">7) Você será redirecionado para o nosso formulário de abertura de chamado, já com as informações mais relevantes, como:&nbsp;</span></p><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Developer Email;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">L1 Question Category;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">L2 Question Category;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Partner ID</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">API Version</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">API Category</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">API Name</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Request&nbsp;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Response</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Request ID</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">8) Basta preencher o campo </span><strong>Question Description</strong><span style="background-color:transparent;color:rgb(0,0,0);"> com a sua dúvida;&nbsp;</span></p><p>&nbsp;</p><figure class="image"><img src="https://cf.shopee.sg/file/d96688f74afed4b5b63176b1da8a0ecb"></figure><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">9) Caso necessário, você poderá anexar arquivos relevantes para a abertura desse ticket, basta adicionar na seção </span><strong>File</strong><span style="background-color:transparent;color:rgb(0,0,0);">;</span></p><p>&nbsp;</p><figure class="image"><img src="https://cf.shopee.sg/file/d56ba816031e5b837a66f4fd68f868df"></figure><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">10) Após preencher, clique em </span><strong>Submit </strong><span style="background-color:transparent;color:rgb(0,0,0);">e complete o Captcha;</span></p><p><span style="background-color:transparent;color:rgb(0,0,0);">11) Seu chamado terá sido submetido com sucesso.</span></p><p>&nbsp;</p><h2><strong>Acesso aos Logs de Push</strong></h2><p>&nbsp;</p><p>Acesse a ferramenta <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/console/tools/push-log"><strong>clicando aqui</strong></a>.</p><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Podem ser consultados os logs de Push correspondente ao seu Live Partner dos últimos sete dias, se o push retornou com sucesso ou não;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Se as mensagens não foram enviadas com sucesso, será enviado o motivo na mensagem de erro.</span></li></ol><p>&nbsp;</p><p><strong>Existem três situações em que o push não é bem sucedido:</strong></p><p>&nbsp;</p><p><strong>1) Sem resposta da url de callback, mensagem de erro: "</strong><span style="background-color:transparent;color:rgb(0,0,0);">Shopee has sent the push to your callback url, but we didn't get any response with 2xx code within the requested timeout seconds, please check your service."</span></p><p>&nbsp;</p><p><strong>2) Recebemos uma resposta com um código que não é 2xx, mensagem de erro:</strong><span style="background-color:transparent;color:rgb(0,0,0);"> "Shopee has sent the push to your callback url, but the response code we got from your callback url is not 2xx, please check your service."</span></p><p>&nbsp;</p><p><strong>3) Outros motivos, mensagem de erro: </strong><span style="background-color:transparent;color:rgb(0,0,0);">"System error."</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">É possível pesquisar por palavra-chave, por exemplo, pode ser inserido na busca a string de order_sn, ou mensagem de erro para procurar nos logs de Push.</span></p><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Lembre-se de preencher todos os campos obrigatórios (campos marcados com *):</span></p><p>&nbsp;</p><ol><li><span style="background-color:transparent;color:rgb(0,0,0);">Partner ID;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Push Mechanism;</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Send Time (UTC-03:00) - alterar para a data desejada (disponível log dos últimos 7 dias);</span></li><li><span style="background-color:transparent;color:rgb(0,0,0);">Send Result.</span></li></ol><p>&nbsp;</p><p><span style="background-color:transparent;color:rgb(0,0,0);">Caso opte por buscar por uma palavra-chave específica, basta utilizar o campo </span><strong>Keywords</strong><span style="background-color:transparent;color:rgb(0,0,0);">, por exemplo a order_sn, e depois basta clicar em </span><strong>Search</strong><span style="background-color:transparent;color:rgb(0,0,0);">. A lista de logs de push e suas informações aparecerão nos resultados.</span></p>
```
