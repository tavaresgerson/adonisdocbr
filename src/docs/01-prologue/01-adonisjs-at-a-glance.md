# Visão Geral

AdonisJs é um [Node.js](https://nodejs.org) MVC framework para escrever aplicativos web com menos código. Nós nos concentramos em escrever código elegante e ser um dos frameworks mais estáveis da comunidade Node. Ao contrário de outros frameworks, AdonisJs vem com uma série de módulos testados em batalha para tornar sua experiência de desenvolvimento agradável.

Abaixo está a lista de recursos principais:

1. [ORM] (Objeto-Relacional Mapeamento) poderoso para fazer consultas SQL seguras.
2. Sistema de Autenticação baseado em API & Sessão.
3. Uma maneira fácil de enviar e-mails via SMTP ou serviço web (Mailgun, Mandrill, etc.)
4. Valide e sanitiza toda entrada do usuário.
5. Ênfase forte na segurança.
6. Layout de aplicação extensível.

## Configuração excessiva

Este paradigma de software é o núcleo do AdonisJs. Tentamos *diminuir o tempo que você perde* ao tomar decisões, seguindo convenções bem conhecidas de frameworks populares como Rails, Django ou Laravel sem perder flexibilidade. Por exemplo, se você tem um modelo User a tabela correspondente no banco de dados deve ser chamada `users` por padrão (é claro que você pode mudar isso sobrescrevendo uma propriedade em seu modelo).

Você pode aprender mais sobre este paradigma na [página do Wikipedia](https://pt.wikipedia.org/wiki/Convenção_sobre_configuração).

## Exemplo mais simples

Como dissemos, o AdonisJs tenta remover as grandes partes de código incontrolável com uma *API simples e legível*.

1. O AdonisJs remove os callbacks desnecessários do seu código e introduz o [ES2015](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Iteradores_e_Geradores).
2. Organiza tudo em diferentes diretórios para que você possa saber rapidamente onde estão seus arquivos.
3. Isso não adiciona nada aos globais, exceto as funções "use" e "make", que você aprenderá em breve.

Se disséssemos que em seis linhas de código você pode buscar todos os usuários do banco de dados e enviá-los de volta como uma resposta JSON, você acreditaria em nós?

```js
const Route = use('Route')
const User = use('App/Model/User')

Route.get('/', function * (request, response) {
  const users = yield User.all()
  response.json(users)
})
```

Esperamos que este resumo rápido tenha despertado seu interesse e não se preocupe se você não entender completamente o código acima — o capítulo "Começando" é para você!

## Onde Começar
Aprender um novo framework pode ser avassalador no começo. Como o AdonisJS vem com uma série de módulos pré-configurados, você sempre se sentirá em casa sem precisar gastar tempo procurando os melhores módulos.

Para começar sua jornada de desenvolvimento, recomendamos que você comece lendo os seguintes tópicos:

[Roteamento]
[Pedido]
[Resposta]
[Vistas] e

Também certifique-se de seguir o guia [Instalação](/instalacao) para configurar os essenciais.
