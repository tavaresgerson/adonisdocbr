# Estrutura de diretórios

A estrutura de diretório pode parecer avassaladora no início, já que há alguns diretórios pré-configurados. Gradualmente você entenderá o benefício de dividir as entidades lógicas em vários diretórios, pois isso mantém seu código fácil de manter e pesquisar.

```bash
├── app
│   ├── Commands
│   ├── Http
│   ├── Listeners
│   ├── Model
├── bootstrap
├── config
├── database
│   ├── migrations
│   └── seeds
├── providers
├── public
├── resources
│   └── views
├── storage
```

## O Diretório App

NOTE: Certifique-se de aprender mais sobre [Injeção de Dependência](), e [Container IoC](/src/docs/02-core-concepts/02-ioc-container.md) para entender o conceito de Autoloading.

A pasta 'app' é o lar do seu código e é carregada automaticamente sob o namespace 'App'. Se você abrir o arquivo 'package.json', encontrará o seguinte trecho de código dentro dele.

```json
{
  "autoload": {
    "App": "./app"
  }
}
```

Você é livre para mudar o namespace de `App` para qualquer coisa que você quiser. Claro, manter o padrão facilita para outros entenderem o fluxo do código.

Além disso, o diretório 'app' possui subdiretórios para diferentes propósitos. Todos os diretórios dentro do diretório 'app' são capitalizados, pois o AdonisJS segue os princípios de Namespacing. Infelizmente, JavaScript ou Node.js não possuem convenções em namespacing, então nós emprestamos padrões/melhores práticas de outras linguagens de programação como PHP.

| Diretório | Propósito |
|-----------|---------|
| Comandos  | Este diretório é dedicado para armazenar comandos do Ace. Idealmente, um único arquivo representa um comando individual. |
| Http      | Como o nome sugere, 'Http' diretório é dedicado a entidades relacionadas a um servidor HTTP, como: *Controladores*, *Middleware*, e *Rotas*. |
| Ouvintes  | O diretório de ouvintes facilita a organização dos seus ouvintes de eventos, já que as funções anônimas em linha não são mantidas nem testáveis. Sinta-se à vontade para criar ouvintes para o *Pub/Sub Redis* dentro deste diretório. |
| Modelo    | O diretório modelo tem seus modelos Lucid. Também há um diretório *Hooks* dentro deste diretório para armazenar ganchos de modelo. |

## O Diretório bootstrap

O diretório 'bootstrap' está lá para juntar os pedaços do seu aplicativo para comandos HTTP e servidores. Existem alguns arquivos que você precisa trabalhar dentro deste diretório.

| Arquivo     | Propósito |
|-------------|---------|
| `app.js`    | Este arquivo é usado para registrar provedores de serviço/comandos e configurar aliases para namespaces comumente usados. |
| `events.js` | Você pode usar este arquivo para registrar ouvintes para eventos específicos. Como o diretório "Ouvintes", você também pode usar este arquivo para registrar ouvintes para *Pub/Sub Redis*. |
| `extend.js` | Este arquivo é usado para estender o provedor de serviços central/terceiros. |

::: tip DICA
Para manter futuras atualizações fáceis e simples, é recomendado que você não modifique o arquivo `bootstrap/http.js` e `bootstrap/kernel.js`.
:::

## O Diretório config
O diretório `config` é usado para definir a configuração para seu aplicativo. O próprio AdonisJs vem com um monte de arquivos de configuração, mas você também é livre para criar seus arquivos de configuração.

Em ordem, você lê as definições de configuração de qualquer arquivo que você deve usar do provedor `Config` e não requer arquivos manualmente em seu código.

Errado:
```js
const app = require('./config/app.js')
console.log(app.appKey)
```

Certo:

```js
const Config = use('Config')
console.log(Config.get('app.appKey'))
```

## O Diretório database
Todos os arquivos relacionados ao banco de dados são armazenados dentro do diretório "banco de dados". Como o SQLite é um banco de dados baseado em arquivo, o arquivo SQLite também será armazenado neste diretório.


| Diretório/Arquivo | Propósito |
|-------------------|-----------|
| migrations        | Este diretório tem todas as migrações que você criou usando o comando "make:migration". Saiba mais sobre migrações [aqui](/docs/05-database/03-migrations). |
| seeds             | As sementes são usadas para preencher um banco de dados com dados falsos. Eles são úteis no estabelecimento do estado inicial de sua aplicação. |
| factory.js        | Fábricas são usadas para gerar dados falsos para modelos de Lucid ou tabelas de banco de dados. Você vai acabar usando fábricas muito quando estiver escrevendo testes. 'factory.js' é o lugar onde você define os planos-padronizados para os dados falsos. |

## O Diretório providers
Se você algum dia sentir vontade de escrever seus próprios provedores, este é o lugar para mantê-los. É aconselhável publicar provedores reutilizáveis no npm.

Idealmente, não existem regras rígidas para a criação de provedores, apenas certifique-se de ler a documentação do link: provedores de serviço [provedores de serviço] para entender como construir seus provedores. Os provedores dentro do diretório `provedores` são registrados definindo um caminho absoluto no arquivo `app.js`.

```js
// .bootstrap/app.js

const path = require('path')

const providers = [
  path.join(__dirname, '../providers/MyAwesomeProvider')
]
```

## O Diretório public
Como o nome sugere, o diretório "public" é usado para servir ativos estáticos via HTTP. O caminho "/public" não é necessário ao referenciar arquivos deste diretório. Por exemplo:

```html
<!-- .public/style.css -->

<link rel="stylesheet" href="/style.css" />
```

## O Diretório resources
A pasta "recursos" é usada para armazenar arquivos de apresentação para o seu aplicativo. As "vistas" do Nunjucks também são armazenadas nesta pasta, e você pode criar subpastas adicionais para armazenar *Sass*/*Less* ou quaisquer outros arquivos relacionados à construção da interface.


| Diretório | Propósito |
|-----------|-----------|
| views     | As visualizações do Nunjucks são armazenadas dentro desta pasta. Sinta-se à vontade para criar diretórios adicionais dentro de "visualizações" para criar *parciais* ou *layout*. |

## O Diretório `storage`
Os logs e sessões da aplicação são armazenados dentro do diretório "storage". Pense nisso como um armazenamento temporário para a sua aplicação. Além disso, este diretório é adicionado ao arquivo ".gitignore", de modo que os logs/sessões relacionados à desenvolvimento não sejam cometidos no controle de versão fornecido por provedores como GitHub ou Bitbucket.
