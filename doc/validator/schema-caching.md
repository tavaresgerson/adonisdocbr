# Cache de esquema
O esquema criado usando o método `schema.create` é primeiro compilado para uma função executável e, em seguida, executado para validar os dados em relação às regras definidas.

O processo de compilação leva alguns milissegundos antes de a validação começar. No entanto, com base em suas expectativas de desempenho, você pode querer considerar o armazenamento em cache do esquema compilado e, portanto, não pagar a penalidade de compilação em cada solicitação.

## Usando o cacheKey
Você pode armazenar em cache um esquema definindo um único `cacheKey`. Você pode gerar essa chave de cache usando qualquer abordagem ou contar com `ctx.routeKey` durante uma solicitação HTTP.

```ts
await request.validate({
  schema: schema.create({...}),
  cacheKey: ctx.routeKey,
})
```

* A primeira chamada para `request.validate` compilará o esquema e salvará a saída em referência ao `cacheKey`.
* Até que `cacheKey` seja idêntico, o validador não recompilará o esquema.

## Advertências de cache
O armazenamento em cache em qualquer formato não é gratuito e o mesmo acontece com o armazenamento em cache do esquema. Se o seu esquema depende de valores de tempo de execução, o esquema de cache não dará o resultado desejado. Considere o seguinte exemplo:

* Você está criando um formulário que aceita o **estado** do usuário e sua **cidade**.
* As opções de cidade são baseadas no valor do **estado** selecionado.

```ts
/**
 * Supondo que as seguintes variáveis contenham dados
 */
const STATES = []
const CITIES = {}

export default class AddressValidator {
  public selectedState = this.ctx.request.input('state') // 👈

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(CITIES[this.selectedState] || [])
  })
}
```

Se você olhar o exemplo acima, as opções de enum para o `city` dependem do `selectedState` e podem variar com cada solicitação HTTP.

No entanto, uma vez que temos o cache de esquema ativado. As opções de enum após a primeira solicitação serão armazenadas em cache e não serão alteradas, mesmo se o usuário selecionar um estado diferente.

Agora que você entende como funciona o cache. Vamos explorar algumas maneiras diferentes de usar dados dinâmicos em seu esquema de validação.

### Desista do cache
A primeira opção é desistir do cache. Isso adicionará um atraso de alguns milissegundos às suas solicitações, mas oferece a API mais direta para usar valores de tempo de execução em sua definição de esquema.

### Crie uma chave única
Considerando o exemplo acima, você pode anexar o estado selecionado ao `cacheKey` e, portanto, cada estado terá sua cópia do esquema em cache. Por exemplo:

```ts
export default class AddressValidator {
  public selectedState = this.ctx.request.input('state')

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(CITIES[this.selectedState] || [])
  })

  public cacheKey = `${this.ctx.routeKey}-${selectedState}`
}
```

A abordagem acima tem seu próprio conjunto de desvantagens. Por exemplo, se houver 37 estados, haverá 37 cópias em cache do mesmo esquema com uma ligeira variação. Além disso, esse número aumentará exponencialmente se você precisar de mais de um valor dinâmico.

Desistir do armazenamento em cache é melhor do que armazenar muitos esquemas em cache com pequenas variações.

### Usando refs
Os Refs oferecem o melhor dos dois mundos. Você ainda pode armazenar em cache seu esquema e também fazer referência aos valores de tempo de execução dentro deles. A seguir está um exemplo do mesmo:

```ts
export default class AddressValidator {
  public selectedState = this.ctx.request.input('state')

  public refs = schema.refs({
    cities: CITIES[this.selectedState] || []
  })

  public schema = schema.create({
    state: schema.enum(STATES),
    city: schema.enum(this.refs.cities)
  })
}
```

Em vez de referenciar `CITIES[this.selectedState]` diretamente, você o move para o objeto `schema.refs` e, a partir daí, as cidades serão selecionadas em tempo de execução sem recompilar o esquema.

> Refs só funciona se a **regra de validação** ou o **tipo de esquema** suportá-los.

