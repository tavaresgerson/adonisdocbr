# Parciais

Como o nome sugere, parciais são uma maneira de extrair um pedaço de marcação para seu arquivo e então reutilizá-lo em vários modelos.

Manter o **cabeçalho**, **logotipo**, **rodapé** e **barra lateral** do site em seu arquivo são alguns casos de uso comuns para parciais.

## Exemplo básico

Vamos criar uma página da web padrão com um cabeçalho, barra lateral, principal e rodapé usando parciais.

#### 1. Crie a seguinte estrutura de arquivo

```sh
├── views
│   ├── partials
│   │   ├── footer.edge
│   │   ├── header.edge
│   │   └── sidebar.edge
│   └── home.edge
```

#### 2. Escreva o seguinte conteúdo dentro dos respectivos parciais

```edge
<!-- partials/header.edge -->

<header class="header"></header>
```

```edge
<!-- partials/sidebar.edge -->

<div class="sidebar"></div>
```

```edge
<!-- partials/footer.edge -->

<footer class="footer"></footer>
```

#### 3. Escreva a seguinte marcação dentro do arquivo `home.edge`.

```edge
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

#### 4. Resultado

![](/docs/assets/edge-partials-layout.webp)

## A tag `@include`

A tag `@include` é responsável por carregar e embutir os parciais.

- Ela aceita apenas um único argumento, ou seja, o caminho parcial relativo do diretório de visualizações
- O caminho também pode ser dinâmico. O que significa que você pode usar variáveis ​​para definir o caminho parcial
- O parcial tem acesso ao estado do modelo pai

Além disso, há uma tag adicional `@includeIf` para incluir o parcial, apenas quando uma determinada condição for `true`.

```edge
@includeIf(post.comments, 'partials/comments')
```
