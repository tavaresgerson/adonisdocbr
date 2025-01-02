# inspect

The global helper to inspect a value or the entire state of the template. The helper method can pretty print the following JavaScript primitives.

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

Output

![](/docs/assets/edge-inspect.webp)

You can inspect the state of the entire view using the state variable.

```ts
inspect(state)
```
