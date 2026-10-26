# Declare seus IPs

> **Source:** [https://open.shopee.com/developer-guide/742](https://open.shopee.com/developer-guide/742)
> **Type:** Developer Guide / Overview
> **document_id:** `742`

## Content

ObjetivoConfigurar sua aplicação para acessar dados sensíveis retornados por determinadas APIs da Shopee, quando sua integração realmente precisar dessas informações.
O que você fará nesta etapaVocê verificará se sua integração necessita acessar dados sensíveis, declarará os servidores utilizados pela aplicação e habilitará o IP Address Whitelist no Console.
Em alguns países e perfis de desenvolvedor, também poderá ser necessário enviar um Penetration Test Report para aprovação da Shopee.
Antes de continuar, você deve saber- Por padrão, informações sensíveis são retornadas mascaradas pelas APIs.
- Dados como nome, telefone, e-mail e endereço são considerados Sensitive Data.
- Nem todas as integrações precisam solicitar acesso a esses dados.
- Para todos os desenvolvedores, é obrigatório declarar os IPs da aplicação e habilitar o IP Address Whitelist.
- Desenvolvedores Third-party Partner (ISV) de alguns mercados também precisam enviar um Penetration Test Report.
Quando preciso configurar Sensitive Data?Você provavelmente precisará realizar essa configuração quando sua integração necessitar acessar informações pessoais dos compradores retornadas pelas APIs.
Caso contrário, os campos poderão ser retornados mascarados ou indisponíveis.
Como habilitar o acesso?- Acesse App List.
- Selecione sua aplicação.
- Clique em Go Live ou em Edit, se já estiver em produção.
- Localize a seção IP Address Whitelist.
- Informe os IPs dos servidores utilizados pela aplicação.
- Ative Enable IP Address Whitelist.
- Clique em Submit.
ImportanteApós habilitar o IP Address Whitelist, apenas os IPs declarados poderão realizar chamadas às APIs da Shopee.
Caso sua infraestrutura seja alterada, será necessário atualizar os IPs cadastrados.
📚Leia a documentação completa- Requesting Access to Sensitive Data (https://open.shopee.com/developer-guide/718)

## Content (raw HTML)

```html
<h2>Objetivo</h2><p>Configurar sua aplicação para acessar dados sensíveis retornados por determinadas APIs da Shopee, quando sua integração realmente precisar dessas informações.</p><h2>O que você fará nesta etapa</h2><p>Você verificará se sua integração necessita acessar dados sensíveis, declarará os servidores utilizados pela aplicação e habilitará o <strong>IP Address Whitelist</strong> no Console.</p><p>Em alguns países e perfis de desenvolvedor, também poderá ser necessário enviar um <strong>Penetration Test Report</strong> para aprovação da Shopee.</p><h2>Antes de continuar, você deve saber</h2><ul><li>Por padrão, informações sensíveis são retornadas mascaradas pelas APIs.</li><li><strong>Dados como nome, telefone, e-mail e endereço são considerados Sensitive Data.</strong></li><li>Nem todas as integrações precisam solicitar acesso a esses dados.</li><li>Para todos os desenvolvedores, é obrigatório declarar os IPs da aplicação e habilitar o <strong>IP Address Whitelist</strong>.</li><li>Desenvolvedores Third-party Partner (ISV) de alguns mercados também precisam enviar um <strong>Penetration Test Report</strong>.</li></ul><h1>Quando preciso configurar Sensitive Data?</h1><p>Você provavelmente precisará realizar essa configuração quando sua integração necessitar acessar informações pessoais dos compradores retornadas pelas APIs.</p><p>Caso contrário, os campos poderão ser retornados mascarados ou indisponíveis.</p><h1>Como habilitar o acesso?</h1><ol><li>Acesse <strong>App List</strong>.</li><li>Selecione sua aplicação.</li><li>Clique em <strong>Go Live ou em Edit, se já estiver em produção</strong>.</li><li>Localize a seção <strong>IP Address Whitelist</strong>.</li><li>Informe os IPs dos servidores utilizados pela aplicação.</li><li>Ative <strong>Enable IP Address Whitelist</strong>.</li><li>Clique em <strong>Submit</strong>.</li></ol><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=dprvnS8OcxBcYGSgy%2Fl4V%2F4ad1pzOmm32pTeJBkpU%2FCRKb%2BeKRmL8OhFoI2H36Tppyx9Fbuxeq3tY1QzSoSnSA%3D%3D&amp;image_type=png"></figure><h2>Importante</h2><p>Após habilitar o <strong>IP Address Whitelist</strong>, apenas os IPs declarados poderão realizar chamadas às APIs da Shopee.</p><p>Caso sua infraestrutura seja alterada, será necessário atualizar os IPs cadastrados.</p><h2>📚Leia a documentação completa</h2><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/718"><strong>Requesting Access to Sensitive Data</strong></a></li></ul>
```
