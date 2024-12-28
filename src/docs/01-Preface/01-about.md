---
title: About AdonisJs
category: Preface
---
# Sobre o AdonisJs

O AdonisJs é um framework Node.js MVC que roda em todos os principais sistemas operacionais. Ele oferece um ecossistema estável para escrever aplicativos web do lado do servidor para que você possa se concentrar nas necessidades do negócio em vez de finalizar qual pacote escolher ou não.

O AdonisJs favorece a alegria do desenvolvedor com uma API consistente e expressiva para construir aplicativos web full-stack ou servidores micro API.

## Começando
Não há pré-requisitos rígidos para usar o AdonisJs, mas ter um entendimento convencional de JavaScript, programação assíncrona e Node.js é muito útil.

Além disso, se você é novo em JavaScript ou não está familiarizado com seu progresso recente no ES6, recomendamos assistir ao [curso ES6 de Wes Bos](https://goo.gl/ox3uSc).

Por fim, certifique-se de ler nosso guia de [instalação](/original/markdown/03-getting-started/01-installation.adoc), especialmente se esta for sua primeira vez usando o AdonisJs.

## Provedores
O AdonisJs é uma estrutura modular que consiste em vários provedores de serviços, os blocos de construção dos aplicativos AdonisJs.

Em teoria, eles são como qualquer outro módulo npm com algum código em cima para funcionar perfeitamente com os aplicativos AdonisJs (por exemplo, [BodyParser](https://github.com/adonisjs/adonis-bodyparser) para analisar o corpo da solicitação HTTP ou [Lucid](https://github.com/adonisjs/adonis-lucid) que é um ORM SQL).

## FAQ's
Abaixo está a lista de perguntas frequentes. Se você acha que uma pergunta comum está faltando na lista, crie um problema [aqui](https://github.com/adonisjs/docs).

1. *Como o AdonisJs é diferente do Express ou do Koa?*
    * O Express e o Koa são bibliotecas de roteamento com uma fina camada de middleware por cima. Elas são ótimas para vários casos de uso, mas desmoronam quando os projetos começam a crescer.
    * Como seus projetos têm seus próprios padrões e convenções, pode ser mais difícil contratar desenvolvedores para trabalhar neles. Como o AdonisJs segue um conjunto de convenções padronizadas, deve ser mais fácil contratar alguém para trabalhar em aplicativos AdonisJs existentes.

2. *O AdonisJs é para aplicativos monolíticos?*
    * Não. O AdonisJs Framework é uma combinação de vários pacotes que se integram perfeitamente com o restante do seu aplicativo.
    * O framework fornece uma camada robusta link:ioc-container[injeção de dependência] alavancada por todos os pacotes oficiais e de terceiros para oferecer funcionalidade sem conectar manualmente cada parte do seu aplicativo.
