# Introdução

O AdonisJs fornece várias ferramentas para manter seus sites protegidos contra ataques comuns na web.

Neste guia, aprendemos sobre as melhores práticas para manter seus aplicativos AdonisJs seguros.

> Se você descobrir algum bug de segurança, informe-nos imediatamente por [e-mail](virk@adonisjs.com). 
> Não crie issues no GitHub, pois isso pode afetar os aplicativos em execução na produção. Os problemas 
> encontrados serão divulgados assim que os patches forem enviados para a base de código.

## Segurança da sessão
As sessões podem vazar informações importantes se não forem manuseadas com cuidado.

O AdonisJs criptografa e assina todos os cookies usando o `appKey` definido no arquivo `config/app.js`.

Mantenha seu `appKey` em segredo - não o compartilhe com ninguém e nunca o envie a sistemas de controle de v
ersão como o Github.

### Configuração da sessão
A configuração da sessão é salva dentro do arquivo `config/session.js`.

Ao atualizar sua configuração de sessão, considere as seguintes sugestões:

+ O valor `httpOnly` deve ser definido como `true`, conforme definido para tornar `false` seus cookies acessíveis via JavaScript usando `document.cookie`.
+ O valor `sameSite` também deve ser definido como `true`, garantindo que o cookie da sessão não seja visível/acessível por diferentes domínios.

## Falsificação de método de formulário
Como os formulários HTML são capazes apenas de fazer solititações `GET` e `POST`, você não pode usar 
verbos HTTP como `PUT` ou `DELETE` para executar operações com recursos por meio do atributo `method` de um formulário.

Para contornar isso, o AdonisJs implementa a [falsificação de método de formulário](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/basics/request.md#m%C3%A9todo-de-falsifica%C3%A7%C3%A3o), permitindo que você envie o método 
HTTP pretendido por meio do parâmetro `_method` na *query string*:

``` js
Route.put('/users/:id', 'UserController.update')
```

``` html
<form action="/users/1?_method=PUT" method="POST">
</form>
```

No exemplo acima, anexar `?_method=PUT` à `action` do formulário converte o método HTTP da 
solicitação de `POST` para `PUT`.

Aqui estão algumas coisas que você deve saber sobre falsificação de métodos:

+ O AdonisJs falsifica apenas métodos onde o método HTTP de origem está como `POST`, o que significa que solicitações `GET` que passam por um HTTP pretendido, `_method` não irá funcionar.

+ A falsificação de método pode ser desativada configurando `allowMethodSpoofing` para `false` dentro do
arquivo `config/app.js`:

``` js
http: {
  allowMethodSpoofing: false
}
```

## Uploads de arquivos
Os invasores geralmente tentam fazer upload de arquivos mal-intencionados nos servidores para executar 
posteriormente e obter acesso aos servidores para realizar algum tipo de atividade destrutiva.

Além de fazer upload de arquivos maliciosos, os invasores também podem tentar fazer upload de arquivos 
enormes, para que o servidor fique ocupado fazendo o upload e comece a gerar erros de TIMEOUT para 
solicitações subsequentes.

Para combater esse cenário, o AdonisJs permite definir o tamanho máximo de upload processável pelo seu 
servidor. Isso significa que qualquer arquivo maior que o especificado em `maxSize` é negado, mantendo o 
servidor em um estado íntegro.

Defina seu valor `maxSize`dentro do arquivo `config/bodyParser.js`:

``` js
uploads: {
  maxSize: '2mb'
}
```

Aqui estão algumas dicas a serem consideradas ao lidar com uploads de arquivos:

+ Renomeie os arquivos do usuário antes de carregar/armazenar.
+ Não armazene arquivos carregados dentro do diretório `public`, pois os arquivos `public` podem ser acessados diretamente.
+ Não compartilhe o local real dos arquivos enviados com seus usuários. Em vez disso, considere salvar uma referência aos caminhos de arquivos carregados em seu banco de dados (cada arquivo com um ID exclusivo) e configure uma rota para servir esses arquivos carregados por id, como:

``` js
const Helpers = use('Helpers')

Route.get('download/:fileId', async ({ params, response }) => {
  const file = await Files.findorFail(params.fileId)
  response.download(Helpers.tmpPath('uploads/${file.path}'))
})
```
