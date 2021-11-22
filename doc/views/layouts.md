# Layouts
Os layouts do edge permitem definir o layout principal das páginas e, a seguir, substituir seções específicas conforme necessário.

## Exemplo básico
Vamos criar uma página da web padrão usando layouts.

1. Crie a seguinte estrutura de arquivo
```
.
├── views
│   ├── layouts
│   │   └── main.edge
│   └── home.edge
```

2. Cole a seguinte marcação no arquivo de layout:
```html
<!-- resources/views/layouts/main.edge -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
  </head>
  <body>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    </nav>

    @!section('body')

    <footer class="footer">
    </footer>
  </body>
</html>
-->

3. Cole a seguinte marcação no arquivo `resources/views/home.edge`.
```html
<!-- resources/views/home.edge -->

@layout('layouts/main')
@set('title', 'Home page')

@section('body')
  <section class="hero is-warning">
    <div class="hero-body">
      <p class="title">
        Title
      </p>
      <p class="subtitle">
        Subtitle
      </p>
    </div>
  </section>
@end
```

4. Renderize a visualização e você terá o seguinte resultado

<img src="/assets/edge-layout.png" />

## A tag `layout`
A tag de layout é usada para definir o layout de um determinado modelo.

* Deve aparecer na primeira linha do modelo. Caso contrário, será ignorado.
* Você só pode usar um layout por modelo
* O nome do layout deve ser estático e não pode ser definido usando variáveis de tempo de execução.

## A tag `section`

A tag de seção é um espaço reservado exposto por um layout para injetar conteúdo. Um layout pode definir quantas seções desejar e o modelo pai pode substituí-las quando necessário.

No exemplo a seguir, o layout renderiza as tags de scripts dentro da seção `scripts`. Isso permite que todas as páginas usem esses scripts ou os substituam completamente, redefinindo a mesma seção com tags de script diferentes.

#### Layout

```edge
@section('scripts')
  <script src="./vendor.js"></script>
  <script src="./app.js"></script>
@end
```
### Modelo pai substituindo tudo
```edge
@section('scripts')
  <script src="./vendor.js"></script>
  <script src="./admin.js"></script>
@end
```

### Modelo pai anexado a scripts existentes
```edge
@section('scripts')
  @super {{-- Super significa herdar --}}
  <script src="./autocomplete.js"></script>
@end
```

* O nome de todas as tags de seção deve ser exclusivo.
* O nome da seção deve ser estático e não pode ser definido usando variáveis de tempo de execução.
* Você não pode ter seções aninhadas.
* Todas as seções devem estar no nível superior. Essa restrição é semelhante às exportações ESM em JavaScript, onde cada instrução `export` está no nível superior e é única.

