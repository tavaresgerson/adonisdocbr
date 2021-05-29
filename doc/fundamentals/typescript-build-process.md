# Build com TypeScript

Um dos objetivos da estrutura é fornecer suporte de primeira classe para TypeScript. Isso vai além dos tipos estáticos e do IntelliSense 
que você pode aproveitar enquanto escreve o código.

Também garantimos que você nunca precise instalar nenhuma ferramenta de construção adicional para compilar seu código durante o 
desenvolvimento ou produção.

> Este guia pressupõe que você tenha algum conhecimento sobre o TypeScript e o ecossistema de 
> ferramentas para geração de builds.


### Abordagens de empacotamento comuns
A seguir estão algumas das abordagens comuns para desenvolver um aplicativo Node.js com TypeScript.

#### Usando tsc
A maneira mais simples de compilar seu código TypeScript para JavaScript é usando a linha de comando oficial `tsc`.

+ Durante o desenvolvimento, você pode compilar seu código no modo de observação usando o comando `tsc --watch`.
+ Em seguida, você pode assistir com `nodemon` a saída compilada (código JavaScript) e reiniciar o servidor HTTP a 
  cada alteração. A esta altura, você tem dois observadores em execução.
+ Além disso, pode ser necessário escrever scripts personalizados para copiar arquivos estáticos, como modelos, para a 
  pasta de build a fim de que o código JavaScript de tempo de execução possa localizá-lo e referenciá-lo.

#### Usando ts-node
O ts-node melhora a experiência de desenvolvimento, pois compila o código na memória e não o envia para o disco. Você pode combinar 
`tsnode` e `nodemon` para executar seu código typescript como um arquivo primário.

No entanto, para aplicativos maiores, `ts-node` pode ficar lento, pois é necessário recompilar todo o projeto a cada alteração de arquivo. 
Em contraste, `tsc` irá reconstruir apenas o arquivo alterado.

Observe que `ts-node` é uma ferramenta apenas de desenvolvimento. Para produção, você ainda precisa compilar seu código em JavaScript usando `tsc` e 
escrever scripts personalizados para copiar arquivos estáticos.

#### Usando Webpack
Depois de tentar as abordagens acima, você pode decidir dar uma chance ao Webpack. Webpack é uma ferramenta de construção e tem muito a oferecer. 
Mas, ele vem com seu próprio conjunto de desvantagens.

+ Primeiramente, usar o Webpack para agrupar o código de backend é um exagero. Talvez você não precise de 90% dos recursos do webpack, que foram 
  criados para servir ao ecossistema de front-end.
+ Você pode ter que repetir algumas das configurações no `webpack.config.js` config e no arquivo `tsconfig.json`. Especialmente, quais arquivos 
  assistir e ignorar.
+ Além disso, não temos certeza se você pode instruir o [Webpack a NÃO empacotar](https://stackoverflow.com/questions/40096470/get-webpack-not-to-bundle-files) todo o back-end em um único arquivo.

#### Abordagem AdonisJS
Não somos grandes fãs de ferramentas de build complicadas e compiladores de última geração. Ter uma experiência de desenvolvimento tranquila é 
muito mais valioso do que expor uma configuração para ajustar cada botão.

Começamos com o seguinte conjunto de metas.

+ Siga o compilador oficial do TypeScript e não use nenhuma outra ferramenta como `esbuild` ou `swc`. Eles são ótimas alternativas, mas não oferecem suporte 
  a alguns dos recursos do TypeScript.
+ Toda a configuração deve ser gerenciada pelo arquivo `tsconfig.json` existente.
+ Se o código for executado em desenvolvimento, ele também deverá ser executado em produção. Ou seja, não use duas ferramentas de desenvolvimento e 
  produção completamente diferentes e, em seguida, ensine as pessoas como ajustar seu código.
+ Adicione suporte leve para copiar arquivos estáticos para a pasta de compilação final. Normalmente, esses serão os templates Edge.
+ Certifique-se de que o REPL também pode executar o código TypeScript como arquivo de primeira classe. Todas as abordagens acima, exceto `ts-node` não 
  podem compilar e avaliar o código TypeScript diretamente.

### Compilador de desenvolvimento em memória
Semelhante ao `ts-node`, criamos o módulo `@adonisjs/require-ts`. Ele usa a API do compilador TypeScript, o que significa que todos os recursos do 
TypeScript funcionam, e seu arquivo `tsconfig.json` é a única fonte da verdade.

No entanto, [`@adonisjs/require-ts`](https://github.com/adonisjs/require-ts) é um pouco diferente da forma à seguir em `ts-node`.

+ Não realizamos nenhuma verificação de tipo durante o desenvolvimento e esperamos que você conte com seu editor de código para isso.
+ Armazenamos a [saída compilada](https://github.com/adonisjs/require-ts/blob/develop/src/Compiler/index.ts#L179-L208) em uma pasta de cache. Portanto, 
  da próxima vez que o servidor for reiniciado, não recompilaremos os arquivos inalterados. Isso melhora drasticamente a velocidade.
+ Os arquivos em cache devem ser excluídos em algum momento. O módulo `@adonisjs/require-ts` expõe os 
  [métodos auxiliares](https://github.com/adonisjs/require-ts/blob/develop/index.ts#L43-L57) que o observador de arquivos AdonisJS usa 
  para limpar o cache do arquivo alterado recentemente.
+ Limpar o cache só é essencial para reivindicar espaço em disco. Não afeta o comportamento do programa.

Cada vez que você executa `node ace serve --watch`, iniciamos o servidor HTTP junto com o compilador na 
memória e usamos o `nodemon` para observar as alterações do arquivo.

#### Construções de produção autônomas
Você constrói sua produção de código executando o comando `node ace build --production`. Ele executa as seguintes operações.

+ Limpe o diretório `build` existente (se houver).
+ Crie seus assets de front-end usando Webpack encore (somente se estiver instalado).
+ Use a API do compilador TypeScript para compilar o código TypeScript para JavaScript e gravá-lo dentro da pasta `build`. 
  Desta vez, executamos a verificação de tipo e relatamos os erros do TypeScript.
+ Copie todos os arquivos estáticos para a pasta `build`. Os arquivos estáticos são registrados dentro do arquivo `.adonisrc.json` na matriz `metaFiles`.
+ Copie o `package.json` e `package-lock.json/yarn.lock` para a pasta `build`.
+ Gere o arquivo `ace-manifest.json`. Ele contém um índice de todos os comandos que seu projeto está usando.
+ Isso é tudo.

#### Por que chamamos de build autônomo?
Depois de executar o comando `build`, a pasta de saída tem tudo que você precisa para implantar seu aplicativo na produção.

Você pode copiar a pasta `build` sem o código-fonte do TypeScript e seu aplicativo funcionará perfeitamente.

Criar uma pasta `build` autônoma ajuda a reduzir o tamanho do código que você implanta em seu servidor de produção. Isso geralmente 
é útil quando você empacota seu aplicativo como uma imagem Docker. Não há necessidade de ter a saída de origem e de compilação na imagem 
do Docker e mantê-la leve.

#### Pontos a serem lembrados
+ Após a construção, a pasta de saída se torna a raiz de seu aplicativo JavaScript.
+ Você deve sempre entrar com `cd` na pasta `build` e, em seguida, executar seu aplicativo.

```bash
cd build
node server.js
```

+ Você deve instalar dependências somente de produção dentro da pasta `build`.

```bash
cd build
npm ci --production
```
Não copiamos o arquivo `.env` para a pasta de saída. Como as variáveis de ambiente não são transferíveis, você deve 
definir as variáveis de ambiente para produção separadamente.
