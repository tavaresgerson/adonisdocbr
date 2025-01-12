---
summary: Aprenda a definir e processar sinalizadores de comando em comandos Ace.
---

# Sinalizadores de comando

Os sinalizadores são parâmetros nomeados mencionados com dois hifens (`--`) ou um único hífen (`-`) (conhecido como alias do sinalizador). Os sinalizadores podem ser mencionados em qualquer ordem.

Você deve definir os sinalizadores como propriedades de classe e decorá-los usando o decorador `@flags`. No exemplo a seguir, definimos os sinalizadores `resource` e `singular`, e ambos representam um valor booleano.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class MakeControllerCommand extends BaseCommands {
  @flags.boolean()
  declare resource: boolean

  @flags.boolean()
  declare singular: boolean
}
```

## Tipos de sinalizadores

O Ace permite definir sinalizadores para um dos seguintes tipos.

### Sinalizador booleano

Um sinalizador booleano é definido usando o decorador `@flags.boolean`. Mencionar o sinalizador definirá seu valor como `true`. Caso contrário, o valor do sinalizador será `undefined`.

```sh
make:controller --resource

# this.resource === true
```

```sh
make:controller

# this.resource === undefined
```

```sh
make:controller --no-resource

# this.resource === false
```

O último exemplo mostra que os sinalizadores booleanos podem ser negados com o prefixo `--no-`.

Por padrão, a opção negada não é mostrada na saída de ajuda. No entanto, você pode habilitá-la usando a opção `showNegatedVariantInHelp`.

```ts
export default class MakeControllerCommand extends BaseCommands {
  @flags.boolean({
    showNegatedVariantInHelp: true,
  })
  declare resource: boolean
}
```

### Sinalizador de string

Um sinalizador de string aceita um valor após o nome do sinalizador. Você pode definir um sinalizador de string usando o método `@flags.string`.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class MakeControllerCommand extends BaseCommands {
  @flags.string()
  declare model: string
}
```

```sh
make:controller --model user

# this.model = 'user'
```

Se o valor do sinalizador tiver espaços ou caracteres especiais, ele deve ser colocado entre aspas `""`.

```sh
make:controller --model blog user
# this.model = 'blog'

make:controller --model "blog user"
# this.model = 'blog user'
```

Um erro é exibido se o sinalizador for mencionado, mas nenhum valor for fornecido (mesmo quando o sinalizador for opcional).

```sh
make:controller
# Works! The optional flag is not mentioned

make:controller --model
# Error! Missing value
```

### Sinalizador numérico

A análise de um sinalizador numérico é semelhante ao sinalizador de string. No entanto, o valor é validado para garantir que seja um número válido.

Você pode criar um sinalizador numérico usando o decorador `@flags.number`.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class MakeUserCommand extends BaseCommands {
  @flags.number()
  declare score: number
}
```

### Sinalizador de matriz

O sinalizador de matriz permite o uso do sinalizador várias vezes ao executar um comando. Você pode definir um sinalizador de matriz usando o método `@flags.array`.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class MakeUserCommand extends BaseCommands {
  @flags.array()
  declare groups: string[]
}
```

```sh
make:user --groups=admin --groups=moderators --groups=creators

# this.groups = ['admin', 'moderators', 'creators']
```

## Nome e descrição do sinalizador

Por padrão, o nome do sinalizador é uma representação tracejada do nome da propriedade da classe. No entanto, você pode definir um nome personalizado por meio da opção `flagName`.

```ts
@flags.boolean({
  flagName: 'server'
})
declare startServer: boolean
```

A descrição do sinalizador é exibida na tela de ajuda. Você pode defini-la usando a opção `description`.

```ts
@flags.boolean({
  flagName: 'server',
  description: 'Starts the application server'
})
declare startServer: boolean
```

## Aliases de sinalizadores

Aliases os nomes abreviados para um sinalizador mencionado usando um único hífen (`-`). Um alias deve ser um único caractere.

```ts
@flags.boolean({
  aliases: ['r']
})
declare resource: boolean

@flags.boolean({
  aliases: ['s']
})
declare singular: boolean
```

Os aliases de sinalizadores podem ser combinados ao executar o comando.

```ts
make:controller -rs

# Same as
make:controller --resource --singular
```

## Valor padrão

Você pode definir o valor padrão para um sinalizador usando a opção `default`. O valor padrão é usado quando o sinalizador não é mencionado ou é mencionado sem um valor.

```ts
@flags.boolean({
  default: true,
})
declare startServer: boolean

@flags.string({
  default: 'sqlite',
})
declare connection: string
```

## Processando valor do sinalizador

Usando o método `parse`, você pode processar o valor do sinalizador antes que ele seja definido como propriedade de classe.

```ts
@flags.string({
  parse (value) {
    return value ? connections[value] : value
  }
})
declare connection: string
```

## Acessando todos os sinalizadores

Você pode acessar todos os sinalizadores mencionados ao executar o comando usando a propriedade `this.parsed.flags`. A propriedade flags é um objeto de par chave-valor.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class MakeControllerCommand extends BaseCommands {
  @flags.boolean()
  declare resource: boolean

  @flags.boolean()
  declare singular: boolean
  
  async run() {
    console.log(this.parsed.flags)
    
    /**
     * Names of flags mentioned but not
     * accepted by the command
     */
    console.log(this.parsed.unknownFlags)
  }
}
```
