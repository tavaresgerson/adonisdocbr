# Sobre o AdonisJs

O AdonisJs é uma estrutura MVC do Node.js que é executada em todos os principais sistemas operacionais. Ele oferece um ecossistema 
estável para a criação de aplicativos na Web no lado do servidor, para que você possa se concentrar nas necessidades de negócios.

O AdonisJs favorece a alegria do desenvolvedor com uma API consistente e expressiva para criar aplicativos na Web de pilha completa 
ou microservices.

## Começando
Não existem pré-requisitos para o uso do AdonisJs, mas ter uma compreensão convencional de JavaScript, programação assíncrona e 
Node.js é muito útil.

Além disso, se você é novo no JavaScript ou não está familiarizado com seu progresso recente no ES6, recomendamos assistir ao 
curso ES6 de [Wes Bos](https://goo.gl/ox3uSc).

Por fim, leia o nosso [guia de instalação](https://adonisjs.com/docs/4.1/installation), especialmente se esta for a primeira vez que você usa o AdonisJs.

## Providers
O AdonisJs é uma estrutura modular que consiste em vários provedores de serviços, os blocos de construção dos aplicativos 
AdonisJs.

Em teoria, eles são como qualquer outro módulo npm com algum código no topo para funcionar suavemente com aplicativos 
AdonisJs (por exemplo, BodyParser para analisar o corpo da solicitação HTTP ou Lucid, que é um SQL ORM).

## FAQ’s
Abaixo está a lista de perguntas frequentes. Se você acha que uma pergunta comum está faltando na lista, crie um issue aqui.

### Como o AdonisJs é diferente do Express ou do Koa?
Express e Koa estão roteando bibliotecas com uma camada fina de middlewares no topo. Eles são ótimos para vários casos de 
uso, mas desmoronam quando os projetos começam a crescer.

Como seus projetos têm seus próprios padrões e convenções, pode ser mais difícil contratar desenvolvedores para trabalhar 
neles. Como o AdonisJs segue um conjunto de convenções padronizadas, deve ser mais fácil contratar alguém para trabalhar em 
aplicativos existentes do AdonisJs.

### AdonisJs é para aplicativos monolíticos?
Não. O AdonisJs Framework é uma combinação de vários pacotes que se integram graciosamente ao resto de sua aplicação.

A estrutura fornece uma camada de [injeção de dependência](https://adonisjs.com/docs/4.1/ioc-container) robusta, aproveitada por todos os pacotes oficiais e de terceiros 
para oferecer funcionalidade sem conectar manualmente cada parte do seu aplicativo.
