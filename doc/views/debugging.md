# Depurando
O Edge oferece algumas opções para depurar os modelos. O mais simples é o ajudante global `inspect`. Este método imprime qualquer valor que você forneça a ele e o outro é a tag `@debugger`.

## O ajudante `inspect`
O auxiliar `inspect` imprime muitos valores na mesma saída. Você pode pensar neste método como o Node.js `util.inspect`, mas em vez disso, ele produz HTML em vez de gravar a saída no console.

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

**Saída**
<img src="/assets/edge-inspect.png" />
 
## A tag `@debugger`
A tag `@debugger` descarta um ponto de interrupção do depurador dentro do código JavaScript compilado e você pode depurar a função de saída usando os métodos de depuração padrão do Node.js.

Apenas coloque o `@debugger` na posição em que deseja que o depurador faça uma pausa.

```edge
@debugger
<p> Hello {{ user.username }} </p>
```

Execute o servidor Node com o sinalizador `--inspects` e use o Chrome para depurar.

```bash
node ace serve --watch --node-args="--inspect"
```
<p align="center">
  <img width="600" src="https://github.com/tavaresgerson/adonisdocbr/blob/master/assets/edge-debugger.gif" />
</p>
