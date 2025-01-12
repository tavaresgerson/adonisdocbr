---
summary: Provedores de serviços são classes JavaScript simples com métodos de ciclo de vida para executar ações durante diferentes fases do aplicativo.
---

# Provedores de serviços

Provedores de serviços são classes JavaScript simples com métodos de ciclo de vida para executar ações durante diferentes fases do aplicativo.

Um provedor de serviços pode registrar [vinculações no contêiner](../concepts/dependency_injection.md#container-bindings), [estender vinculações existentes](../concepts/dependency_injection.md#container-events) ou executar ações após o servidor HTTP iniciar.

Provedores de serviços são o ponto de entrada para um aplicativo AdonisJS com a capacidade de modificar o estado do aplicativo antes que ele seja considerado pronto. **Ele é usado principalmente por pacotes externos para se conectar ao ciclo de vida do aplicativo**.

:::note
Se você deseja injetar dependências apenas em uma de suas classes, pode usar o recurso [injeção de dependência](../concepts/dependency_injection.md).
:::

Os provedores são registrados dentro do arquivo `adonisrc.ts` sob o array `providers`. O valor é uma função para importar preguiçosamente o provedor de serviços

```ts
{
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('./providers/app_provider.js'),
  ]
}
```

Por padrão, um provedor é carregado em todos os ambientes de tempo de execução. No entanto, você pode limitar o provedor para executar em ambientes específicos.

```ts
{
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    {
      file: () => import('./providers/app_provider.js'),
      environment: ['web', 'repl']
    }
  ]
}
```

## Escrevendo provedores de serviços

Os provedores de serviços são armazenados dentro do diretório `providers` do seu aplicativo. Como alternativa, você pode usar o comando `node ace make:provider app`.

O módulo do provedor deve ter uma instrução `export default` retornando a classe do provedor. O construtor da classe recebe uma instância da classe [Application](./application.md).

Veja também: [Comando Make provider](../references/commands.md#makeprovider)

```ts
import { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {
  }
}
```

A seguir estão os métodos de ciclo de vida que você pode implementar para executar diferentes ações.

```ts
export default class AppProvider {
  register() {
  }
  
  async boot() {
  }
  
  async start() {
  }
  
  async ready() {
  }
  
  async shutdown() {
  }
}
```

### `register`

O método `register` é chamado após uma instância da classe provider ser criada. O método `register` pode registrar ligações dentro do contêiner IoC.

O método `register` é síncrono, então você não pode usar Promises dentro deste método.

```ts
export default class AppProvider {
  register() {
    this.app.container.bind('db', () => {
      return new Database()
    })
  }
}
```

### `boot`

O método `boot` é chamado após todas as ligações terem sido registradas com o contêiner IoC. Dentro deste método, você pode resolver ligações do contêiner para estendê-las/mutá-las.

```ts
export default class AppProvider {
  async boot() {
   const validator = await this.app.container.make('validator')
    
   // Add custom validation rules
   validator.rule('foo', () => {})
  }
}
```

É uma boa prática estender as ligações quando elas são resolvidas do contêiner. Por exemplo, você pode usar o hook `resolving` para adicionar regras personalizadas ao validador.

```ts
async boot() {
  this.app.container.resolving('validator', (validator) => {
    validator.rule('foo', () => {})
  })
}
```

### `start`

O método `start` é chamado depois do `boot` e antes do método `ready`. Ele permite que você execute ações que as ações do hook `ready` podem precisar.

### `ready`

O método `ready` é chamado em diferentes estágios com base no ambiente do aplicativo.

<table>
<tr>
<td width="100"><code> web </code></td>
<td>O método <code>ready</code> é chamado depois que o servidor HTTP é iniciado e está pronto para aceitar solicitações.</td>
</tr>
<tr>
<td width="100"><code>console</code></td>
<td>O método <code>ready</code> é chamado logo antes do método <code>run</code> do comando principal.</td>
</tr>
<tr>
<td width="100"><code>test</code></td>
<td>O método <code>ready</code> é chamado logo antes de executar todos os testes. No entanto, os arquivos de teste são importados antes do método <code>ready</code>.</td>
</tr>
<tr>
<td width="100"><code>repl</code></td>
<td>O método <code>ready</code> é chamado antes que o prompt REPL seja exibido no terminal.</td>
</tr>
</table>

```ts
export default class AppProvider {
  async start() {
    if (this.app.getEnvironment() === 'web') {
    }

    if (this.app.getEnvironment() === 'console') {
    }

    if (this.app.getEnvironment() === 'test') {
    }

    if (this.app.getEnvironment() === 'repl') {
    }
  }
}
```

### `shutdown`

O método `shutdown` é chamado quando o AdonisJS está no meio de sair do aplicativo normalmente.

O evento de sair do aplicativo depende do ambiente em que o aplicativo está sendo executado e de como o processo do aplicativo foi iniciado. Leia o [guia do ciclo de vida do aplicativo](./application_lifecycle.md) para saber mais sobre ele.

```ts
export default class AppProvider {
  async shutdown() {
    // perform the cleanup
  }
}
```
