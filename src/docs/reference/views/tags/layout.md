# layout/section/super

A tag `@layout` permite que você defina o modelo de layout para o modelo atual.

- A tag deve ser usada na primeira linha do modelo. Caso contrário, será ignorada.
- É uma tag inline e aceita o caminho do layout.
- Você não pode definir um layout em tempo de execução. O valor deve ser uma string estática, pois os layouts são processados ​​em tempo de compilação.

```edge
@layout('layouts/main')
```

## `section`
O modelo que usa o layout deve definir toda a marcação dentro das seções exportadas pelo layout. Qualquer conteúdo fora da tag `@section` é ignorado.

- `@section` é uma tag de nível de bloco.
- Ela aceita o nome da seção como o único argumento.
- O nome da seção deve ser uma string estática. Valores de tempo de execução não são permitidos.
- Todas as tags de seção devem aparecer como tags de nível superior. O que significa que você não pode aninhar uma seção dentro de uma condicional ou um loop.

```edge
@layout('layouts/main')

@section('body')
  The content for the body section
@end

@section('footer')
  The content for the footer section
@end
```

O layout também precisa exportar as seções com o mesmo nome.

```edge
@!section('body')
@!section('footer')
```

## `super`
A tag `@super` permite que você herde o conteúdo existente da seção. É uma tag inline e não aceita argumentos.

```edge
@layout('layouts/main')

@section('scripts')
  @super
  <script src="{{ asset('autocomplete.js') }}"></script>
@end
```
