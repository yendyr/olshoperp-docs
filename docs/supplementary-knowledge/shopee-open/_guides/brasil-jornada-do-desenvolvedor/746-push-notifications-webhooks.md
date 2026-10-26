# Push Notifications (Webhooks)

> **Source:** [https://open.shopee.com/developer-guide/746](https://open.shopee.com/developer-guide/746)
> **Type:** Developer Guide / Overview
> **document_id:** `746`
> **Section:** BRASIL | Jornada do Desenvolvedor / Sua trilha começa aqui!

## Content

Configure Push NotificationsO que são Push Notifications?Push Notifications são mensagens enviadas pela Shopee diretamente para a Callback URL configurada pela sua aplicação quando ocorre um evento relevante.
Por exemplo:
- Um pedido foi criado;
- O status de um pedido foi alterado;
- Um produto foi atualizado;
- Uma autorização foi cancelada;
- Uma atualização logística ocorreu.
ObjetivoPermitir que a Shopee envie atualizações automaticamente para sua integração quando determinados eventos ocorrerem, sem que sua aplicação precise consultar as APIs repetidamente.
O que você fará nesta etapaVocê configurará uma Callback URL, selecionará os eventos que sua aplicação precisa receber e preparará seu sistema para processar as notificações enviadas pela Shopee.
Antes de continuar você precisa saber:- No Shopee Open Platform, Push Mechanism é o mesmo conceito conhecido como Webhook em outras plataformas.
- Push NÃO substitui API. O Push só diz: "Algo mudou." Depois disso o desenvolvedor chama a API correspondente.
- Nem todo App possui todos os Push. Verifique os webhooks disponíveis na documentação.
- Callback URL precisa ser verificada. A Shopee faz um POST para validar a URL.
- Cada Push enviado pela Shopee contém um Authorization Header, que pode ser validado utilizando sua Partner Key para confirmar que a requisição realmente foi enviada pela Shopee.
- Callback deve responder 2xx.
- Consulte a documentação para obter detalhes sobre a lógica de reenvio das notificações (Push Mechanism Retry Logic) e sobre os critérios de aviso e desabilitação automática do Push Mechanism (Push Mechanism Warning/Disable Logic).
Como configurar- Acesse o Open Platform Console.
- No menu lateral, clique em Push Mechanism.
- Selecione a aplicação que deseja configurar.
- Informe a Callback URL da sua integração.
- Selecione ou habilite os eventos necessários.
- Realize a validação solicitada pelo Console.
- Salve a configuração.
- Confirme que sua aplicação consegue receber e processar os eventos.
 
No Sandbox V2, é possível configurar a Test Callback URL, concluir sua validação e utilizar a opção Push Test Data para enviar dados de teste à aplicação. O Push de Sandbox é independente da configuração de Produção.
Próximo passoApós configurar Push Notifications, monitore o recebimento dos eventos e valide se sua aplicação está atualizando corretamente pedidos, produtos e demais recursos relacionados.
 
 
📚 Leia a documentação completa
- Push Mechanism notifications (https://open.shopee.com/developer-guide/18)
- Push APIs List (https://open.shopee.com/push-mechanism/5)

## Content (raw HTML)

```html
<h1>Configure Push Notifications</h1><h2>O que são Push Notifications?</h2><p>Push Notifications são mensagens enviadas pela Shopee diretamente para a Callback URL configurada pela sua aplicação quando ocorre um evento relevante.</p><p>Por exemplo:</p><ul><li>Um pedido foi criado;</li><li>O status de um pedido foi alterado;</li><li>Um produto foi atualizado;</li><li>Uma autorização foi cancelada;</li><li>Uma atualização logística ocorreu.</li></ul><figure class="image image_resized" style="width:835px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=yHs8IMFOPm%2Bus2dqYTQwa95cRkYvrf88lmxTgKUnZL4W6562LoIl9GdD09btWDLLXICB4HNIydt9IBB8rzF9oA%3D%3D&amp;image_type=png"></figure><h2>Objetivo</h2><p>Permitir que a Shopee envie atualizações automaticamente para sua integração quando determinados eventos ocorrerem, sem que sua aplicação precise consultar as APIs repetidamente.</p><h2>O que você fará nesta etapa</h2><p>Você configurará uma <strong>Callback URL</strong>, selecionará os eventos que sua aplicação precisa receber e preparará seu sistema para processar as notificações enviadas pela Shopee.</p><h2>Antes de continuar você precisa saber:</h2><ul><li>No Shopee Open Platform, Push Mechanism é o mesmo conceito conhecido como Webhook em outras plataformas.</li><li>Push NÃO substitui API. O Push só diz: "Algo mudou." Depois disso o desenvolvedor chama a API correspondente.</li><li>Nem todo App possui todos os Push. Verifique os webhooks disponíveis na documentação.</li><li>Callback URL precisa ser verificada. A Shopee faz um POST para validar a URL.</li><li>Cada Push enviado pela Shopee contém um <strong>Authorization Header</strong>, que pode ser validado utilizando sua Partner Key para confirmar que a requisição realmente foi enviada pela Shopee.</li><li>Callback deve responder 2xx.</li><li><strong>Consulte a documentação para obter detalhes sobre a lógica de reenvio das notificações (</strong><i><strong>Push Mechanism Retry Logic</strong></i><strong>) e sobre os critérios de aviso e desabilitação automática do Push Mechanism (</strong><i><strong>Push Mechanism Warning/Disable Logic</strong></i><strong>).</strong></li></ul><h2>Como configurar</h2><ol><li>Acesse o <strong>Open Platform Console</strong>.</li><li>No menu lateral, clique em <strong>Push Mechanism</strong>.</li><li>Selecione a aplicação que deseja configurar.</li><li>Informe a <strong>Callback URL</strong> da sua integração.</li><li>Selecione ou habilite os eventos necessários.</li><li>Realize a validação solicitada pelo Console.</li><li>Salve a configuração.</li><li>Confirme que sua aplicação consegue receber e processar os eventos.</li></ol><p>&nbsp;</p><figure class="image image_resized" style="width:1007px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=csEtOLWHUlEnBCVI8Wr7RCFfyA78x%2F6gmUpFLLSZCgNWipCvHpIi%2Bj7SZcqj1fa1pDaYJsraHQDhksqP1d2N7Q%3D%3D&amp;image_type=png"></figure><p>No Sandbox V2, é possível configurar a <strong>Test Callback URL</strong>, concluir sua validação e utilizar a opção <strong>Push Test Data</strong> para enviar dados de teste à aplicação. O Push de Sandbox é independente da configuração de Produção.</p><h2>Próximo passo</h2><p>Após configurar Push Notifications, monitore o recebimento dos eventos e valide se sua aplicação está atualizando corretamente pedidos, produtos e demais recursos relacionados.</p><p>&nbsp;</p><p>&nbsp;</p><p>📚 <strong>Leia a documentação completa</strong></p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/18">Push Mechanism notifications</a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/5">Push APIs List</a></li></ul><figure class="image image_resized" style="width:730px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=5zxDde5qy9S9dGRuqCktoYpAxAE33SUn2FvN3D8xHKTTcKqAj8Df3JyxeUisQGNgKdNHnRgM9dvEPUwgwwUylQ%3D%3D&amp;image_type=png"></figure>
```
