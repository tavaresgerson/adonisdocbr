---
Resumo: Prompts são widgets de terminal para entrada do usuário, usando o pacote @poppinss/prompts. Eles suportam vários tipos como entrada, senha e seleção, e são projetados para fácil integração de testes.
---

# Prompts

Prompts são widgets de terminal interativos que você pode usar para aceitar a entrada do usuário. Os prompts Ace são alimentados pelo pacote [@poppinss/prompts](https://github.com/poppinss/prompts), que suporta os seguintes tipos de prompt.

- input
- list
- password
- confirm
- toggle
- select
- multi-select
- autocomplete

Os prompts Ace são criados com testes em mente. Ao escrever testes, você pode capturar prompts e responder a eles programaticamente.

Veja também: [Testando comandos ace](../testing/console_tests.md)

## Exibindo um prompt

Você pode exibir prompts usando a propriedade `this.prompt` disponível em todos os comandos Ace.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    const modelName = await this.prompt.ask('Enter the model name')
    
    console.log(modelName)
  }
}
```

## Opções de prompt

A seguir está a lista de opções aceitas por prompts. Você pode consultar esta tabela como a única fonte da verdade.

<table>
<tr>
<td width="110px">Opção</td>
<td width="120px">Aceito por</td>
<td>Descrição</td>
</tr>
<tr>
<td>

`default` (String) 

</td>

<td>

Todos os prompts

</td>

<td>

The default value to use when no value is entered. In the case of `select`, `multiselect`, and `autocomplete` prompts, the value must be the choices array index.

</td>
</tr>

<tr>
<td>

`name` (String)

</td>

<td>

Todos os prompts

</td>

<td>

The unique name for the prompt

</td>
</tr>

<tr>
<td>

`hint` (String)

</td>

<td>

Todos os prompts

</td>

<td>

The hint text to display next to the prompt

</td>
</tr>
<tr>
<td>

`result` (Function)

</td>

<td>Todos os prompts</td>
<td>

Transforme o valor de retorno do prompt. O valor de entrada do método `result` depende do prompt. Por exemplo, o valor do prompt `multiselect` será um array de escolhas selecionadas.

```ts
{
  result(value) {
    return value.toUpperCase()
  }
}
```

</td>
</tr>

<tr>
<td>

`format` (Function)

</td>

<td>Todos os prompts</td>

<td>

Formate ao vivo o valor de entrada conforme o usuário digita. A formatação é aplicada somente à saída CLI, não ao valor de retorno.

```ts
{
  format(value) {
    return value.toUpperCase()
  }
}
```

</td>
</tr>

<tr>
<td>

`validate` (Function)

</td>

<td>Todos os prompts</td>

<td>

Valide a entrada do usuário. Retornar `true` do método passará na validação. Retornar `false` ou uma string de mensagem de erro será considerado uma falha.

```ts
{
  format(value) {
    return value.length > 6
    ? true
    : 'Model name must be 6 characters long'
  }
}
```

</tr>

<tr>
<td>

`limit` (Number)

</td>

<td>

`autocomplete`

</td>

<td>

Limite o número de opções a serem exibidas. Você terá que rolar para ver o restante das opções.

</td>
</tr>
</table>


## Entrada de texto

Você pode renderizar o prompt para aceitar entrada de texto usando o método `prompt.ask`. O método aceita a mensagem do prompt como o primeiro parâmetro e o [objeto de opções](#prompt-options) como o segundo parâmetro.

```ts
await this.prompt.ask('Enter the model name')
```

```ts
// Validate input
await this.prompt.ask('Enter the model name', {
  validate(value) {
    return value.length > 0
  }
})
```

```ts
// Default value
await this.prompt.ask('Enter the model name', {
  default: 'User'
})
```

## Entrada mascarada

Como o nome sugere, o prompt de entrada mascarado mascara a entrada do usuário no terminal. Você pode exibir o prompt mascarado usando o método `prompt.secure`.

O método aceita a mensagem do prompt como o primeiro parâmetro e o [objeto de opções](#prompt-options) como o segundo parâmetro.

```ts
await this.prompt.secure('Enter account password')
```

```ts
await this.prompt.secure('Enter account password', {
  validate(value) {
    return value.length < 6
      ? 'Password must be 6 characters long'
      : true
  }
})
```

## Lista de escolhas

Você pode exibir uma lista de escolhas para uma única seleção usando o método `prompt.choice`. O método aceita os seguintes parâmetros.

1. Mensagem de prompt.
2. Uma matriz de escolhas.
3. [Objeto de opções](#prompt-options) opcional.

```ts
await this.prompt.choice('Select package manager', [
  'npm',
  'yarn',
  'pnpm'
])
```

Para mencionar um valor de exibição diferente, você pode definir opções como objetos. A propriedade `name` é retornada como o resultado do prompt, e a propriedade `message` é exibida no terminal.

```ts
await this.prompt.choice('Select database driver', [
  {
    name: 'sqlite',
    message: 'SQLite'
  },
  {
    name: 'mysql',
    message: 'MySQL'
  },
  {
    name: 'pg',
    message: 'PostgreSQL'
  }
])
```

## Escolhas de seleção múltipla

Você pode usar o método `prompt.multiple` para permitir seleções múltiplas na lista de escolhas. Os parâmetros aceitos são os mesmos do prompt `choice`.

```ts
await this.prompt.multiple('Select database drivers', [
  {
    name: 'sqlite',
    message: 'SQLite'
  },
  {
    name: 'mysql',
    message: 'MySQL'
  },
  {
    name: 'pg',
    message: 'PostgreSQL'
  }
])
```

## Confirmar ação

Você pode exibir um prompt de confirmação com opções `Sim/Não` usando o método `prompt.confirm`. O método aceita a mensagem de prompt como o primeiro parâmetro e o [objeto de opções](#prompt-options) como o segundo parâmetro.

O prompt `confirm` retorna um valor booleano.

```ts
const deleteFiles = await this.prompt.confirm(
  'Want to delete all files?'
)

if (deleteFiles) {
}
```

Para personalizar o valor de exibição das opções `Sim/Não`, você pode usar o método `prompt.toggle`.

```ts
const deleteFiles = await this.prompt.toggle(
  'Want to delete all files?',
  ['Yup', 'Nope']
)

if (deleteFiles) {
}
```

## Preenchimento automático

O prompt `autocomplete` é uma combinação do prompt de seleção e do prompt de seleção múltipla, mas com a capacidade de fazer uma busca difusa das opções.

```ts
const selectedCity = await this.prompt.autocomplete(
  'Select your city',
  await getCitiesList()
)
```
