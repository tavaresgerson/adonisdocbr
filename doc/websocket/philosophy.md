# Filosofia

Este guia aborda a filosofia do servidor WebSocket.

No final deste guia, você saberá sobre canais , inscrições de tópicos e multiplexação.

## WebSockets puro
O AdonisJs usa [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) puros e não depende de pesquisas.

Usando WebSockets puros (suportados por todos os principais navegadores), o AdonisJs facilita o dimensionamento de aplicativos
horizontalmente em um cluster Node.js. sem dependências de terceiros (por exemplo, Redis) e sem a necessidade de sessões complicadas.

## Multiplexação
A multiplexação reutiliza a mesma conexão TCP ao separar as camadas de evento e autenticação entre os canais.

A multiplexação mantém uma conexão única de cliente para servidor, com o AdonisJS fornecendo uma camada de abstração limpa 
para gerenciar assinaturas de canal e trocar mensagens de aplicativos.

## Canais e tópicos
Depois que um cliente faz uma conexão WebSocket, ele é obrigado a se inscrever em um tópico para trocar mensagens.

Canais e tópicos estão inter-relacionados, então vamos escrever um código para entendê-los melhor.

Registre um canal assim:
``` js
Ws.channel('chat', ({ socket }) => {
  console.log(socket.topic)
})
```
No exemplo acima, todas as assinaturas do canal `chat` têm um tópico estático chamado `chat` (ou seja, o canal e o nome do tópico 
são iguais).

Para registrar um canal com tópicos dinâmicos/curinga:
``` js
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```

No exemplo acima, o canal `chat` aceita tópicos dinâmicos, para que um utilizador pode subscrever o canal `chat:watercooler`,
`chat:intro`, `chat:news`, etc.

Essa abordagem dinâmica/curinga abre um mundo empolgante de possibilidades criativas (por exemplo, tópicos dinâmicos para 
bate-papos privados entre dois usuários).

## Codificadores de dados
O servidor WebSocket usa codificadores de dados ao transmitir mensagens.

Por padrão, o servidor WebSocket usa o codificador JSON, que possui limitações ao transmitir dados binários.

Se necessário, o pacote AdonisJs [`@adonisjs/msgpack-encoder`](https://www.npmjs.com/package/@adonisjs/msgpack-encoder) pode ser usado para manipular **ArrayBuffers** e **Blobs**.

## Pacotes de mensagens
A multiplexação requer um padrão para definir a estrutura de pacotes de dados.

Como consumidor do pacote do servidor WebSocket, você não precisa se preocupar com os tipos de pacotes, mas ao escrever um cliente 
para o servidor, é extremamente importante entendê-los.

O codificador de dados do WebSocket decodifica os dados da rede como um objeto (ou tipo de dado igual para a sua linguagem de
programação) contendo uma estrutura semelhante a:

``` js
{
  t: 7,
  d: {
    topic: 'chat',
    data: 'hello world'
  }
}
```

A propriedade `t` é o tipo de pacote (usamos números sobre cadeias, pois os números são menos dados a serem transferidos).

A propriedade `d` são os dados associados a esse pacote.

Saiba mais sobre os pacotes AdonisJs WebSocket [aqui](https://github.com/adonisjs/adonis-websocket-protocol).

