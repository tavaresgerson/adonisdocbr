# Aplicativos digitais do oceano

Este guia abrange as etapas de ação para implantar um aplicativo AdonisJS na [plataforma de aplicativos digitais do oceano](https://docs.digitalocean.com/products/app-platform/).

Implantar um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você só precisa manter algumas coisas em mente:

- Você constrói sua fonte TypeScript para JavaScript, antes de implantar o aplicativo.
- Você terá que iniciar o servidor a partir da pasta `build` e não da raiz do projeto. O mesmo vale para executar migrações em qualquer outro aplicativo Node.js.

Você pode construir seu projeto para produção executando o seguinte comando ace. Saiba mais sobre o [processo de construção TypeScript](/docs/guides/fundamentals/typescript-build-process.md)

```sh
node ace build --production

# OU use o script npm
npm run build
```

## Configurando o aplicativo DO

No momento da implantação do seu aplicativo na plataforma de aplicativos DO, você será solicitado a fornecer o ambiente. Você pode consultar o arquivo de desenvolvimento `.env` para as variáveis ​​que você deve definir.

- Defina a variável de ambiente `PORT` da mesma forma que a **porta HTTP** que você selecionou nas configurações.
- Certifique-se de gerar a chave do aplicativo executando o comando `node ace generate:key` na sua máquina local e defina-a como variável de ambiente `APP_KEY`.
- Salve a `APP_KEY` com segurança. Se você perder essa chave, todos os dados de criptografia, cookies e sessões se tornarão inválidos.
- Certifique-se de alterar o **comando run** para iniciar o servidor a partir da pasta de compilação. `node build/server.js`.

![image](/docs/assets/do-start-screen.webp)

## Usando banco de dados
Você também pode adicionar o banco de dados como um componente ao seu aplicativo e, em seguida, atualizar as variáveis ​​de ambiente com as credenciais do banco de dados.

Achamos as variáveis ​​de ambiente do banco de dados Digital Ocean muito genéricas e recomendamos remapeá-las da seguinte forma:

#### Variáveis ​​de ambiente injetadas Digital Ocean
```dotenv
HOSTNAME=
PORT=
USERNAME=
PASSWORD=
DATABASE=
```

#### Remapeando-as para serem específicas
Você deve remapear as variáveis ​​de ambiente para serem mais específicas. Por exemplo

![image](/docs/assets/do-remmaped-env-vars.webp)

### Executando migrações
Depois de adicionar o banco de dados, você terá que adicionar um novo componente de **"Tipo de trabalho"** e certificar-se de selecionar **"Antes de cada implantação"** como seu ciclo de vida.

O Digital Ocean fará você repetir o mesmo processo de adicionar um novo componente, selecionar novamente o repositório e redefinir as variáveis ​​de ambiente. No entanto, desta vez estamos adicionando um trabalho e não um serviço da web.

Além disso, certifique-se de atualizar o **Comando de execução** para `node build/ace make:migration --force`.

![image](/docs/assets/do-job-component.webp)

## Gerenciando arquivos enviados pelo usuário
Os aplicativos Digital Ocean não têm armazenamento persistente e, portanto, você não pode salvar os arquivos enviados pelo usuário no sistema de arquivos do servidor. Isso deixa você com apenas uma opção de salvar os arquivos enviados em um serviço externo como o Digital Ocean Spaces.

Atualmente, estamos trabalhando em um módulo que permite que você use o sistema de arquivos local durante o desenvolvimento e, em seguida, alterne para um sistema de arquivos externo como o Digital Ocean Spaces para produção. Faça tudo isso sem alterar uma única linha de código.
