# Tratamento de erros e exceções

O AdonisJs dá um passo a mais em direção ao tratamento e lançamento de exceções, garantindo que as exceções lançadas pelo núcleo do framework sejam mais descritivas e úteis para depuração. Além disso, ele oferece ferramentas e práticas adicionais para estruturar mensagens de exceção bem projetadas.

## Por que as exceções são importantes?
As exceções não recebem o cuidado que merecem. A maioria dos programadores pensa em exceções como uma forma de encerrar o processo quando algo ruim acontece. Pior ainda, as mensagens de exceção não compartilham muito contexto sobre como corrigir o problema e deixam para o usuário final descobrir a causa.

Com o AdonisJs, marcamos todas as exceções com um *código de erro* exclusivo e você pode consultar a documentação do código de erro fornecido para entender a causa da exceção.

Além disso, também oferecemos um bom pacote npm chamado [node-exceptions](https://npmjs.org/package/node-exceptions) para configurar classes de exceção específicas do aplicativo para lançar exceções pessoais e significativas.

## Códigos de erro
Abaixo está a lista de códigos de erro lançados pelo núcleo do AdonisJs. Você pode referenciá-los para entender o contexto da exceção.

Todas as exceções são divididas em várias categorias, como *Geral*, *Banco de dados*, *Redis*, etc.

### Geral
Exceções gerais são levantadas de qualquer parte do framework.

| Código de erro      | Descrição    |
|---------------------|----------------|
| E_MISSING_APPKEY    | A chave do aplicativo é usada para criptografar cookies ou qualquer outro valor sensível. Essa exceção é gerada quando `appKey` não é definido dentro do arquivo `config/app.js` que se refere a um valor dentro do arquivo `.env`. Você pode usar um comando ace para gerar a chave do aplicativo para você. `./ace key:generate`. |
| E_MALFORMED_JSON    | Essa exceção é gerada quando uma função espera que o parâmetro seja uma string `JSON` válida, mas não consegue chamar o método `JSON.parse` nela. |
| E_MISSING_PARAMETER | A exceção mais frequentemente gerada é quando um parâmetro esperado por um método não está sendo passado ou é `indefinido`. |
| E_INVALID_PARAMETER | Esta exceção é gerada quando o valor do parâmetro não é do tipo correto. Por exemplo, um método espera que `age` seja *Number*, mas em vez disso, uma *String* é passada. |
| E_MISSING_CONFIG    | Quando a configuração para uma determinada chave está faltando. A exceção é levantada por *Provedores de serviço* quando eles estão tentando acessar a configuração e não conseguem encontrá-la dentro do diretório `config`. |
| E_UNDEFINED_METHOD  | Essa exceção é gerada quando um cliente tenta acessar um método inexistente. |

### Provedor de criptografia
Abaixo está a lista de exceções levantadas apenas pelo [Provedor de criptografia](/docs/09-security/04-encryption-and-hashing.md).

| Código de erro                | Descrição |
|-------------------------------|-------------|
| E_INVALID_ENCRPYTION_CIPHER   | Esta exceção é gerada quando uma cifra não suportada é usada para criptografar/descriptografar um valor.  |
| E_INVALID_ENCRYPTION_PAYLOAD  | Esta exceção é gerada quando a carga útil passada para o método `encrypt` não é legível.                  |
| E_INVALID_ENCRYPTION_MAC      | Esta exceção é gerada quando um mac de criptografia não suportado é definido para criptografar/descriptografar um valor.  |

### Construtor de formulários e provedor de rotas
Abaixo está a lista de todas as exceções levantadas apenas pelo [Form Builder](/docs/04-views/03-form-builder.md) ou pelo [Route provider](/docs/03-getting-started/05-routing.md).

| Código de erro          | Descrição     |
|-------------------------|---------------|
| E_MISSING_ROUTE         | Essa exceção é levantada quando você está tentando referenciar uma *Route* não existente dentro de suas views. O lugar mais comum é dentro do builder.  |
| E_MISSING_ROUTE_ACTION  | Uma exceção é gerada pelo [Construtor de formulários](/docs/04-views/03-form-builder.md) quando uma ação de controlador/rota não registrada é passada para o método `open`. |

### Provedor de eventos

| Código de erro            | Descrição   |
|---------------------------|-------------|
| E_MISSING_NAMED_EVENT     | O provedor link:events[Event] gerará essa exceção quando você tentar remover um ouvinte nomeado não registrado. |

### Provedor de Sessão

| Código de erro            | Descrição  |
|---------------------------|--------------|
| E_INVALID_SESSION_DRIVER  | Uma exceção é gerada quando o driver de sessão definido dentro do arquivo `config/session.js` não existe. |

### Provedor de Middleware

| Código de erro              | Descrição |
|-----------------------------|-------------|
| E_MISSING_NAMED_MIDDLEWARE  | Essa exceção é gerada quando um middleware nomeado não registrado é referenciado nas rotas. |

### Provedor de banco de dados

| Código de erro                | Descrição |
|-------------------------------|-------------|
| E_MISSING_MODEL_FACTORY       | Essa exceção é gerada quando você tenta acessar uma fábrica de modelos não registrada. Certifique-se de definir fábricas/blueprints de modelos dentro do arquivo `database/factory.js`. |
| E_MISSING_DATABASE_FACTORY    | Essa exceção é gerada quando você tenta acessar uma fábrica de banco de dados não registrada. Certifique-se de definir fábricas/blueprints de modelo dentro do arquivo `database/factory.js`. |
| E_MISSING_DATABASE_ROW        | Essa exceção é gerada por métodos do modelo Lucid como *findOrFail* e *findByOrFail* quando não é possível encontrar um registro com o valor fornecido. |
| E_INVALID_MODEL_STATE         | Essa exceção é gerada quando você tenta salvar um modelo vazio ou atualizar uma instância de modelo de exclusão. |
| E_UNSAVED_MODEL_INSTANCE      | Essa exceção é gerada quando você tenta salvar um relacionamento em um modelo que não foi salvo. |
| E_INVALID_RELATION_INSTANCE   | This exception is raised when you pass an invalid model instance to the relationship `save` method. |
| E_INVALID_RELATION_METHOD     | Essa exceção é gerada quando você chama um método *undefined* em uma instância de relacionamento. Por exemplo, o relacionamento *HasOne* não tem um método `paginate`. |
| E_MISSING_DATABASE_RELATION   | Essa exceção é gerada quando você tenta acessar um relacionamento que nunca foi definido. |
| E_LOCK_ON_MIGRATIONS          | Essa exceção é gerada quando você tenta executar migrações paralelamente mais de uma vez. |
| E_INVALID_SCHEMA_FILE         | Esta exceção é gerada quando os arquivos *schema* dentro da pasta `database/migrations` não estão exportando uma classe *ES2015*. |
| E_UNSAFE_ENVIRONMENT          | Essa exceção é gerada quando você está tentando executar operações inseguras no ambiente de produção. Por exemplo: Executando migrações em produção. |
| E_INVALID_MODEL_TRAIT         | Essa exceção é gerada quando uma característica do modelo não possui um método `register`. |

### Provedor de e-mail

| Código de erro            | Descrição |
|-----------------------|-------------|
| E_INVALID_MAIL_DRIVER | Esta exceção é gerada quando você tenta acessar um driver de e-mail não registrado. |
| E_INVALID_MAIL_VIEW   | Esta exceção é gerada quando você tenta chamar o método `Mail.send` sem uma view válida. |

### Contêiner IoC

| Código de erro        | Descrição |
|-----------------------|-------------|
| E_INVALID_IOC_MANAGER | Essa exceção é gerada quando você tenta registrar um gerente no contêiner IoC sem o método `extend`. |
| E_INVALID_MAKE_STRING | Esta exceção é gerada quando uma string passada para `Ioc.makeFunc` está incorreta. Strings precisam ter nomes de classe e função separados por *ponto(.)*. Por exemplo: `Ioc.makeFunc('UserController.store')` |

### Provedor Antl

| Código de erro        | Descrição |
|-----------------------|-------------|
| E_INVALID_ANTL_DRIVER | Uma exceção é gerada quando o driver antl definido dentro do arquivo `config/antl.js` não existe. |


### Provedor Ally (Autenticação Social)

| Código de erro          | Descrição |
|-------------------------|-------------|
| E_OAUTH_TOKEN_EXCHANGE  | Esta exceção é gerada quando não é possível trocar o token de acesso usando o código oauth. Isso geralmente acontece dentro do retorno de chamada ao usar o método [getUser](/docs/07-common-web-tools/14-social-auth.md). |
| E_INVALID_ALLY_DRIVER   | Esta exceção é gerada quando o driver aliado definido dentro do arquivo `config/services.js` não existe. |
| E_MISSING_OAUTH_CONFIG  | Essa exceção é gerada quando a configuração aliada não existe para um determinado driver.                |

## Lançando exceções
É recomendado lançar uma exceção contextual, pois isso torna mais fácil para o usuário final agir sobre elas. O AdonisJs usa [node-exception](https://npmjs.org/package/node-exceptions) um módulo npm para estruturar exceções. Você pode aprender mais sobre ele por meio de sua documentação.

## Capturando exceção
Exceções podem ser capturadas envolvendo seu código dentro de um bloco `try/catch`, ou você pode lidar com elas globalmente ouvindo o evento `error`.

```js
// app/Listeners/Http.js

Http.handleError = function * (error, request, response) {
  if (error.name === 'ModelNotFoundException') { <1>
    yield response.status(404).sendView('404')
    return
  }

  if (error.name === 'PasswordMisMatch') { <2>
    response.status(400).send('Invalid credentials')
    return
  }

  response.status(error.status).send(error.message) <3>
}
```

Com a ajuda de exceções personalizadas, é muito fácil capturá-las com seu *nome* e retornar uma resposta personalizada para cada tipo de exceção.

1. Manipulando a exceção *ModelNotFoundException* lançada pelo método `findOrFail` do modelo Lucid e retornando uma visualização *404*.
2. Manipulação da exceção *PasswordMisMatch* gerada pelo [provedor de autenticação](/docs/07-common-web-tools/02-authentication.md#attemptuid-password) e retorno de status *400*.
3. Manipulação genérica de exceções para todas as outras exceções.
