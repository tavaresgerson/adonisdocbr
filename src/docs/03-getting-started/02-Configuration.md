---
title: Configuration
category: getting-started
---

# Configuração

## Provedor de configuração

O primeiro passo para ter uma base de código sustentável é encontrar um local dedicado para armazenar a configuração do aplicativo.

O AdonisJs usa o diretório `config`, onde todos os arquivos são carregados no momento da inicialização.

Você pode acessar os valores de configuração por meio do **Provedor de configuração**:

```js
const Config = use('Config')
const appSecret = Config.get('app.appSecret')
```

Os valores de configuração são obtidos usando `Config.get`, que aceita um argumento de string referenciando a chave que você deseja no formato `fileName.key`.

Você pode buscar valores de configuração aninhados usando a notação de ponto:

```js
// Exemplo de um arquivo de configuração, por exemplo, database.js
{
  mysql: {
    host: '127.0.0.1',
  },
}

// Você pode recuperá-lo assim...
Config.get('database.mysql.host')
```

Se não tiver certeza de que uma chave está definida em sua configuração, você pode fornecer um segundo argumento que será retornado como o valor padrão:

```js
Config.get('database.mysql.host', '127.0.0.1')
```

Se quiser alterar os valores de configuração na memória, use `Config.set`:

```js
Config.set('database.mysql.host', 'db.example.com')
```

::: warning NOTA
`Config.set` alterará apenas o valor **na memória**. Ele não gravará o novo valor em seu arquivo de configuração.
:::

## Provedor de ambiente

Ao criar um aplicativo, você pode querer uma configuração diferente com base no ambiente em que seu código está sendo executado.

Para atender a esse requisito, o AdonisJs usa a biblioteca [dotenv](https://github.com/motdotla/dotenv).

Dentro da raiz de cada novo projeto AdonisJs, você encontrará um arquivo `.env.example`.
Se você usou o AdonisJs CLI para instalar seu aplicativo, este arquivo será automaticamente duplicado como `.env`. Caso contrário, você deve copiá-lo manualmente.

::: danger AVISO
O arquivo `.env` nunca deve ser confirmado no seu controle de origem ou compartilhado com outras pessoas.
:::

O arquivo `.env` tem uma sintaxe simples `key=value`:

```bash
# .env

APP_SECRET=F7op5n9vx1nAkno0DsNgZm5vjNXpOLIq
DB_HOST=127.0.0.1
DB_USER=root
```

Você pode acessar valores env usando o **Env Provider**:

```js
const Env = use('Env')
const appSecret = Env.get('APP_SECRET')
```

Assim como o **Config Provider**, você pode fornecer um valor padrão como o segundo argumento:

```js
Env.get('DB_USER', 'root')
```

`Env.get` sempre retorna uma `string`. Se você quiser que um valor `Env` atue como booleano, precisará verificá-lo por meio de uma declaração de igualdade condicional, como esta:

```js
const myBoolean = Env.get('MY_BOOLEAN') === 'true'
```

### Gerando erros se uma variável de ambiente necessária não existir

Quando você tem uma variável de ambiente necessária para executar seu aplicativo, pode usar `Env.getOrFail()` para gerar um erro se a variável necessária não estiver definida.

::: tip DICA
Se você quiser que seu aplicativo falhe rapidamente no momento da inicialização quando uma variável de ambiente estiver ausente, **limite o acesso a variáveis ​​de ambiente somente de dentro de seus arquivos de configuração** e não use o Provedor Env em nenhum outro lugar do aplicativo.
:::

```js
const Env = use('Env')
// Lançará "Make sure to define APP_SECRET inside .env file."
Env.getOrFail('APP_SECRET')
```

### Localização do arquivo .env

Você pode querer carregar um arquivo `.env` diferente.

Isso pode ser feito usando a variável de ambiente `ENV_PATH`:

```bash
ENV_PATH=/user/.env adonis serve
```

### Desabilitando o arquivo .env

Você pode querer usar diretamente as variáveis ​​de ambiente no seu servidor em vez de retransmitir para um arquivo.

Isso pode ser feito usando a variável de ambiente `ENV_SILENT`:

```bash
ENV_SILENT=true adonis serve
```

### Ambiente de teste

Se você estiver iniciando seu aplicativo com `NODE_ENV` definido como `testing`, o AdonisJs carregará seu arquivo `.env.testing` e mesclará seus valores sobre seu arquivo `.env`.

Isso é útil para definir credenciais diferentes ao testar sua base de código.
