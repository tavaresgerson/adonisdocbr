# Introdução

Manter aplicativos web seguros é uma das coisas mais importantes. O AdonisJS vem com camadas de segurança e sanitização de dados para manter seus aplicativos web longe dos ataques comuns.

> NOTE
> Se você encontrar algum bug de segurança, certifique-se de compartilhá-lo em virk@adonisjs.com. Por favor, não crie um problema no GitHub, pois isso pode afetar os aplicativos em execução na produção. Nós revelaremos o problema após enviar a correção para o bug.

## Injeção de SQL
A injeção de SQL é um dos ataques mais comuns na web, onde o usuário final fará uso das entradas e passará a consulta SQL em vez do *nome de usuário*, *e-mail*, etc.

Lucid modelos e construtor de consulta de banco de dados garantirão que você execute consultas preparadas, o que por sua vez o protege contra injeção SQL. Embora seu aplicativo possa ter a necessidade de executar "SQL" cru, em vez de usar o método do construtor de consultas, é recomendado aproveitar o método "raw" e passar os vinculações como parâmetros.

```js
// Not Recommended

const username = request.param('username')
const users = yield Database
  .table('users')
  .where(Database.raw(`username = ${username}`))
```

```js
// Correct Way

const username = request.param('username')
const users = yield Database
  .table('users')
  .where(Database.raw('username = ?', [username]))
```

#### Lista de verificação

[provedor de banco de dados](/database/query-builder) ou
[sanitizer]( /common-web-tools/validator ) para manter seu banco de dados seguro.
* Sempre execute *consultas preparadas* passando os valores da consulta como um array para o método `raw`.


## Segurança de Sessão
As sessões podem vazar informações importantes se não forem tratadas com cuidado. O AdonisJS irá criptografar e assinar todos os cookies usando a `CHAVE_APP` definida no arquivo `.env`. Tenha certeza de manter a `CHAVE_APP` secreta e nunca compartilhe com ninguém e nunca envie para sistemas de controle de versão como o Github.

### Configuração da Sessão
A configuração da sessão é salva dentro do arquivo `config/session.js`, você pode configurar opções de acordo com suas necessidades e certifique-se de dar atenção para os seguintes pares chave/valor.

#### Configurações Importantes

* Certifique-se de que o `httpOnly` esteja definido como *true*. Manter isso como *false* tornará acessível através do JavaScript usando `document.cookie`.
* A propriedade 'sameSite' garante que seu cookie de sessão não seja visível ou acessível em diferentes domínios.

## Formulários & Visualizações
Para manter o ciclo de desenvolvimento simples e produtivo, o AdonisJS vem com alguns recursos que você pode querer considerar antes de lançar seu site para o público.

### Form Method Spoofing
As formas HTML são capazes apenas de fazer solicitações GET e POST, o que significa que você não pode usar todos os verbos HTTP para realizar operações RESTful. Para facilitar isso AdonisJs permite definir o método HTTP como uma string de consulta dentro da URL, o que é conhecido como *spoofing do método de formulário*.

```js
// Route

Route.put('/users/:id', 'UserController.update')
```

```html
<!-- View -->

<form action="/users/1?_method=PUT" method="POST">
</form>
```

Definir `_method=PUT` irá converter o método HTTP para PUT em vez de POST. Isso torna mais fácil usar qualquer verbo HTTP simplesmente falsificando-o. Aqui estão algumas coisas que você deve estar ciente.

#### Lista de verificação

AdonisJS irá apenas falsificar métodos quando o método HTTP real for POST, ou seja, fazer uma requisição GET com * _method* não terá efeito algum.
* Você pode desativar o spoofing de formulário definindo `allowMethodSpoofing=false` dentro de `config/app.js`.

```js
http: {
  allowMethodSpoofing: false
}
```

### Injetando Injeção de Dependência em Vistas
AdonisJS torna simples para você usar as injeções de dependências dentro de suas visualizações, o que significa que você pode acessar os modelos Lucid a partir de suas visualizações para buscar dados do banco de dados. Saiba mais sobre [injetando provedores](/visualizações/visualizações)

Esta funcionalidade pode abrir alguns buracos de segurança sérios se suas visualizações forem editáveis pelo mundo exterior. Por exemplo, você está criando um CMS usando AdonisJS e deseja que seus usuários criem partes parciais reutilizáveis de visualização. O usuário final pode buscar o *Modelo de Usuário* dentro sua parcial e pode excluir todos os usuários.

#### Lista de verificação

* Tenha certeza de definir `injectServices=false` dentro do arquivo `config/app.js`.

```js
views: {
  injectServices: false
}
```

* Se estiver usando injeção de serviço, certifique-se de que suas visualizações não sejam editáveis pelo mundo exterior.

## Upload de arquivos
Os atacantes geralmente tentam fazer o upload de arquivos maliciosos para o servidor e depois executar esses arquivos carregados para obter acesso ao servidor ou realizar alguma ação destrutiva.

Não são apenas arquivos que são carregados para obter acesso ao servidor, muitas vezes você encontrará pessoas tentando carregar arquivos enormes para deixar seu servidor ocupado em fazer o upload de arquivos e começar a lançar erros de *TIMEOUT* para outras solicitações.

Para lidar com esse pedaço, o AdonisJS permite que você defina o *tamanho máximo de upload* para ser processado pelo servidor, o que significa que qualquer arquivo maior do que o tamanho especificado será negado sem processamento e mantém seu servidor em um estado saudável.

#### Lista de verificação

* Tenha certeza de definir o `maxSize` dentro do arquivo `config/bodyParser.js`.

```js
uploads: {
  maxSize: '2mb'
}
```

* Nunca armazene arquivos carregados dentro do diretório "public", já que os arquivos no diretório "public" podem ser acessados diretamente.
* Renomeie sempre os arquivos antes de carregá-los.
* Nunca compartilhe o local real do arquivo com os usuários finais. Em vez disso, tente salvar a referência do arquivo dentro do banco de dados com um *ID exclusivo* e configure uma rota para servir o arquivo usando o `ID`.
+

Example:

```js
const Helpers = use('Helpers')

Route.get('/download/:fileId', function * (request, response) {
  const fileId = request.param('fileId')
  const file = yield Files.findorFail(fileId)
  response.download(Helpers.storagePath('uploads/${file.path}'))
})
```
