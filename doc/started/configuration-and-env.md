# Configuração

## Provedor de configuração
A primeira etapa para ter uma base de código sustentável é encontrar um local dedicado 
para armazenar a configuração do aplicativo.

AdonisJs usa o diretório `config`, onde todos os arquivos são carregados no momento da inicialização.

Você pode acessar os valores de configuração através do Provedor de configuração:

``` js
const Config = use('Config')
const appSecret = Config.get('app.appSecret')
```

Os valores de configuração são buscados usando o `Config.get` que aceita um argumento de string 
referenciando a chave que você deseja no formulário `fileName.key`.

Você pode buscar valores de configuração aninhados usando a notação de ponto:

``` js
// Exemplo de um arquivo de configuração, por exemplo database.js
{
  mysql: {
    host: '127.0.0.1',
  },
}

// Você pode recuperá-lo assim...
Config.get('database.mysql.host')
```

Se você não tiver certeza de que uma chave está definida na sua configuração, forneça um 
segundo argumento que será retornado como o valor padrão:

``` js
Config.get('database.mysql.host', '127.0.0.1')
```

Se você deseja alterar os valores de configuração na memória, use `Config.set`:

``` js
Config.set('database.mysql.host', 'db.example.com')
```

> `Config.set` alterará apenas o valor na memória. Não gravará o 
> novo valor no seu arquivo de configuração.

## Provedor env

Ao criar um aplicativo, convém uma configuração diferente com base no ambiente em que seu código está sendo executado.

Para cumprir esse requisito, o AdonisJs usa a biblioteca [dotenv](https://github.com/motdotla/dotenv).

Dentro da raiz de cada novo projeto do AdonisJs, você encontrará um arquivo `.env.example`. Se 
você usou a CLI do AdonisJs para instalar seu aplicativo, esse arquivo será automaticamente duplicado 
como `.env`. Caso contrário, você deve copiá-lo manualmente.

> O arquivo `.env` nunca deve ser adicionado no seu controle de versão ou compartilhado com outras pessoas.

O arquivo `.env` possui uma sintaxe `chave=valor`simples:
```
APP_SECRET=F7op5n9vx1nAkno0DsNgZm5vjNXpOLIq
DB_HOST=127.0.0.1
DB_USER=root
```

Você pode acessar os valores env usando o Prov Env:
``` js
const Env = use('Env')
const appSecret = Env.get('APP_SECRET')
```

Com o provedor de configuração, você pode fornecer um valor padrão como o segundo argumento:
``` js
Env.get('DB_USER', 'root')
```

`Env.get` sempre retorna a string. Se você deseja que um valor `Env` atue como booleano, 
será necessário verificá-lo por meio de uma declaração de igualdade condicional, da seguinte forma:

``` js
const myBoolean = Env.get('MY_BOOLEAN') === 'true'
```

### Gerando erros se uma variável de ambiente necessária não existir

Quando você precia de uma variável de ambiente necessária para executar seu aplicativo, 
poderá usar `Env.getOrFail()`, um erro será exibido se a variável necessária não estiver configurada.

> Se você deseja que seu aplicativo falhe rapidamente no momento da inicialização, 
> quando uma variável de ambiente está ausente, limite apenas o acesso a variáveis 
> de ambiente de dentro de seus arquivos de configuração e não use o Provedor Env 
> em nenhum outro lugar do aplicativo.

``` js
const Env = use('Env')
// Throw "Certifique-se de definir APP_SECRET dentro do arquivo .env."
Env.getOrFail('APP_SECRET')
```

### Localização do arquivo .env
Você pode querer carregar um arquivo .env diferente.

Isso pode ser feito usando a variável de ambiente ENV_PATH:
```
> ENV_PATH=/user/.env adonis serve
```

### Desativando o arquivo .env
Você pode usar diretamente as variáveis de ambiente no servidor em vez de retransmitir para um arquivo.

Isso pode ser feito usando a variável de ambiente ENV_SILENT:

```
> ENV_SILENT=true adonis serve
```

### Ambiente de teste
Se você estiver iniciando seu aplicativo com NODE_ENV definido como testing, 
o AdonisJs carregará seu arquivo `.env.testing` e mesclará seus valores sobre `.env`.

Isso é útil para definir credenciais diferentes ao testar sua base de código.
