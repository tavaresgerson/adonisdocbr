# Config

A configuração de tempo de execução de seu aplicativo AdonisJS é armazenada dentro do diretório `config`. O núcleo da estrutura e 
muitos dos pacotes instalados contam com esses arquivos de configuração. Certifique-se de verificar esses arquivos e 
ajustar todas as configurações (se necessário).

Também recomendamos armazenar todas as configurações personalizadas exigidas pelo seu aplicativo dentro deste diretório em 
vez de armazená-las em vários lugares.

### Acesse a configuração dentro do aplicativo
Você pode importar os arquivos de configuração dentro da base de código do seu aplicativo usando a instrução `import`. Por exemplo:

```ts
import { appKey } from 'Config/app'
```

Uma vez que registramos o diretório `config` como um alias dentro do `.adonisrc.json` e dos arquivos `tsconfig.json`, você também pode 
importar arquivos sem os caminhos relativos.

#### Acessar a configuração dentro de um pacote
Um pacote nunca deve confiar no caminho do arquivo de configuração diretamente e, em vez disso, usar o provedor `Config`.

Contar com o provedor `Config` dentro de um pacote cria um acoplamento fraco com a base de código do aplicativo e, seu pacote não 
será interrompido se o usuário final decidir armazenar os arquivos de configuração em um diretório separado.

#### Usando o provedor de configuração
Supondo que seu pacote dependa do arquivo `config/dummy.ts`. Você pode acessar seu valor usando o provedor de configuração da seguinte maneira.

```ts
export default class DummyPackageProvider {
  constructor(protected app: ApplicationContract) {}

  public register () {
    this.app.container.bind('Dummy/Package', () => {
      const Config = this.app
        .container
        .resolveBinding('Adonis/Core/Config')

      console.log(Config.get('dummy'))
    })
  }
}
```

O método `Config.get` retorna os valores exportados do nome de arquivo fornecido. Você pode ler valores aninhados usando a notação de ponto.

```ts
Config.get('app.appKey')
Config.get('database.connection')
```

Na base de código do seu aplicativo, você pode acessar o provedor de configuração da seguinte maneira.

```ts
import Config from '@ioc:Adonis/Core/Config'
Config.get('app.appKey')
```

#### Alterando o local da configuração
Você pode atualizar o local do diretório de configuração modificando o arquivo `.adonisrc.json`.

```json
"directories": {
  "config": "./configurations"
}
```

O provedor de configuração lerá automaticamente o arquivo do diretório recém-configurado e todos os pacotes subjacentes que dependem 
dos arquivos de configuração funcionarão bem.

#### Ressalvas
O provedor de configuração lê todos os arquivos de configuração dentro do diretório `config` durante a inicialização do aplicativo e, 
portanto, você não pode ter importações específicas de contêiner IoC dentro de seus arquivos de configuração.

Se qualquer parte de sua configuração depende das importações de contêineres IoC, você deve carregá-los lentamente, assim como o pacote `Auth` faz.

No entanto, há uma exceção a essa regra para os provedores `Application` e `Env`. Eles são configurados antes de ler os arquivos de configuração 
no ciclo de vida de inicialização do aplicativo.

#### Referência de configuração
Conforme você instala e configura os pacotes AdonisJS, eles podem criar novos arquivos de configuração. A seguir está uma lista de arquivos de 
configuração (com seus modelos padrão) usados pelas diferentes partes do framework.

| Arquivo de configuração	| Stub                  | Usado por                                 |
|-------------------------|-----------------------|-------------------------------------------|
| `app.ts`                | https://git.io/JfefZ  |	Usado pelo núcleo da estrutura, incluindo o servidor HTTP, o criador de logs, o validador e o gerenciador de ativos.|
| `bodyparser.ts`         | https://git.io/Jfefn	| Usado pelo middleware bodyparser          |
| `cors.ts`               |	https://git.io/JfefC	| Usado pelo gancho do servidor CORS        |
| `hash.ts`               | https://git.io/JfefW	| Usado pelo pacote hash                    |
| `session.ts`            |	https://git.io/JeYHp	| Usado pelo pacote de sessão               |
| `shield.ts`             |	https://git.io/Jvwvt	| Usado pelo pacote shield                  |
| `static.ts`             |	https://git.io/Jfefl	| Usado pelo servidor de arquivos estáticos |
| `auth.ts`               |	https://git.io/JY0mp	| Usado pelo pacote auth                    |
| `database.ts`	          | https://git.io/JesV9	| Usado por Lucid ORM                       |
| `mail.ts`	              | https://git.io/JvgAf	| Usado pelo pacote de email do AdonisJS    |
| `redis.ts`              | https://git.io/JemcF	| Usado pelo pacote Redis                   |
