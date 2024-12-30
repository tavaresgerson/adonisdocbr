# Semeadores de banco de dados

O semeador de banco de dados é uma maneira de configurar seu aplicativo com alguns dados iniciais necessários para executar e usar o aplicativo. Por exemplo:

- Criar um semeador para inserir **países**, **estados** e **cidades** antes de implantar e executar seu aplicativo.
- Ou um semeador para inserir usuários dentro do banco de dados para desenvolvimento local.

Os semeadores são armazenados dentro do diretório `database/seeders`. Você pode criar um novo arquivo semeador executando o seguinte comando Ace.

```sh
node ace make:seeder User

# CREATE: database/seeders/User.ts
```

Cada arquivo semeador deve estender a classe `BaseSeeder` e implementar o método `run`.

O exemplo a seguir usa um modelo Lucid para criar vários usuários. No entanto, você também pode usar o construtor de consultas do banco de dados diretamente. **Em outras palavras, os semeadores não se importam com o que você escreve dentro do método `run`**.

```ts
// database/seeders/User.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

  public async run () {
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret',
      },
      {
        email: 'romain@adonisjs.com',
        password: 'supersecret'
      }
    ])
  }

}
```

## Executando seeders
Você pode executar todos ou alguns seeders de banco de dados executando o seguinte comando Ace.

```sh
# executa tudo
node ace db:seed
```

Você pode definir o sinalizador `--files` várias vezes para executar mais de um arquivo. Além disso, você terá que definir o caminho completo para o arquivo do seeder. **Optamos pelo caminho completo porque o shell do seu terminal pode completar o caminho automaticamente para você.**

```sh
node ace db:seed --files "./database/seeders/User.ts"
```

Você também pode selecionar os arquivos do seeder interativamente executando o comando `db:seed` no modo interativo.

```sh
node ace db:seed -i
```

<video src="/docs/assets/db-seed-interactive.mp4" controls />

## Semeadores específicos do ambiente
O Lucid permite que você marque um arquivo de semeador para ser executado somente em um ambiente específico alterando a propriedade `environment`. Isso garante que você não semeie seu banco de dados de produção, teste ou desenvolvimento com dados que não deseja por engano.

Os semeadores que usam o sinalizador `environment` só serão executados quando a variável de ambiente `NODE_ENV` estiver definida para seu respectivo valor.

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class UserSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run () {
  }
}
```

## Operações idempotentes
**Ao contrário das migrações, não há um sistema de rastreamento em vigor para os semeadores do banco de dados**. Em outras palavras, executar um semeador várias vezes executará as inserções várias vezes também.

Com base na natureza de um seeder, você pode ou não querer esse comportamento. Por exemplo:

- Não tem problema executar um `PostSeeder` várias vezes e aumentar o número de postagens que você tem no banco de dados.
- Por outro lado, você desejaria que o `CountrySeeder` realizasse inserções apenas uma vez. Esses tipos de seeders são idempotentes.

Felizmente, os modelos Lucid têm suporte integrado para operações idempotentes usando `updateOrCreate` ou `fetchOrCreateMany`. Continuando com o `CountrySeeder`, o seguinte é um exemplo de criação de países apenas uma vez.

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'

export default class CountrySeeder extends BaseSeeder {

  public async run () {
    const uniqueKey = 'isoCode'

    await Country.updateOrCreateMany(uniqueKey, [
      {
        isoCode: 'IN',
        name: 'India',
      },
      {
        isoCode: 'FR',
        name: 'France',
      },
      {
        isoCode: 'TH',
        name: ' Thailand',
      },
    ])
  }

}
```

No exemplo acima, o método `updateOrCreateMany` procurará por linhas existentes dentro do banco de dados usando o código `isoCode` e inserirá apenas as que faltam e, portanto, executar o `CountrySeeder` várias vezes não inserirá linhas duplicadas.

## Personalizando a conexão do banco de dados
O comando `db:seed` aceita um sinalizador opcional `--connection` e o encaminha para os arquivos do seeder como uma propriedade `connection`. A partir daí, você pode usar essa propriedade para definir a conexão apropriada durante suas interações de modelo. Por exemplo:

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

  public async run () {
    await User.create({
      email: 'virk@adonisjs.com',
      password: 'secret',
    }, {
      connection: this.connection, // 👈
    })
  }

}
```

Agora você pode especificar o sinalizador `--connection` no seu comando `db:seed`, e o `UserSeeder` o usará.

```sh
node ace db:seed --connection=tenant-1
```

## Configuração dos seeders
A configuração dos seeders é armazenada dentro do arquivo `config/database.ts` sob o objeto de configuração da conexão.

#### caminhos
Defina os caminhos para carregar os arquivos do seeder do banco de dados. Você também pode definir um caminho para um pacote instalado.

```ts
{
  mysql: {
    client: 'mysql2',
    seeders: {
      paths: ['./database/seeders', '@somepackage/seeders-dir']
    }
  }
}
```

## Personalizando a ordem dos seeders
O comando `db:seed` executa todos os seeders na ordem em que estão armazenados no sistema de arquivos.

Se você quiser que certos seeders sejam executados antes dos outros, você pode **prefixar um contador aos nomes dos arquivos** ou **criar um diretório do seeder principal** da seguinte forma.

#### Etapa 1. Crie o seeder principal
Crie o arquivo do seeder principal executando o seguinte comando Ace.

```sh
node ace make:seeder MainSeeder/index

# CREATE: database/seeders/MainSeeder/Index.ts
```

#### Etapa 2. Registre seu caminho dentro da configuração `seeders`
Abra o arquivo `config/database.ts` e registre o caminho para o diretório **Main seeder** dentro da configuração de conexão.

Após a seguinte alteração, o comando `db:seed` escaneará o diretório `./database/seeders/MainSeeder`.

```ts
{
  mysql: {
    client: 'mysql2',
    // ... rest of the config
    seeders: {
      paths: ['./database/seeders/MainSeeder']
    }
  }  
}
```

#### Etapa 3. Importe outros seeders dentro do seeder principal
Agora, você pode importar manualmente todos os seeders dentro do arquivo **Main seeder** e executá-los em qualquer ordem que desejar.

::: info NOTA
A seguir está um exemplo de implementação do Main seeder. Sinta-se à vontade para personalizá-lo conforme suas necessidades.
:::

```ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Não execute quando não estiver em um ambiente especificado no Seeder
     */
    if (
      (!Seeder.default.environment.includes('development') && Application.inDev)
      || (!Seeder.default.environment.includes('testing') && Application.inTest)
      || (!Seeder.default.environment.includes('production') && Application.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../Category'))
    await this.runSeeder(await import('../User'))
    await this.runSeeder(await import('../Post'))
  }
}
```

#### Etapa 4. Execute o comando `db:seed`

```sh
node ace db:seed

# completed database/seeders/MainSeeder/Index
```
