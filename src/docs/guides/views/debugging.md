# Depuração

O Edge fornece algumas opções para depurar os modelos. A mais simples é o auxiliar global `inspect`. Este método imprime qualquer valor que você fornecer a ele e o outro é a tag `@debugger`.

## O auxiliar `inspect`

O auxiliar `inspect` imprime o valor na mesma saída. Você pode pensar neste método como o `util.inspect` do Node.js, mas em vez disso ele emite HTML em vez de escrever a saída no console.

```edge
{{ inspect({
  a: 1,
  b: [3, 4, undefined, null],
  c: undefined,
  d: null,
  e: {
    regex: /^x/i,
    buf: Buffer.from('abc'),
    holes: holes
  },
  balance: BigInt(100),
  id: Symbol('1234'),
  scores: new Set([1, 2, 3]),
  classes: new Map([['english', '1st'], ['maths', '2nd']]),
  currentScores: new WeakSet([[1, 2, 3]]),
  currentClasses: new WeakMap([[['english', '1st'], ['maths', '2nd']]]),
  now: new Date()
}) }}
```

#### Saída

![](/docs/assets/edge-inspect.webp)

## A tag `@debugger`

A tag `@debugger` descarta um ponto de interrupção do depurador dentro do código JavaScript compilado e você pode depurar a função de saída usando os [métodos de depuração Node.js](https://nodejs.org/api/debugger.html) padrão

Basta soltar o `@debugger` na posição em que você deseja que o depurador pause.

```edge
@debugger
<p> Hello {{ user.username }} </p>
```

Execute o servidor Node com o sinalizador `--inspect` e use o Chrome para depurar.

```sh
node ace serve --watch --node-args="--inspect"
```

<video src="/docs/assets/edge-debugger.mp4" controls />
