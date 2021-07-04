# Parciais
Partials, como o nome sugere, é uma maneira de extrair um pedaço de marcação para seu próprio arquivo e, em seguida, 
reutilizá-lo em vários templates.

Manter o cabeçalho, o logotipo, o rodapé e a barra lateral do site em seu próprio arquivo são alguns casos de 
uso comuns para parciais.

### Exemplo básico
Vamos criar uma página da web padrão com cabeçalho, barra lateral, principal e rodapé usando parciais.

1. Crie a seguinte estrutura de arquivo
```
├── views
│   ├── partials
│   │   ├── footer.edge
│   │   ├── header.edge
│   │   └── sidebar.edge
│   └── home.edge
```

2. Escreva o seguinte conteúdo dentro dos respectivos parciais
```html
<!-- parcials/header.edge -->

<header class="header"></header>
```

```html
<!--parcials/sidebar.edge -->

<div class="sidebar"></div>
```

```html
<!-- parciais/footer.edge -->

<footer class="footer"></footer>
```

3. Escreva a seguinte marcação dentro do arquivo `home.edge`.
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <style>
    * { margin: 0; padding: 0; }
    .header { height: 60px; background: rgba(255,138,0,.2); }
    .layout { height: calc(100vh - 100px); display: flex; }
    .sidebar { height: 100%; background: rgba(156, 39, 176, 0.2); width: 250px; }
    main { height: 100%; background: #f7f7f7; flex: 1 }
    .footer { height: 40px; background: #5e5e5e; }
  </style>
</head>
<body>
  @include('partials/header')

  <section class="layout">
    @include('partials/sidebar')
    <main></main>
  </section>

  @include('partials/footer')
</body>
</html>
```
4. Resultado

<p align="center">
  <img src="/assets/edge-partials-layout.png" width="400" />
</p>

### A tag `@include`
A tag `@include` é responsável por carregar e inserir os parciais.

* Ele aceita apenas um único argumento, que é o caminho parcial relativo ao diretório de visualizações
* O caminho também pode ser dinâmico. O que significa que você pode usar variáveis para definir o caminho parcial
* O parcial tem acesso ao estado do template pai

Além disso, há uma tag `@includeIf` adicional para incluir o parcial, somente quando uma determinada condição for true.

```edge
@includeIf(post.comments, 'partials/comments')
```
