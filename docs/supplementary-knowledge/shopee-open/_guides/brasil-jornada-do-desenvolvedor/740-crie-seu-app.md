# Crie seu App

> **Source:** [https://open.shopee.com/developer-guide/740](https://open.shopee.com/developer-guide/740)
> **Type:** Developer Guide / Overview
> **document_id:** `740`
> **Section:** BRASIL | Jornada do Desenvolvedor / Sua trilha começa aqui!

## Content

Crie sua primeira aplicaçãoObjetivoCriar a aplicação que será responsável por se comunicar com as APIs da Shopee Open Platform.
O que você fará nesta etapaVocê criará uma nova aplicação no Console, escolherá a categoria adequada para sua integração e configurará as informações básicas necessárias para começar o desenvolvimento em: https://open.shopee.com/console/app (https://open.shopee.com/console/app) 
 
 
Nessa etapa seu aplicativo ficará "Developing" (Desenvolvendo), a próxima etapa é usar a API Test Tool e depois solicitar o Go-Live.
Antes de continuar, você deve saber- Nesse momento podem ser preenchidas informações de teste.
- Escolha a categoria do App de acordo com o objetivo da sua integração.
- Cada "App Category" possui APIs/endpoints próprios e não há permissões manuais ou extras de outros endpoints.
- Após criado, não é possível alterar a categoria nem adicionar novas permissões ao mesmo App. Caso precise acessar APIs de outra categoria, será necessário criar uma nova aplicação.
- Guarde sua Partner Key em um local seguro. Ela será utilizada para gerar a assinatura das chamadas às APIs.
- Há diferenças entre Partner Key Sandbox (enquanto o app estiver "Developing") e Live, após solicitar o Go Live, não esqueça de usar a Partner Key correta.
Os modelos de uso mais comuns são:Registered Business Seller: App Seller In-House System
Third-party Partner (ISV): App ERP System
Erros comuns- Criar um App na categoria incorreta e depois solicitar liberação de novas APIs.
- Utilizar credenciais de Sandbox em chamadas para Produção (ou vice-versa).

## Content (raw HTML)

```html
<h2>Crie sua primeira aplicação</h2><h2>Objetivo</h2><p>Criar a aplicação que será responsável por se comunicar com as APIs da Shopee Open Platform.</p><h2>O que você fará nesta etapa</h2><p>Você criará uma nova aplicação no Console, escolherá a categoria adequada para sua integração e configurará as informações básicas necessárias para começar o desenvolvimento em: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/console/app">https://open.shopee.com/console/app</a>&nbsp;</p><p>&nbsp;</p><figure class="image image_resized" style="width:1047px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=En2HSbPHLQqdiWnhwHf%2Bovcs%2BurGVSIGpgbSE2nulPoGhvWeTu18ww6tI%2Buk50gzYRar8PfmFAFY4METOQEqGA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>Nessa etapa seu aplicativo ficará "<strong>Developing</strong>" (Desenvolvendo), a próxima etapa é usar a API Test Tool e depois solicitar o Go-Live.</p><h2>Antes de continuar, você deve saber</h2><ul><li>Nesse momento podem ser preenchidas informações de teste.</li><li>Escolha a categoria do App de acordo com o objetivo da sua integração.</li><li>Cada "App Category" possui <strong>APIs/endpoints próprios e não há permissões manuais ou extras de outros endpoints.</strong></li><li>Após criado, <strong>não é possível alterar a categoria nem adicionar novas permissões ao mesmo App</strong>. Caso precise acessar APIs de outra categoria, será necessário criar uma nova aplicação.</li><li>Guarde sua Partner Key em um local seguro. Ela será utilizada para gerar a assinatura das chamadas às APIs.</li><li>Há diferenças entre Partner Key Sandbox (enquanto o app estiver "Developing") e Live, após solicitar o Go Live, não esqueça de usar a Partner Key correta.</li></ul><h2>Os modelos de uso mais comuns são:</h2><p>Registered Business Seller: App Seller In-House System</p><p>Third-party Partner (ISV): App ERP System</p><h2>Erros comuns</h2><ul><li>Criar um App na categoria incorreta e depois solicitar liberação de novas APIs.</li><li>Utilizar credenciais de Sandbox em chamadas para Produção (ou vice-versa).</li></ul><p>&nbsp;</p>
```
