# Processo de construção do TypeScript

Um dos objetivos do framework é fornecer suporte de primeira classe para o TypeScript. Isso vai além dos tipos estáticos e do IntelliSense que você pode aproveitar ao escrever o código.

**Também garantimos que você nunca precise instalar nenhuma ferramenta de construção adicional para compilar seu código durante o desenvolvimento ou para produção.**

::: info NOTA
Este guia pressupõe que você tenha algum conhecimento sobre o TypeScript e o ecossistema de ferramentas de construção.
:::

## Abordagens comuns de agrupamento
A seguir estão algumas das abordagens comuns para desenvolver um aplicativo Node.js escrito em TypeScript.

### Usando tsc
A maneira mais simples de compilar seu código TypeScript para JavaScript é usando a linha de comando oficial `tsc`.

- Durante o desenvolvimento, você pode compilar seu código no modo de observação usando o comando `tsc --watch`.
- Em seguida, você pode pegar `nodemon` para observar a saída compilada (código JavaScript) e reiniciar o servidor HTTP em cada alteração. Neste momento, você tem dois observadores em execução.
[scripts personalizados para copiar arquivos estáticos](https://github.com/microsoft/TypeScript/issues/30835) como **templates** para a pasta de compilação para que seu código JavaScript de tempo de execução possa encontrá-lo e referenciá-lo.

### Usando ts-node
ts-node melhora a experiência de desenvolvimento, pois compila o código na memória e não o envia para o disco. Assim, você pode combinar `ts-node` e `nodemon` e executar seu código TypeScript como um cidadão de primeira classe.

No entanto, para aplicativos maiores, `ts-node` pode ficar lento, pois precisa recompilar o projeto inteiro em cada alteração de arquivo. Em contraste, `tsc` estava reconstruindo apenas o arquivo alterado.

Observe que `ts-node` é uma ferramenta somente para desenvolvimento. Portanto, você ainda precisa compilar seu código para JavaScript usando `tsc` e escrever scripts personalizados para copiar arquivos estáticos para produção.

### Usando Webpack
Depois de tentar as abordagens acima, você pode decidir experimentar o Webpack. O Webpack é uma ferramenta de construção e tem muito a oferecer. Mas, ele vem com seu próprio conjunto de desvantagens.

- Primeiro, usar o Webpack para agrupar o código de backend é um exagero. Você pode nem precisar de 90% dos recursos do Webpack criados para atender ao ecossistema de frontend.
- Você pode ter que repetir algumas das configurações no arquivo `webpack.config.js` config e `tsconfig.json` principalmente, quais arquivos observar e ignorar.
[Webpack NÃO agrupar](https://stackoverflow.com/questions/40096470/get-webpack-not-to-bundle-files) todo o backend em um único arquivo.

## Abordagem AdonisJS
Não somos grandes fãs de ferramentas de construção muito complicadas e compiladores de ponta. Ter uma experiência de desenvolvimento tranquila é muito mais valioso do que expor a configuração para ajustar cada botão.

Começamos com o seguinte conjunto de objetivos.

- Use o compilador oficial do TypeScript e não use nenhuma outra ferramenta como `esbuild` ou `swc`. Elas são ótimas alternativas, mas não suportam alguns dos recursos do TypeScript (ex. [a API Transformers](https://levelup.gitconnected.com/writing-typescript-custom-ast-transformer-part-1-7585d6916819)).
- O arquivo `tsconfig.json` existente deve gerenciar todas as configurações.
- Se o código roda em desenvolvimento, ele também deve rodar em produção. Ou seja, não use duas ferramentas de desenvolvimento e produção completamente diferentes e depois ensine as pessoas a ajustarem seus códigos.
- Adicione suporte leve para copiar arquivos estáticos para a pasta de build final. Normalmente, esses serão os modelos do Edge.
- **Certifique-se de que o REPL também pode executar o código TypeScript como um cidadão de primeira classe. Todas as abordagens acima, exceto `ts-node`, não podem compilar e avaliar o código TypeScript diretamente.**

## Compilador de desenvolvimento na memória
Semelhante ao ts-node, criamos o módulo [@adonisjs/require-ts](https://github.com/adonisjs/require-ts). Ele usa a API do compilador TypeScript, o que significa que todos os recursos do TypeScript funcionam, e seu arquivo `tsconfig.json` é a única fonte da verdade.

No entanto, `@adonisjs/require-ts` é ligeiramente diferente de `ts-node` nas seguintes maneiras.

- Não realizamos nenhuma verificação de tipo durante o desenvolvimento e esperamos que você confie no seu editor de código para o mesmo.
- Armazenamos a [saída compilada](https://github.com/adonisjs/require-ts/blob/develop/src/Compiler/index.ts#L185-L223) em uma pasta de cache. Então, na próxima vez que seu servidor reiniciar, não recompilaremos os arquivos inalterados. Isso melhora a velocidade drasticamente.
- Os arquivos em cache precisam ser excluídos em algum momento. O módulo `@adonisjs/require-ts` expõe os [métodos auxiliares](https://github.com/adonisjs/require-ts/blob/develop/index.ts#L43-L57) que o observador de arquivos do AdonisJS usa para limpar o cache do arquivo alterado recentemente.
- Limpar o cache é essencial apenas para reivindicar o espaço em disco. Não afeta o comportamento do programa.

Toda vez que você executa `node ace serve --watch`, iniciamos o servidor HTTP junto com o compilador na memória e observamos o sistema de arquivos para alterações de arquivo.

## Builds de produção autônomos
Você cria seu código para produção executando o comando `node ace build --production`. Ele executa as seguintes operações.

- Limpe o diretório `build` existente (se houver).
- Crie seus ativos de frontend usando o Webpack Encore (somente se estiver instalado).
- Use a API do compilador TypeScript para compilar o código TypeScript para JavaScript e escrevê-lo dentro da pasta `build`. **Desta vez, realizamos a verificação de tipo e relatamos os erros do TypeScript**.
- Copie todos os arquivos estáticos para a pasta `build`. Os arquivos estáticos são registrados dentro do arquivo `.adonisrc.json` sob o array `metaFiles`.
- Copie `package.json` e `package-lock.json`/`yarn.lock` para a pasta `build`.
- Gere o arquivo `ace-manifest.json`. Ele contém um índice de todos os comandos que seu projeto está usando.
- Isso é tudo.

#### Por que chamamos isso de build autônomo?
Depois de executar o comando `build`, a pasta de saída tem tudo o que você precisa para implantar seu aplicativo em produção.

Você pode copiar a pasta `build` sem seu código-fonte TypeScript, e seu aplicativo funcionará perfeitamente.

Criar uma pasta `build` autônoma ajuda a reduzir o tamanho do código que você implanta em seu servidor de produção. Isso geralmente é útil quando você empacota seu aplicativo como uma imagem Docker. No entanto, não há necessidade de ter a saída de origem e build em sua imagem Docker e mantê-la leve.

#### Pontos a serem lembrados

- Após a compilação, a pasta de saída se torna a raiz do seu aplicativo JavaScript.
- Você deve sempre `cd` na pasta `build` e então executar seu aplicativo.
  ```sh
  cd build
  node server.js
  ```
- Você deve instalar dependências somente de produção dentro da pasta `build`.
  ```sh
  cd build
  npm ci --production
  ```
- Não copiamos o arquivo `.env` para a pasta de saída. Como as variáveis ​​de ambiente não são transferíveis, você deve definir variáveis ​​de ambiente para produção separadamente.
