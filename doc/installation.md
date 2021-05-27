# Instalação

AdonisJS é uma estrutura Node.js e, portanto, requer que o Node.js seja instalado em seu computador. Para ser preciso, exigimos 
Node.js >= 14.15.4 junto com npm >= 6.0.0.

Você pode verificar as versões Node.js e npm executando os seguintes comandos.

```bash
# Versão do node.js
node -v

# Versão do npm
npm -v
```

Se você não tem o Node.js instalado, pode baixar o [binário](https://nodejs.org/en/download/) para seu sistema operacional apartir 
do site oficial.

Se você se sente confortável com a linha de comando, recomendamos usar [nvm](https://github.com/nvm-sh/nvm) ou [volta](https://volta.sh/) para 
instalar e executar várias versões do Node.js em seu computador.

#### Criando um novo projeto
Você pode criar um novo projeto usando `npm init` ou `yarn create`. Ambas as ferramentas baixarão o pacote inicial do AdonisJS e 
iniciarão o processo de instalação.

```bash
npm init adonis-ts-app@latest hello-world

# Com o yarn
yarn create adonis-ts-app hello-world
```

O processo de instalação irá te auxiliar com as seleções.

#### Estrutura do projeto
Você pode escolher entre uma das seguintes estruturas de projeto:

* `web` A estrutura do projeto é ideal para criar aplicativos clássicos renderizados para servidor. Configuramos o suporte para sessões e 
  também instalamos o mecanismo de modelo AdonisJS.
* `api` A estrutura do projeto é ideal para a criação de um servidor baseado API.
* `slim` A estrutura do projeto cria o menor aplicativo AdonisJS possível e não instala nenhum pacote adicional, exceto o núcleo do framework.
 
 
#### Nome do Projeto
O nome do projeto. Definimos o valor deste prompt dentro do arquivo `package.json`.

#### Configurar eslint/prettier
Opcionalmente, você pode configurar o Eslint e o prettier. Ambos os pacotes são configurados com as configurações opinativas usadas pela 
equipe principal do AdonisJS.

#### Configurar o webpack encore
Opcionalmente, você também pode configurar o [webpack encore](https://docs.adonisjs.com/guides/assets-manager) para agrupar e servir 
dependências de front-end.

Observe que o AdonisJS é um framework de back-end e não se preocupa com ferramentas de construção de front-end. 
Portanto, a configuração do webpack é opcional.

#### Iniciando o servidor de desenvolvimento
Depois de criar o aplicativo, você pode iniciar o servidor de desenvolvimento executando o seguinte comando.

```bash
node ace serve --watch
```
* O comando `serve` inicia o servidor HTTP e executa a compilação na memória de TypeScript para JavaScript.

* O sinalizador `--watch` tem como objetivo observar o sistema de arquivos em busca de alterações e reiniciar o servidor automaticamente.

### Compilando para produção
Você deve sempre implantar o JavaScript compilado em seu servidor de produção. Você pode criar a construção de produção executando o seguinte comando.

```bash
node ace build --production
```

A saída compilada é gravada na pasta `build`. Você pode entrar com `cd` nesta pasta e iniciar o servidor executando o 
o arquivo `serve.js` diretamente. Saiba mais sobre o [processo de construção do typescript](https://docs.adonisjs.com/guides/typescript-build-process).

```bash
cd build
node server.js
```
