# Eventos

O AdonisJs é construído com um provedor de eventos dedicado.

Internamente, ele usa o pacote [EventEmitter2](https://github.com/asyncly/EventEmitter2), com outras funcionalidades convenientes 
adicionadas a ele.

O Provedor de Eventos possui uma implementação [fake](https://adonisjs.com/docs/4.1/testing-fakes#_events_fake), que pode ser usada para asserções ao escrever testes.

## Visão Geral dos Eventos

* Ouvintes de eventos são definidos dentro do arquivo `start/events.js`.

Os ouvintes de eventos podem ser definidos como **encerramentos** ou, em vez disso , você pode vincular um **namespace** de contêiner IoC:
