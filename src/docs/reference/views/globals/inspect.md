# `inspect`

O helper global para inspecionar um valor ou o estado inteiro do template. O método helper pode imprimir as seguintes primitivas JavaScript.

```edge
{{
  inspect({
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
  })
}}
```

Saída

![](/docs/assets/edge-inspect.webp)

Você pode inspecionar o estado de toda a view usando a variável state.

```ts
inspect(state)
```
