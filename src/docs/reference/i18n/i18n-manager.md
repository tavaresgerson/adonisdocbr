# I18n Manager

A [classe do gerenciador I18n](https://github.com/adonisjs/i18n/blob/develop/src/I18nManager/index.ts) expõe a API para criar instâncias específicas de localidade da classe `I18n` e também estender os recursos padrão adicionando formatadores e carregadores personalizados.

Você pode importar a instância singleton da classe `I18nManager` da seguinte forma:

```ts
import I18n from '@ioc:Adonis/Addons/I18n'
```

## Métodos/Propriedades
A seguir está a lista de métodos/propriedades disponíveis na classe do Gerenciador I18n.

### `defaultLocale`
Uma referência somente leitura para o `defaultLocale` definido dentro do arquivo de configuração.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

console.log(I18n.defaultLocale)
```

### `locale`
Retorna uma instância da classe [I18n](./i18n.md) para uma localidade fornecida.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

const en = I18n.locale('en')
const fr = I18n.locale('fr')
```

### `getSupportedLocale`
Retorna a melhor localidade compatível para o(s) idioma(s) do usuário. O método usa a [negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) para encontrar a localidade compatível.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

const bestMatch = I18n.getSupportedLocale(['en', 'fr'])
```

### `getFallbackLocale`
Retorna a localidade de fallback para uma localidade fornecida. O método procura o objeto `fallbacks` definido no arquivo de configuração. Ele retorna o `defaultLocale` quando nenhuma fallback é encontrada.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.getFallbackLocale('ca')
```

### `supportedLocales`
Retorna uma matriz de localidades suportadas pelo aplicativo. O valor de configuração é usado quando definido explicitamente no arquivo de configuração. Caso contrário, inferiremos as localidades suportadas dos diretórios de idiomas.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.supportedLocales() // ['en', 'fr', 'it']
```

### `loadTranslations`
Carrega as traduções usando os carregadores configurados. As traduções são armazenadas em cache na memória.

Se você quiser atualizar as traduções, use o método [reloadTranslations](#reloadtranslations).

::: info NOTA
Este método é chamado automaticamente durante a inicialização do aplicativo.
:::

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

await I18n.loadTranslations()
```

### `reloadTranslations`
Recarrega as traduções de todos os carregadores configurados. Cada chamada para este método fará com que os carregadores busquem as traduções da fonte.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

await I18n.reloadTranslations()
```

### `getTranslations`
Retorna um objeto de traduções em cache. O objeto é uma cópia mesclada de todas as traduções carregadas de vários carregadores configurados.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.getTranslations()
```

### `getTranslationsFor`
Retorna as traduções para um determinado local.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.getTranslationsFor('en')
I18n.getTranslationsFor('fr')
```

### `getFormatter`
Retorna uma instância do formatador de traduções configurado.

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.getFormatter()
```

### `prettyPrint`
Um método auxiliar para imprimir de forma bonita a carga útil do evento `i18n:missing:translation`.

```ts
import Event from '@ioc:Adonis/Core/Event'
import I18n from '@ioc:Adonis/Addons/I18n'

Event.on('i18n:missing:translation', I18n.prettyPrint)
```

### `extend`
Estenda os recursos padrão adicionando formatadores e carregadores de traduções personalizados.

::: info NOTA
Certifique-se de ler o [guia de extensões](../../guides/digging-deeper/i18n.md#add-custom-message-formatter) para uma explicação detalhada sobre como adicionar formatadores e carregadores personalizados.
:::

```ts
import I18n from '@ioc:Adonis/Addons/I18n'

I18n.extend('name', 'formatter', () => new Impl())
I18n.extend('name', 'loader', () => new Impl())
```
