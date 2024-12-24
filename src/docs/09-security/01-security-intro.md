# Introdução

Manter os aplicativos da web seguros é uma das coisas mais importantes. O AdonisJs vem com várias camadas de segurança e higienização de dados para manter seus aplicativos da web longe de ataques comuns.

::: danger OBSERVAÇÃO
Se você encontrar algum bug de segurança, compartilhe-o em virk@adonisjs.com. Não crie um problema no GitHub, pois isso pode afetar os aplicativos em execução na produção. Divulgaremos o problema após enviar o patch para o bug.
:::

## Injeção de SQL
A injeção de SQL é um dos ataques mais comuns da web, em que o usuário final fará uso das entradas e passará a consulta SQL em vez do *nome de usuário*, *e-mail*, etc.

Os modelos Lucid e o construtor de consultas de banco de dados garantirão a execução de instruções preparadas, o que, por sua vez, evita a injeção de SQL. Enquanto seu aplicativo pode ter o requisito de executar consultas SQL `raw`, em vez de usar o método do construtor de consultas, é recomendável aproveitar o método `raw` e passar as ligações como parâmetros.

```js
// Não recomendado

const username = request.param('username')
const users = yield Database
  .table('users')
  .where(Database.raw(`username = ${username}`))
```

```js
// Maneira correta

const username = request.param('username')
const users = yield Database
  .table('users')
  .where(Database.raw('username = ?', [username]))
```

#### Lista de verificação

* [provedor de banco de dados](/docs/05-database/02-query-builder.md) ou
* [sanitizer](/docs/07-common-web-tools/11-validator.md#sanitizedata-rules) para manter seu banco de dados seguro.
* Sempre execute instruções *prepared statements* passando valores de consulta como uma matriz para o método `raw`.

## Segurança de sessão
As sessões podem vazar informações importantes se não forem tratadas com cuidado. O AdonisJs criptografará e assinará todos os cookies usando o `APP_KEY` definido no arquivo `.env`. Certifique-se de manter o `APP_KEY` em segredo e nunca o compartilhe com ninguém e nunca o envie para sistemas de controle de versão como o Github.

### Configuração de sessão
A configuração da sessão é salva dentro do arquivo `config/session.js`, você pode configurar opções conforme suas necessidades e certifique-se de dar aviso aos seguintes pares de chave/valor.

#### Configurações importantes
* Certifique-se de que `httpOnly` esteja definido como *true*. Mantê-lo como *false* o tornará acessível usando Javascript via `document.cookie`.
* Além disso, a propriedade `sameSite` garante que seu cookie de sessão não seja visível/acessível de diferentes domínios.

## Formulários e visualizações
Para manter o ciclo de desenvolvimento simples e produtivo, o AdonisJs vem com alguns recursos que você pode querer considerar antes de lançar seu site ao público.

### Falsificação de método de formulário
Os formulários HTML são capazes apenas de fazer solicitações *GET* e *POST*, o que significa que você não pode usar todos os verbos HTTP para executar operações RESTful. Para facilitar isso, o AdonisJs permite que você defina o método HTTP como uma string de consulta dentro da URL, o que é conhecido como *Form method spoofing*.

```js
// Route
Route.put('/users/:id', 'UserController.update')
```

```html
<!-- View -->
<form action="/users/1?_method=PUT" method="POST">
</form>
```

Definir `_method=PUT` converterá o método HTTP para `PUT` em vez de `POST`. Isso torna muito mais fácil usar qualquer verbo HTTP simplesmente falsificando-o. Aqui estão algumas coisas que você deve estar ciente.

#### Lista de verificação
* O AdonisJs só falsificará métodos quando o método HTTP real for `POST`, o que significa que fazer uma solicitação `GET` com *_method* não terá efeito.
* Você pode desativar a falsificação de formulário definindo `allowMethodSpoofing=false` dentro de `config/app.js`.
  ```js
  http: {
    allowMethodSpoofing: false
  }
  ```

### Injetando ligações de contêiner IoC em visualizações
O AdonisJs simplifica para você `usar` ligações de contêiner IoC em suas visualizações, o que significa que você pode acessar *modelos Lucid* de suas visualizações para buscar dados do banco de dados. Saiba mais sobre [injetar provedores](/docs/04-views/01-views.md#injecting-providers)

Este recurso pode abrir algumas brechas de segurança sérias se suas visualizações forem editáveis ​​pelo mundo externo. Por exemplo, você está criando um CMS usando o AdonisJs e quer que seus usuários criem parciais de visualização reutilizáveis. O usuário final pode buscar o *Modelo de Usuário* dentro de seu parcial e pode excluir todos os usuários.

#### Lista de verificação
* Certifique-se de definir `injectServices=false` dentro do arquivo `config/app.js`.
  ```js
  views: {
    injectServices: false
  }
  ```
* Se estiver usando injeção de serviço, certifique-se de que suas visualizações não sejam editáveis ​​pelo mundo externo.

## Uploads de arquivo
Os invasores geralmente tentam fazer upload de arquivos maliciosos para o servidor e depois executam esses arquivos para obter acesso ao servidor ou realizar algumas ações destrutivas.

Não apenas os arquivos são enviados para adquirir o acesso ao servidor, muitas vezes você encontrará pessoas tentando fazer upload de arquivos enormes para que seu servidor fique ocupado enviando arquivos e comece a lançar erros de *TEMPO LIMITE* para outras solicitações.

Para lidar com essa parte, o AdonisJs permite que você defina o *tamanho máximo de upload* a ser processado pelo servidor, o que significa que qualquer arquivo maior que o tamanho especificado será negado sem processamento e mantém seu servidor em um estado saudável.

#### Lista de verificação
* Certifique-se de definir `maxSize` dentro do arquivo `config/bodyParser.js`.
```js
  uploads: {
    maxSize: '2mb'
  }
  ```
* Nunca armazene arquivos enviados dentro do diretório `public`, pois os arquivos no diretório `public` podem ser acessados ​​diretamente.
* Sempre renomeie os arquivos antes de enviar.
* Nunca compartilhe a localização real do arquivo com os usuários finais. Em vez disso, tente salvar a referência do arquivo dentro do banco de dados com um *id exclusivo* e configure uma rota para o servidor do arquivo usando o `id`.
  ```js
  // Examplo

  const Helpers = use('Helpers')

  Route.get('/download/:fileId', function * (request, response) {
    const fileId = request.param('fileId')
    const file = yield Files.findorFail(fileId)
    response.download(Helpers.storagePath('uploads/${file.path}'))
  })
  ```
