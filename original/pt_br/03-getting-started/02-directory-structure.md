# Estrutura de diretório

A estrutura de diretório pode parecer opressiva no começo, já que há um punhado de diretórios pré-configurados. Gradualmente, você entenderá o benefício de dividir as entidades lógicas em vários diretórios, já que isso mantém seu código sustentável e fácil de pesquisar.

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

## O diretório (app)

> OBSERVAÇÃO: certifique-se de aprender mais sobre link:dependency-injection[Dependency injection] e link:ioc-container[Ioc Container] para entender o conceito de Autoloading.

O diretório `app` é o lar do seu código e é carregado automaticamente sob o namespace `App`. Se você abrir o arquivo `package.json`, encontrará o seguinte trecho de código dentro dele.

```json
{
  "autoload": {
    "App": "./app"
  }
}
```

Você é livre para alterar o namespace de `App` para o que quiser. Claro, manter o padrão torna mais fácil para outros entenderem o fluxo do código.

Além disso, o diretório `app` tem diretórios aninhados para diferentes propósitos. Todos os diretórios dentro do diretório `app` são capitalizados, já que o AdonisJs segue os princípios de Namespacing. Infelizmente, Javascript ou Node.js não têm convenções sobre namespacing, então pegamos emprestado os padrões/melhores práticas de outras linguagens de programação como Php.

| Directory | Purpose |
|-----------|---------|
| Commands  | Este diretório é dedicado para armazenar comandos Ace. Idealmente, um único arquivo representa um comando individual. |
| Http      | Como o nome indica, o diretório `Http` é dedicado a entidades relacionadas a um servidor HTTP, como: *Controladores*, *Middleware* e *Rotas*. |
| Listeners | O diretório Listeners facilita a organização dos seus ouvintes de eventos, já que os closures inline em eventos não são sustentáveis ​​e nem testáveis. Sinta-se à vontade para criar ouvintes para *Redis Pub/Sub* dentro deste diretório. |
| Model     | O diretório Model tem seus modelos Lucid. Além disso, há um diretório *Hooks* dentro deste diretório para armazenar ganchos Model. |

## O diretório (bootstrap)

O diretório `bootstrap` está lá para unir as partes do seu aplicativo para o servidor HTTP e comandos ace. Existem alguns arquivos com os quais você precisa trabalhar dentro deste diretório.

| Arquivo   | Objetivo |
|-----------|---------|
| app.js    | Este arquivo é usado para registrar provedores de serviço/comandos e configurar aliases para namespaces usados ​​com frequência. |
| events.js | Você pode usar este arquivo para registrar ouvintes para eventos específicos. Assim como o diretório `Listeners`, você também pode usar este arquivo para registrar ouvintes para *Redis Pub/Sub*. |
| extend.js | Este arquivo é usado para estender os provedores de serviço de núcleo/terceiros. |

> DICA: Para manter as atualizações futuras fáceis e simples, é recomendável que você não modifique os arquivos `bootstrap/http.js` e `bootstrap/kernel.js`.

## O diretório (config)
O diretório `config` é usado para definir a configuração para seu aplicativo. O próprio AdonisJs vem com um monte de arquivos de configuração, mas você também é livre para criar seus arquivos de configuração.

Em ordem, você lê as definições de configuração de qualquer arquivo que você deve fazer uso do provedor `Config` e não requer arquivos manualmente em seu código.

```js
// Wrong

const app = require('./config/app.js')
console.log(app.appKey)
```

```js
// Right

const Config = use('Config')
console.log(Config.get('app.appKey'))
```

## O diretório (banco de dados)
Todos os arquivos relacionados ao banco de dados são armazenados dentro do diretório `database`. Como o `SQLite` é um banco de dados baseado em arquivo, o arquivo SQLite será armazenado neste diretório também.

| Diretório/Arquivo | Objetivo |
|-------------------|----------|
| migrations        | Este diretório tem todas as migrações que você criou usando o comando `make:migration`. Saiba mais sobre migrações [aqui](/migrations). |
| seeds             | Sementes são usadas para preencher previamente o banco de dados com dados fictícios. Elas são úteis para configurar um estado inicial do seu aplicativo. |
| factory.js        | As fábricas são usadas para gerar dados falsos para modelos Lucid ou tabelas de banco de dados. Você vai se pegar usando muito fábricas ao escrever testes. `factory.js` é o lugar onde você define blueprints para os dados fictícios. |

## O diretório (provedores)
Se você sentir necessidade de escrever seus provedores, este é o lugar para mantê-los. É aconselhável publicar provedores reutilizáveis ​​no *npm*.

O ideal é que não haja regras rígidas para criar provedores, apenas certifique-se de ler a documentação link:service-providers[provedores de serviços] para entender como criar seus provedores. Os provedores de serviços dentro do diretório `providers` são registrados definindo um caminho absoluto dentro do arquivo `app.js`.

```js
// bootstrap/app.js

const path = require('path')

const providers = [
  path.join(__dirname, '../providers/MyAwesomeProvider')
]
```

## O diretório (público)
Como o nome sugere, o diretório `public` é usado para servir ativos estáticos por HTTP. O caminho `/public` não é necessário ao referenciar arquivos deste diretório. Por exemplo:

```html
<!-- public/style.css -->

<link rel="stylesheet" href="/style.css" />
```

## O diretório (recursos)
O diretório `recursos` está lá para armazenar arquivos de apresentação para seu aplicativo. As `views` do Nunjucks também são armazenadas neste diretório, e você tem a liberdade de criar diretórios adicionais para armazenar *Sass*/*Less* ou quaisquer arquivos relacionados à construção do frontend.

| Diretório | Objetivo |
|-----------|---------|
| views     | As views do Nunjucks são armazenadas dentro deste diretório. Sinta-se à vontade para criar diretórios adicionais dentro de `views` para criar *partials* ou *layouts*. |

## O diretório (armazenamento)
Os logs e sessões do aplicativo são armazenados dentro do diretório `storage`. Pense nele como um armazenamento temporário para seu aplicativo. Além disso, este diretório é adicionado ao `.gitignore`, para que seus logs/sessões relacionados ao desenvolvimento não sejam comprometidos com provedores de controle de versão como Github ou Bitbucket.
