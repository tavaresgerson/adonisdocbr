# Heroku

Este guia abrange as etapas de ação para implantar um aplicativo AdonisJS no [Heroku](https://devcenter.heroku.com/articles/deploying-nodejs).

Implantar um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você só precisa manter algumas coisas em mente:

- Você constrói sua fonte TypeScript para JavaScript, antes de implantar o aplicativo.
- Você terá que iniciar o servidor a partir da pasta `build` e não da raiz do projeto. O mesmo vale para executar migrações em quaisquer outros aplicativos Node.js.

Você pode construir seu projeto para produção executando o seguinte comando ace. Saiba mais sobre o [processo de construção do TypeScript](/docs/guides/fundamentals/typescript-build-process.md)

```sh
node ace build --production

# OU use o script npm
npm run build
```

## Adicionando o Procfile
Antes de enviar seu código para o Heroku para implantação, certifique-se de criar um [Procfile](https://devcenter.heroku.com/articles/procfile#deploying-to-heroku) na raiz do seu aplicativo.

O arquivo instrui o Heroku a sempre executar as migrações durante o lançamento e iniciar o servidor a partir da pasta `build`.

```text
web: node build/server.js
release: node build/ace migration:run --force
```

## Definindo variáveis ​​de ambiente
Você também deve definir as variáveis ​​de ambiente no painel do Heroku. Você pode consultar o `.env` de desenvolvimento para as variáveis ​​que você precisa definir com o Heroku.

- Não defina a variável de ambiente `PORT`. O Heroku a definirá para você automaticamente.
- Certifique-se de gerar a chave do aplicativo executando o comando `node ace generate:key` e defina-a como variável de ambiente `APP_KEY`.
- Salve a `APP_KEY` com segurança. Se você perder essa chave, todos os dados de criptografia, cookies e sessões se tornarão inválidos.

![imagem](https://res.cloudinary.com/adonis-js/image/upload/f_auto,q_auto/v1619085409/v5/heroku-env-vars.jpg)

## Hora de implantar
Agora você pode enviar seu código para o Heroku executando o comando `git push heroku master`. O Heroku executará as seguintes etapas para você.

- Ele detectará seu aplicativo como um aplicativo Node.js e usará o buildpack `heroku/nodejs` para construí-lo e implantá-lo.
- Ele detectará o script `build` dentro do arquivo `package.json` e construirá seu código TypeScript para JavaScript. **Você deve sempre executar o código JavaScript em produção**.
[prune](https://docs.npmjs.com/cli/v7/commands/npm-prune) as dependências de desenvolvimento.
- Executa o script `release` definido dentro do `Procfile`.
- Executa o script `web` definido dentro do `Procfile`.

## Usando banco de dados
Você pode usar os complementos do Heroku para adicionar um banco de dados ao seu aplicativo. Apenas certifique-se de definir as variáveis ​​de ambiente necessárias para o AdonisJS se conectar ao seu banco de dados.

Novamente, você pode consultar o `.env` de desenvolvimento para visualizar o nome das variáveis ​​de ambiente que você está usando para conexão com o banco de dados.

::: info NOTA
Se você estiver usando PostgreSQL e recebendo o erro `pg_hba.conf`. Em seguida, certifique-se de habilitar os certificados SSL para seu aplicativo. Se você não puder habilitar o SSL, deverá atualizar a conexão com o banco de dados para permitir conexões não SSL.

```ts
// config/database.js

pg: {
  client: 'pg',
  connection: {
    // ....
    ssl: {
      rejectUnauthorized: false
    }
  }
}
```
:::

## Gerenciando arquivos enviados pelo usuário
O Heroku não tem [armazenamento persistente](https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted), e você não pode salvar os arquivos enviados pelo usuário no sistema de arquivos do servidor. Isso deixa você com apenas uma opção de salvar os arquivos enviados em um serviço externo como o S3.

Atualmente, estamos trabalhando em um módulo que permite que você use o sistema de arquivos local durante o desenvolvimento e depois mude para um sistema de arquivos externo como o S3 para produção. Faça tudo isso sem alterar uma única linha de código.
