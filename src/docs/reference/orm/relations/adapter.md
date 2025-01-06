# Adaptador

A classe BaseModel NÃO interage diretamente com os construtores de consultas. Em vez disso, ela depende da [classe do adaptador Model](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Adapter/index.ts) para construir as instâncias do construtor de consultas para diferentes operações de banco de dados.

Essa separação permite que você troque o adaptador com sua implementação personalizada para cobrir casos de uso avançados.

## Criando um adaptador personalizado
Todo adaptador personalizado deve aderir à interface `AdapterContract`.

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'
class MyAdapter implements AdapterContract {}
```

Você pode atribuir o adaptador ao modelo da seguinte forma:

```ts
class User extends BaseModel {
  public static $adapter = new MyAdapter()
}
```

## Métodos/Propriedades
A seguir está a lista de métodos/propriedades que todo adaptador deve ter.

### `modelConstructorClient`
Retorna o cliente de consulta para um determinado construtor de modelo.

```ts
import { AdapterContract, ModelAdapterOptions } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public modelConstructorClient(model: typeof BaseModel, options?: ModelAdapterOptions) {
    const connection = options?.connection || model.connection
    return connection ? Database.connection(connection) : Database.connection()
  }
}
```

### `modelClient`
Retorna o cliente de consulta para uma instância de modelo fornecida. A implementação padrão resolve o cliente da seguinte forma

- Retorna o cliente de transação se o modelo tiver a propriedade `$trx` definida
- Retorna o cliente de consulta para uma conexão fornecida se a instância de modelo tiver a propriedade `$options.connection` definida.
- Finalmente, procure a propriedade `connection` no construtor de modelo (também conhecida como propriedade de conexão estática).

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public modelClient(instance: BaseModel) {
  }
}
```

### `query`
Retorna a instância do construtor de consulta para um construtor de modelo fornecido. Os internos do método `Model.query` chamam o método `query` no adaptador.

```ts
import { AdapterContract, ModelAdapterOptions } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public query(model: typeof BaseModel, options?: ModelAdapterOptions) {
    return Database.modelQuery(model)
  }
}
```

### `insert`
Executa a operação de inserção para uma instância de modelo fornecida. O método recebe a instância de modelo e um objeto de atributos para inserir.

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public async insert(instance: BaseModel, attributes: any) {
  }
}
```

### `update`
Execute a operação de atualização para uma instância de modelo fornecida. O método recebe a instância de modelo e um objeto de atributos para atualizar.

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public async update(instance: BaseModel, dirtyAttributes: any) {
  }
}
```

### `delete`
Execute a operação de exclusão para uma instância de modelo fornecida. O método recebe apenas a instância de modelo.

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public async delete(instance: BaseModel) {
  }
}
```

### `refresh`
Atualize a instância de modelo executando uma consulta select e hidratando seus atributos. O método recebe apenas a instância de modelo.

```ts
import { AdapterContract } from '@ioc:Adonis/Lucid/Orm'

class MyAdapter implements AdapterContract {
  public async refresh(instance: BaseModel) {
  }
}
```
