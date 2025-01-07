# `stringify`

O método `stringify` é muito semelhante ao `JSON.stringify`, mas escapou certos caracteres HTML para evitar ataques XSS ao passar dados do backend para o script frontend.

Considere o exemplo a seguir.

```edge
@set('userInput', "</script><script>alert('bad actor')</script>")

<script>
  console.log({{{ JSON.stringify(userInput) }}})
  console.log({{{ stringify(userInput) }}})
</script>
```

O uso de `JSON.stringify` executará o código como HTML, enquanto o método `stringify` não. Portanto, é recomendável converter suas estruturas de dados de backend em uma string JSON usando o auxiliar `stringify`.
