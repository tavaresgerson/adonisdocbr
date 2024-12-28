---
title: Philosophy
category: websockets
---

# Filosofia

Este guia aborda a filosofia do servidor WebSocket.

Ao final deste guia, você saberá sobre *canais*, *assinaturas de tópicos* e *multiplexação*.

## WebSockets puros
O AdonisJs usa [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) puros e não depende de pesquisas.

Usando WebSockets puros (com suporte em todos os principais navegadores), o AdonisJs facilita o *dimensionamento horizontal de aplicativos em um cluster Node.js* sem nenhuma dependência de terceiros (por exemplo, Redis) e sem a necessidade de sessões persistentes.

## Multiplexação
A multiplexação reutiliza a mesma conexão TCP enquanto separa as camadas de *evento* e *autenticação* entre os canais.

A multiplexação mantém uma única conexão do cliente para o servidor, com o AdonisJS fornecendo uma camada de abstração limpa para gerenciar assinaturas de canais e trocar mensagens do seu aplicativo.

## Canais e tópicos
Depois que um cliente faz uma conexão WebSocket, ele precisa assinar um *tópico* para trocar mensagens.

Canais e tópicos são inter-relacionados, então vamos escrever algum código para entendê-los melhor.

Registre um canal assim:

```js
Ws.channel('chat', ({ socket }) => {
  console.log(socket.topic)
})
```

No exemplo acima, todas as assinaturas do canal `chat` têm um tópico estático chamado `chat` (ou seja, o canal e o nome do tópico são os mesmos).

Para registrar um canal com tópicos dinâmicos/curinga:

```js
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```

No exemplo acima, o canal `chat` aceita tópicos dinâmicos, então um usuário pode se inscrever no canal `chat:watercooler`, `chat:intro`, `chat:news`, etc.

Essa abordagem dinâmica/curinga abre um mundo emocionante de possibilidades criativas (por exemplo, tópicos dinâmicos para chats privados entre dois usuários).

## Codificadores de dados
O servidor WebSocket usa codificadores de dados ao passar mensagens.

Por padrão, o servidor WebSocket usa o codificador JSON, que tem limitações ao passar dados binários.

Se necessário, o pacote AdonisJs [@adonisjs/msgpack-encoder](https://www.npmjs.com/package/@adonisjs/msgpack-encoder) pode ser usado para manipular *ArrayBuffers* e *Blobs*.

## Pacotes de mensagens
A multiplexação requer um padrão para definir a estrutura do pacote de dados.

Como consumidor do pacote do servidor WebSocket, você não precisa se preocupar com os tipos de pacotes, mas ao escrever um cliente para o servidor, é extremamente importante entendê-los.

Seu codificador de dados WebSocket decodifica dados de rede como um *objeto* (ou tipo de dados equivalente para sua linguagem de programação) contendo uma estrutura semelhante a:

```js
{
  t: 7,
  d: {
    topic: 'chat',
    data: 'hello world'
  }
}
```

1. A propriedade `t` é o tipo do pacote (usamos números em vez de strings, pois números são menos dados para transferir).
2. A propriedade `d` são os dados associados a esse pacote.

DICA: Saiba mais sobre os pacotes AdonisJs WebSocket [aqui](https://github.com/adonisjs/adonis-websocket-protocol).
