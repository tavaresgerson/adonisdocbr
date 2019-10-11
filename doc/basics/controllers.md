# Controllers

Embora os fechamentos possam ser suficientes para lidar com a lógica de rota para aplicativos pequenos, quando seu aplicativo começa 
a crescer, torna-se útil organizar a lógica do aplicativo em outro lugar.

É aqui que os controladores entram em jogo.

Os controladores se conectam a uma ou várias rotas, agrupando a lógica de manipulação de solicitações relacionadas em arquivos únicos e 
são o ponto comum de interação entre seus modelos, visualizações e quaisquer outros serviços que você possa precisar.

> O único trabalho de um controlador é responder a uma solicitação HTTP. Não os use internamente, exigindo-os em arquivos diferentes.

## Criando controladores
Para criar um novo controlador, use o comando `make:controller`:

```
# HTTP Controller
> adonis make:controller User --type http

# WS Controller
> adonis make:controller User --type ws

# Usará uma subpasta de Admin
> adonis make:controller Admin/User
```

Este comando cria um arquivo padrão na pasta App / Controllers / {TYPE}:
