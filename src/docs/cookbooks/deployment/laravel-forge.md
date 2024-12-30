# Laravel Forge

Este guia abrange as etapas de ação para implantar um aplicativo AdonisJS no [Laravel Forge](https://forge.laravel.com).

Implantar um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você só precisa ter algumas coisas em mente:

- Você constrói sua fonte TypeScript para JavaScript, antes de implantar o aplicativo.
- Você terá que iniciar o servidor a partir da pasta `build` e não da raiz do projeto. O mesmo vale para executar migrações em qualquer outro aplicativo Node.js.

Você pode construir seu projeto para produção executando o seguinte comando ace. Saiba mais sobre o [processo de construção TypeScript](/docs/guides/fundamentals/typescript-build-process.md)

```sh
node ace build --production

# OU use o script npm
npm run build
```

## Crie um servidor

Selecione seu provedor preferido e crie um servidor

Assim que o servidor estiver pronto. Crie um usuário de banco de dados (opcional)

### Criar usuário de banco de dados

no menu lateral do seu servidor, selecione **Banco de dados**
- Navegue até Adicionar usuário de banco de dados
- Insira um nome de usuário e senha, você também pode selecionar este usuário Pode acessar quais bancos de dados
- mantenha suas credenciais em um lugar seguro e use-as em .env

## Criar um site

Quando você cria um servidor no forge, precisamos criar um [site](https://forge.laravel.com/docs/1.0/sites/the-basics.html) ,

- Defina o `Domínio raiz` com o domínio desejado da sua API, ou seja, **staging.api.yourdomain.com**.
- Selecione HTML estático como seu tipo de projeto.
- Marque `Criar banco de dados` se quiser criar um banco de dados para seu aplicativo e selecione um Nome de banco de dados.

![image](https://res.cloudinary.com/ayman-personal/image/upload/v1627988326/uploads/create-site-laravel-forge_vqyz2r.jpg)

### Configure seu script de implantação e as configurações do Git

Script de implantação são os comandos que são executados quando você envia um commit para sua ramificação predefinida. No nosso caso para Adonisjs, precisamos acessar a pasta do aplicativo -> então puxar as alterações -> executar alguns comandos para migração e processo de construção.

O recurso "Implantação rápida" permite que você implante facilmente seus projetos quando você envia para seu provedor de controle de origem. Quando você envia para sua ramificação de implantação rápida configurada, o Forge extrairá seu código mais recente do controle de origem e executará o script de implantação configurado do seu aplicativo.
Você pode habilitar o recurso de implantação rápida do Forge clicando no botão "Habilitar implantação rápida" na guia Aplicativos do painel de gerenciamento do seu site.

#### para Desenvolvimento

```bash
cd /home/forge/staging.api.yourdomain.com

git reset --hard;

git clean -df;

git pull origin $FORGE_SITE_BRANCH

# migrar database
node ace migration:run --force

# instalar dependências npm
 yarn

# recarregar pm2 
pm2 reload all --update-env
```
tenha em mente que pela primeira vez você precisa executar o comando pm2 start no seu servidor, então o script de implantação irá recarregá-lo quando acionado.

#### exemplo de como executar o pm2 no servidor pela primeira vez
```
pm2 start yarn --name api -- dev
```

#### para Produção

```bash
cd /home/forge/staging.api.yourdomain.com

git reset --hard;

git clean -df;


git pull origin $FORGE_SITE_BRANCH

# migrar database
node ace migration:run --force

# instalar dependências npm
yarn

# Executar comando Build
node ace build --production

# Copiar arquivos env
cd /home/forge/staging.api.yourdomain.com/build
yarn install --production
cp ../.env ./.env

# recarregar pm2 
pm2 reload all --update-env
```

### Configurações do Git

Certifique-se de fornecer o nome do repositório ao entrar no seu Repositório. Para provedores GitHub, GitLab e Bitbucket, você deve fornecer o nome no formato usuário/repositório

![image](https://res.cloudinary.com/ayman-personal/image/upload/v1627990130/uploads/git_c5kr4c.jpg)

### Criar certificado SSL

Após criar seu site, navegue até a aba **SSL** no menu lateral do site.
- Selecione seu tipo de certificado, neste exemplo usaremos LetsEncrypt
- Insira o domínio do seu site, ou seja, (staging.api.yourdomain.com)
- Clique em Obter certificado

![image](https://res.cloudinary.com/ayman-personal/image/upload/v1627988526/uploads/ssl-LetsEncrypt_srj73r.jpg)

### Defina o ambiente do seu site

Navegue até o menu lateral do site e clique em **Ambiente**
- copie o conteúdo do arquivo .env e cole-o lá.

![image](https://res.cloudinary.com/ayman-personal/image/upload/v1627989008/uploads/env_qfx7vd.jpg)

### Configurar Ngnix

na aba **Apps** role para baixo até o botão de arquivo e selecione Editar configuração Nginx

```
   location / {
      # example proxy_pass http://localhost:3333;
      proxy_pass http://localhost:<ADONIS_PORT>;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_cache_bypass $http_upgrade;
    }
```

![image](https://res.cloudinary.com/ayman-personal/image/upload/v1627990543/uploads/ngnix_r7vqg7.jpg)
