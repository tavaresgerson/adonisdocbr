# Fábricas de Modelos

Você pode definir uma fábrica de modelos para um determinado modelo usando o método `Factory.define`. O método aceita a referência do modelo como o primeiro argumento e um retorno de chamada para configurar os valores padrão como o segundo argumento.

```ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

Factory
  .define(User, ({ faker }) => {
    return {
      fullName: faker.name.findName(),
      email: faker.internet.email(),
    }
  })
  .onMerge(() => {
  })
```

O método `define` retorna uma instância do [FactoryModel](https://github.com/adonisjs/lucid/blob/develop/src/Factory/FactoryModel.ts)
