---
summary: Aprenda sobre como definir e processar argumentos de comando em comandos Ace.
---

# Argumentos de comando

Argumentos referem-se aos argumentos posicionais mencionados após o nome do comando. Como os argumentos são posicionais, é necessário passá-los na ordem correta.

Você deve definir argumentos de comando como propriedades de classe e decorá-los usando o decorador `args`. Os argumentos serão aceitos na mesma ordem em que são definidos na classe.

No exemplo a seguir, usamos o decorador `@args.string` para definir um argumento que aceita um valor de string.

```ts
import { BaseCommand, args, flags } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  static commandName = 'greet'
  static description = 'Greet a user by name'
  
  @args.string()
  declare name: string

  run() {
    console.log(this.name)
  }
}
```

Para aceitar vários valores sob o mesmo nome de argumento, você pode usar o decorador `@agrs.spread`. Observe que o argumento spread deve ser o último.

```ts
import { BaseCommand, args, flags } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  static commandName = 'greet'
  static description = 'Greet a user by name'
  
  // highlight-start
  @args.spread()
  declare names: string[]
  // highlight-start

  run() {
    console.log(this.names)
  }
}
```

## Nome e descrição do argumento

O nome do argumento é exibido na tela de ajuda. Por padrão, o nome do argumento é uma representação tracejada do nome da propriedade da classe. No entanto, você também pode definir um valor personalizado.

```ts
@args.string({
  argumentName: 'user-name'
})
declare name: string
```

A descrição do argumento é mostrada na tela de ajuda e pode ser definida usando a opção `description`.

```ts
@args.string({
  argumentName: 'user-name',
  description: 'Name of the user'
})
declare name: string
```

## Argumentos opcionais com um valor padrão

Por padrão, todos os argumentos são obrigatórios. No entanto, você pode torná-los opcionais definindo a opção `required` como `false`. Os argumentos opcionais devem estar no final.

```ts
@args.string({
  description: 'Name of the user',
  required: false,
})
declare name?: string
```

Você pode definir o valor padrão de um argumento opcional usando a propriedade `default`.

```ts
@args.string({
  description: 'Name of the user',
  required: false,
  default: 'guest'
})
declare name: string
```

## Processando o valor do argumento

Usando o método `parse`, você pode processar o valor do argumento antes que ele seja definido como a propriedade da classe.

```ts
@args.string({
  argumentName: 'user-name',
  description: 'Name of the user',
  parse (value) {
    return value ? value.toUpperCase() : value
  }
})
declare name: string
```

## Acessando todos os argumentos

Você pode acessar todos os argumentos mencionados ao executar o comando usando a propriedade `this.parsed.args`.

```ts
import { BaseCommand, args, flags } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  static commandName = 'greet'
  static description = 'Greet a user by name'
  
  @args.string()
  declare name: string

  run() {
    console.log(this.parsed.args)
  }
}
```
