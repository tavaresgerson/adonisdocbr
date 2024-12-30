# Cleavr

Este guia abrange as etapas para implementar um aplicativo AdonisJS no seu VPS usando [Cleavr](https://cleavr.io).

Implementar um aplicativo AdonisJS não é diferente de implementar um aplicativo Node.js padrão. Você só precisa ter algumas coisas em mente:

- Você constrói sua fonte TypeScript para JavaScript, antes de implementar o aplicativo.
- Você terá que iniciar o servidor a partir da pasta `build` e não da raiz do projeto. O mesmo vale para executar migrações em qualquer outro aplicativo Node.js.

Você pode construir seu projeto para produção executando o seguinte comando ace. Saiba mais sobre o [processo de construção TypeScript](/docs/guides/fundamentals/typescript-build-process.md)

```sh
node ace build --production

# OU use o script npm
npm run build
```

## Pré-requisitos

A Cleavr fornece uma experiência de primeira classe para aplicativos AdonisJS, então a implantação de seus aplicativos leva apenas alguns cliques. Antes de começar, certifique-se de ter:

- Uma conta configurada com [Cleavr](https://cleavr.io)
- Um servidor provisionado

## Etapa 1: adicione um site AdonisJS

No seu servidor na Cleavr, adicione um novo site **AdonisJS**.

![image](/docs/assets/cleavr-new-site_v0twxz.png)

::: info NOTA
Para economizar tempo, você pode configurar seu banco de dados durante a etapa de criação do site e as configurações de conexão serão adicionadas automaticamente às variáveis ​​de ambiente.
:::

## Etapa 2: Configurar o aplicativo da Web

Após o site ter sido adicionado com sucesso ao seu servidor, navegue até a seção do aplicativo da Web para configurar seu aplicativo.

### Conectar repositório

Em `Configurações > Repositório de código`, conecte seu aplicativo da Web ao repositório git em que seu código reside.

![image](/docs/assets/cleavr-webapp-git-repository_ub5rcb.png)

### Configurar variáveis ​​de ambiente

O Cleavr adiciona variáveis ​​de ambiente padrão para seu aplicativo AdonisJS. Configure quaisquer variáveis ​​adicionais necessárias.

![image](/docs/assets/cleavr-env-variables_v89vnn.png)

### Configurar ganchos de implantação

Um conjunto padrão de ganchos de implantação é adicionado automaticamente para seu aplicativo AdonisJS, o que será suficiente para a maioria dos projetos. Você pode adicionar ganchos de implantação adicionais para suas necessidades.

::: info NOTA
Se você incluiu a configuração de um banco de dados ao adicionar seu site AdonisJS, o gancho de implantação **Migrate Database** será habilitado por padrão. Você pode desabilitar o gancho de implantação após a implantação inicial.
:::

## Etapa 3: Implante seu aplicativo da Web

Depois de concluir a configuração do seu aplicativo da Web, agora você pode implantar seu projeto!

![image](/docs/assets/cleavr-deployment_pjzln7.png)

Veja o [guia de implantação do Cleavr Adonis](https://docs.cleavr.io/guides/adonis) e o [guia de solução de problemas do Cleavr Adonis](https://docs.cleavr.io/adonis-deployments) para obter informações adicionais.
