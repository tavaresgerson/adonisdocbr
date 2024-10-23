# Tratamento de erros e exceções

AdonisJS toma um passo adicional para lidar e lançar exceções, garantindo que as exceções lançadas pelo núcleo do framework sejam mais descritivas e úteis para depuração. Também oferece ferramentas e práticas adicionais para estruturar mensagens de exceção bem projetadas.

## Por que exceções são importantes?
Exceções não recebem a atenção que merecem. A maioria dos programadores pensa em exceções como uma forma de encerrar o processo como algo ruim aconteceu. Mesmo pior, as mensagens de exceção não compartilham muito contexto sobre como corrigir o problema e deixa para o usuário final descobrir a causa.

Com o AdonisJs nós tagamos todas as exceções com um único *código de erro* e você pode se referir à documentação do dado código de erro para entender a causa da exceção.

Além disso, também oferecemos um ótimo pacote npm chamado [node-exceptions](https://npmjs.org/package/node-exceptions) para configurar classes de exceção específicas da aplicação para lançar exceções pessoais e significativas.

## Códigos de Erro
Abaixo está a lista de códigos de erro lançados pelo núcleo do Adonis. Você pode referenciá-los para entender o contexto da exceção.

Todas as exceções são divididas em múltiplas categorias como *Geral*, *Banco de Dados*, *Redis*, etc.

### General
Exceções gerais são levantadas de qualquer parte do framework.

| Código de Erro | Descrição |
|------------|--------------|
| E_MISSING_APPKEY | A chave de aplicativo é usada para criptografar cookies ou qualquer outro valor confidenciais. Esta exceção é lançada quando o 'appKey' não está definido dentro do arquivo 'config/app.js', que se refere a um valor dentro do arquivo '.env'. |

Você pode usar um comando de as para gerar a chave do aplicativo para você. `./ace key:generate`.

| Código de Erro | Descrição |
|------------|--------------|
| Não foi possível traduzir pois a entrada não é um JSON válido | Esta exceção é lançada quando uma função espera que o parâmetro seja uma string JSON válida, mas não consegue chamar o método `JSON.parse` nele. |

| Código de Erro | Descrição |
|------------|--------------|
| E_MISSING_PARAMETER | A exceção mais frequentemente lançada quando um parâmetro esperado por um método não está sendo passado ou é indefinido. |
| E_INVALID_PARAMETER | Esta exceção é lançada quando o valor do parâmetro não está correto. Por exemplo, um método espera que 'idade' seja um *Número*, mas em vez disso um *String* foi passado. |
| E_MISSING_CONFIG | Quando a configuração para uma determinada chave está ausente. A exceção é lançada pelos *provedores de serviço* quando eles estão tentando acessar a configuração e não conseguem encontrá-la dentro do diretório `config`. |
| Não foi possível traduzir porque o texto em inglês não foi fornecido. | Esta exceção é lançada quando um cliente está tentando acessar um método inexistente. |

### Provedor de Criptografia
Abaixo está a lista de exceções levantadas apenas pelo provedor [Provedor de criptografia](/segurança/criptografia-e-hashing).


| Código de Erro | Descrição |
|------------|--------------|
| E_INVALID_ENCRPYTION_CIPHER | Esta exceção é lançada quando um cifrado não suportado é usado para criptografar/descriptografar um valor. |
| E_INVALID_ENCRYPTION_PAYLOAD | Esta exceção é lançada quando a carga passada para o método `encrypt` não é legível. |
| E_INVALID_ENCRYPTION_MAC | Esta exceção é lançada quando uma MAC de criptografia não suportada é definida para criptografar/descriptografar um valor. |

### Formulário & Fornecedor de Rota
Abaixo está a lista de todas as exceções levantadas apenas pelo [Formulário](' / views / form-builder ') ou o provedor de [Rotas](' / getting-started / routing ').

| Código de Erro | Descrição |
|------------|--------------|
| E_MISSING_ROUTE | Esta exceção é lançada quando você está tentando referenciar uma rota inexistente dentro de suas visualizações. O local mais comum é dentro do construtor. |
| E_MISSING_ROUTE_ACTION | A exceção é lançada pelo [formulário de construção](/views/form-builder) quando uma ação de controlador/rota não registrada é passada para o método 'abrir'. |

### Fornecedor de eventos

| Código de Erro | Descrição |
|------------|--------------|
| E_MISSING_Named_Event | O provedor de eventos lançará esta exceção quando você estiver tentando remover um ouvinte não registrado. |

### Provedor de Sessão

| Código de Erro | Descrição |
|------------|--------------|
| E_INVALID_SESSION_DRIVER | Exceção é lançada quando o driver de sessão definido dentro do arquivo `config/session.js` não existe. |

### Middleware Provider

| Código de Erro | Descrição |
|------------|--------------|
| E_MISSING_NamedMiddleware | Esta exceção é lançada quando um middleware nomeado não registrado é referenciado nas rotas. |

### Provedor de banco de dados

| Código de Erro | Descrição |
|------------|--------------|
| Não foi possível traduzir a seguinte parte do texto: E_MISSING_MODEL_FACTORY. | Esta exceção é lançada quando você tenta acessar uma fábrica de modelo não registrada. Certifique-se de definir fábricas de modelos/esboços dentro do arquivo "database/factory.js". |
| E_MISSING_DATABASE_FACTORY | Esta exceção é lançada quando você tenta acessar uma fábrica de banco de dados não registrada. Certifique-se de definir fábricas/planos de modelo dentro do arquivo 'database/factory.js'. |
| E_MISSING_DATABASE_ROW | Esta exceção é lançada pelos métodos do modelo Lucid, como *findOrFail* e *findByOrFail*, quando não conseguir encontrar um registro com o valor dado. |
| E_INVALID_MODEL_STATE | Esta exceção é lançada quando você está tentando salvar um modelo vazio ou tentar atualizar uma instância de modelo excluído. |
| E_UNSAVED_MODEL_INSTANCE | Esta exceção é lançada quando você está tentando salvar uma relação em um modelo que ainda não foi salvo. |
| E_INVALID_RELATION_INSTANCE | Esta exceção é lançada quando você passa uma instância de modelo inválido para o método `save` da relação. |
| E_INVALID_RELATION_METHOD | Esta exceção é lançada quando você chama um método indefinido em uma instância de relacionamento. Por exemplo, o relacionamento "HasOne" não possui um método 'paginate'. |
| E_MISSING_DATABASE_RELATION | Esta exceção é lançada quando você está tentando acessar uma relação que nunca foi definida. |
| E_LOCK_ON_MIGRATIONS | Esta exceção é lançada quando você tenta executar as migrações mais de uma vez em paralelo. |
| E_INVALID_SCHEMA_FILE | Esta exceção é lançada quando os arquivos *schema* dentro da pasta `database/migrations` não estão exportando uma classe ES2015. |
| E_UNSAFE_ENVIRONMENT | Esta exceção é lançada quando você está tentando executar operações inseguras no ambiente de produção. Por exemplo: Executando migrações em produção. |
| E_INVALID_MODEL_TRAIT | Esta exceção é lançada quando um modelo de traço não tem um método 'registro' nele. |

### Provedor de Email

| Código de Erro | Descrição |
|------------|--------------|
| E_INVALID_MAIL_DRIVER | Esta exceção é lançada quando você está tentando acessar um driver de e-mail não registrado. |
| E-INVALID_MAIL_VIEW | Esta exceção é lançada quando você está tentando chamar o método `Mail.send` sem uma visão válida. |

### IoC Container

| Código de Erro | Descrição |
|------------|--------------|
| E_INVALID_IOC_MANAGER | Esta exceção é lançada quando você está tentando registrar um gerenciador no contêiner IoC sem o método 'extend'. |
| E_INVALID_MAKE_STRING | Esta exceção é lançada quando uma string passada para `Ioc.makeFunc` está incorreta. As strings precisam ter nomes de classe e função separados por ponto (`.`). Por exemplo: `Ioc.makeFunc('UserController.store')` |

### Antl Provider

| Código de Erro | Descrição |
|------------|--------------|
| E_INVALID_ANTL_DRIVER | Exceção é lançada quando o driver antl definido no arquivo `config/antl.js` não existe. |

### Ally (Provedor de Autenticação Social)

| Código de Erro | Descrição |
|------------|--------------|
| E_OAUTH_TOKEN_EXCHANGE | Esta exceção é lançada quando não é possível trocar o token de acesso usando o código OAuth. Isso geralmente acontece dentro do retorno de chamada ao usar o método [getUser] / common-web-tools / social-auth. |
| E_INVALID_ALLY_DRIVER | Esta exceção é lançada quando o motorista aliado definido dentro do arquivo "config/services.js" não existe. |
| E_MISSING_OAUTH_CONFIG | Esta exceção é lançada quando não existe configuração de Ally para um determinado driver. |

## Lendo exceções
É recomendado lançar uma exceção contextual, pois isso facilita a ação do usuário final sobre elas. O AdonisJs utiliza o [node-exception](https://npmjs.org/package/node-exceptions), um módulo npm para estruturar exceções. Você pode saber mais sobre isso através da documentação.

## Capturando Exceções
As exceções podem ser capturadas envolvendo seu código dentro de um bloco try/catch ou você pode tratá-las globalmente escutando o evento "erro".

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

Com a ajuda de exceções personalizadas, é tão fácil pegá-las com seu *nome* e retornar uma resposta personalizada para cada tipo de exceção.

1. Lidando com a exceção *ModelNotFoundException* lançada pelo método `findOrFail` do modelo Lucid e retornando uma visão de *404*.
2. Lidando com a exceção *PasswordMisMatch* lançada pelo provedor de autenticação e retornando um status *400*.
3. Tratamento genérico de exceções para todas as outras exceções.
