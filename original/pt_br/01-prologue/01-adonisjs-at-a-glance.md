# AdonisJs em resumo

AdonisJs é um framework MVC [Node.js](https://nodejs.org) para escrever aplicativos da web com menos código. Nosso foco é escrever código elegante e ser um dos frameworks mais estáveis ​​da comunidade Node. Ao contrário de outros frameworks, o AdonisJs vem com vários módulos testados em batalha para tornar sua experiência de desenvolvimento agradável.

Abaixo está a lista dos principais recursos:

1. [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping) poderoso para fazer consultas SQL seguras.
2. Sistema de autenticação baseado em API e sessão.
3. Maneira fácil de enviar e-mails via SMTP ou serviço da Web (Mailgun, Mandrill, etc.)
4. Valide e higienize as entradas de cada usuário.
5. Forte ênfase na segurança.
6. Layout de aplicativo extensível.

## Convenções sobre configuração

Este paradigma de software é o núcleo do AdonisJs. Tentamos *diminuir o tempo que você perde* ao tomar decisões, seguindo convenções bem conhecidas de frameworks populares como Rails, Django ou Laravel sem perder nenhuma flexibilidade. Por exemplo, se você tem um modelo User, a tabela correspondente no banco de dados deve ser chamada de `users` por padrão (claro que você pode alterar isso substituindo uma propriedade no seu modelo).

Você pode aprender mais sobre esse paradigma na [página da Wikipedia](https://en.wikipedia.org/wiki/Convention_over_configuration).

## Exemplo mais simples

Como dissemos, o AdonisJs tenta remover os grandes pedaços de código incontroláveis ​​com *API simples e legível*.

1. O AdonisJs remove os retornos de chamada desnecessários do seu código e introduz o [ES2015 Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators).
2. Ele organiza tudo em diretórios diferentes para que você saiba rapidamente onde seus arquivos estão.
3. Ele não adiciona nada aos globais, exceto as funções `use` e ​​`make` que você aprenderá em breve.

Se disséssemos que em seis linhas de código você pode buscar todos os usuários do banco de dados e enviá-los de volta como resposta `JSON`, você acreditaria?

```js
const Route = use('Route')
const User = use('App/Model/User')

Route.get('/', function * (request, response) {
  const users = yield User.all()
  response.json(users)
})
```

Espero que esta rápida visão geral tenha intrigado você e não se preocupe se você não entender completamente o código acima -- o capítulo Introdução é para você!

## Por onde começar
Aprender uma nova estrutura pode ser assustador no começo. Como o AdonisJs vem com vários módulos/addons pré-configurados, você sempre se sentirá em casa sem perder tempo procurando os melhores módulos.

Para começar sua jornada de desenvolvimento, recomendamos que você comece lendo os seguintes tópicos:

* [Roteamento](/docs/03-getting-started/05-routing.md)
* [Solicitação](/docs/03-getting-started/06-request.md)
* [Resposta](/docs/03-getting-started/07-response.md)
* [Visualizações](/docs/04-views/01-views.md) e

Certifique-se também de seguir o guia [Instalação](/src/docs/03-getting-started/01-installation.md) para configurar os itens essenciais.
