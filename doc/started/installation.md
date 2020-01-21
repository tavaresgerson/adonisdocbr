# Instalação

A instalação do AdonisJs é um processo simples e leva apenas alguns minutos.

Requisitos de sistema
As únicas dependências da estrutura são Node.js e npm.

Verifique se suas versões dessas ferramentas correspondem aos seguintes critérios:

+ Node.js> = 8.0.0
+ npm> = 3.0.0
+ git

> Você pode usar ferramentas como [nvm](https://github.com/creationix/nvm) para ajudar a 
> gerenciar várias versões do Node.js e npm ao mesmo tempo.

## Instalando AdonisJs

### Via CLI do AdonisJs
A CLI do AdonisJs é uma ferramenta de linha de comando para ajudá-lo a instalar o AdonisJs.

Instale o `npm` globalmente da seguinte maneira:

```
npm i -g @adonisjs/cli
```

> Você também pode usar `npx` para evitar a instalação da CLI globalmente.

Certifique-se de adicionar o diretório de `npm` todo o sistema `node_modules/.bin`
ao seu `$PATH` para poder acessar o binário instalado.

Depois de instalado, você pode usar o comando `adonis new` para criar novas instalações do AdonisJs.

Por exemplo, para criar um novo aplicativo chamado `yardstick`, basta:

```
> adonis new yardstick
```

> Por padrão, o modelo de pilha completa é clonado no Github. Você pode personalizar 
> isso usando as opções `--api-only`ou `--slim`.
>
> Você também pode especificar o seu próprio plano usando a 
> opção `--blueprint=<github-org/repo>`.

### Via Git
Como alternativa, você pode usar `git` diretamente para buscar nossos boilerplates:

```
# Fullstack
> git clone --dissociate https://github.com/adonisjs/adonis-fullstack-app

# API
> git clone --dissociate https://github.com/adonisjs/adonis-api-app

# Slim
> git clone --dissociate https://github.com/adonisjs/adonis-slim-app
```

Após a clonagem de um boilerplate, instale todas as dependências executando `npm install`.

## Servindo o aplicativo
Depois que o processo de instalação estiver concluído, você poderá entrar no seu novo diretório 
com `cd` em aplicativos e executar o seguinte comando para iniciar o Servidor HTTP:

```
> adonis serve --dev
```

Este comando inicia o servidor na porta definida dentro do arquivo `.env` raiz.
