# Introdução

O AdonisJs fornece um punhado de ferramentas para manter seus sites seguros contra ataques comuns da web.

Neste guia, aprendemos sobre as melhores práticas para manter seus aplicativos AdonisJs seguros.

::: danger OBSERVAÇÃO
Se você descobrir algum bug de segurança, [informe-nos imediatamente por e-mail](mailto:virk@adonisjs.com). Não crie problemas no GitHub, pois isso pode afetar os aplicativos em execução na produção. Os problemas encontrados serão divulgados assim que os patches forem enviados para a base de código.
:::

## Segurança da sessão
As sessões podem vazar informações importantes se não forem tratadas com cuidado.

O AdonisJs criptografa e assina todos os cookies usando a `appKey` definida no arquivo `config/app.js`.

Mantenha sua `appKey` em segredo – não a compartilhe com ninguém e nunca a envie para sistemas de controle de versão como o Github.

### Configuração da sessão
A configuração da sessão é salva dentro do arquivo `config/session.js`.

Ao atualizar sua configuração de sessão, considere as seguintes sugestões:

* O valor `httpOnly` deve ser definido como `true`, pois defini-lo como `false` tornará seus cookies acessíveis via JavaScript usando `document.cookie`.
* O valor `sameSite` também deve ser definido como `true`, garantindo que seu cookie de sessão não seja visível/acessível por meio de domínios diferentes.

## Spoofing de método de formulário
Como os formulários HTML só são capazes de fazer solicitações `GET` e `POST`, você não pode usar verbos HTTP como `PUT` ou `DELETE` para executar operações engenhosas por meio do atributo `method` de um formulário.

Para contornar isso, o AdonisJs implementa [form method spoofing](/docs/04-Basics/04-Request.md), permitindo que você envie seu método HTTP pretendido por meio do parâmetro de string de consulta `_method` da URL de solicitação:

```js
// .Route

Route.put('/users/:id', 'UserController.update')
```

```html
<!-- .View -->

<form action="/users/1?_method=PUT" method="POST">
</form>
```

No exemplo acima, anexar `?_method=PUT` à URL `action` do formulário converte o método HTTP de solicitação de `POST` para `PUT`.

Aqui estão algumas coisas que você deve saber sobre spoofing de método:

* O AdonisJs apenas falsifica métodos em que o método HTTP de origem é `POST`, o que significa que solicitações `GET` que passam por um `_method` HTTP pretendido não são falsificadas.
* O spoofing de método pode ser desabilitado configurando `allowMethodSpoofing` como `false` dentro do arquivo `config/app.js`:
  ```js
  // .config/app.js

  http: {
    allowMethodSpoofing: false
  }
  ```

## Uploads de arquivo
Os invasores geralmente tentam fazer upload de arquivos maliciosos para servidores para depois executar e obter acesso aos servidores para realizar algum tipo de atividade destrutiva.

Além de fazer upload de arquivos maliciosos, os invasores também podem tentar fazer upload de arquivos *enormes* para que seu servidor fique ocupado fazendo upload e comece a lançar erros de *TEMPO LIMITE* para solicitações subsequentes.

Para combater esse cenário, o AdonisJs permite que você defina o *tamanho máximo de upload* processável pelo seu servidor. Isso significa que qualquer arquivo maior que o `maxSize` especificado é negado, mantendo seu servidor em um estado saudável.

Defina seu valor `maxSize` dentro do arquivo `config/bodyParser.js`:

```js
// .config/bodyParser.js

uploads: {
  maxSize: '2mb'
}
```

Aqui estão algumas dicas a serem consideradas ao lidar com uploads de arquivos:

* Renomeie os arquivos do usuário antes de fazer upload/armazenar.
* Não armazene os arquivos enviados dentro do diretório `public`, pois os arquivos `public` podem ser acessados ​​diretamente.
* Não compartilhe a localização real dos arquivos enviados com seus usuários. Em vez disso, considere salvar uma referência aos caminhos dos arquivos enviados em seu banco de dados (cada arquivo tendo um *id exclusivo*) e configure uma rota para servir esses arquivos enviados via `id`, assim:
  ```js
  // .start/routes.js

  const Helpers = use('Helpers')

  Route.get('download/:fileId', async ({ params, response }) => {
    const file = await Files.findorFail(params.fileId)
    response.download(Helpers.tmpPath('uploads/${file.path}'))
  })
  ```
