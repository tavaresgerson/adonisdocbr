# Form Builder

A criação de formulários facilita a criação de formulários HTML rápidos e fáceis de manter. Pense em uma situação em que você define a ação do formulário para uma rota registrada e, quando a definição da rota é alterada, você precisa retornar às visualizações para garantir que sua ação do formulário aponte para a URL correta.

O Form Builder fornece a API para vincular rotas e controladores diretamente aos seus formulários, facilitando a realização de alterações em um só lugar e o mesmo é refletido em suas visualizações.

## Exemplo básico
Vamos dar um exemplo de criação de um novo formulário de usuário usando o Form Builder.

```js
// Route

Route.post('/users', 'UserController.store')
```

```twig
<!-- View -->

{{ form.open({action: 'UserController.store'}) }}

  {{ csrfField }}

  <div class="field">
    {{ form.label('username', 'Choose a username') }}
    {{ form.text('username') }}
  </div>

  <div class="field">
    {{ form.label('email', 'Enter email address') }}
    {{ form.text('email') }}
  </div>

  <div class="field">
    {{ form.label('password', 'Choose a strong password') }}
    {{ form.password('password') }}
  </div>

  <div class="button">
    {{ form.submit('Register') }}
  </div>

{{ form.close() }}
```

`form.open` permite que você vincule a ação do controlador de rota, o que significa que se mais tarde você alterar a URL da rota de `/users` para outra coisa, não precisará fazer alterações dentro da sua visualização, pois ela está vinculada ao controlador.

## Abrir/Fechar Formulários
O método `form.open` pode configurar a *ação* e o *método* do formulário usando uma das seguintes propriedades.

#### action:
Buscar ação e método do formulário usando o método do controlador.
```twig
{{ form.open({action: 'UserController.update'}) }}
{{ form.close() }}
```

#### route:
Buscar ação e método do formulário usando o nome da rota.

```twig
{{ form.open({route: 'users.store'}) }}
{{ form.close() }}
```

#### url:
Defina manualmente uma url e um método de formulário personalizados.

```twig
{{ form.open({url: '/users', method: 'POST'}) }}
{{ form.close() }}
```

#### params:
Passando parâmetros de rota como um objeto. As propriedades *action* e *route* usarão os parâmetros para formar a URL correta
```twig
{{ form.open({ action: 'UserController.update', params: {id: 1} }) }}
{{ form.close() }}
```

## Upload de arquivos
Para fazer upload de arquivos usando o construtor de formulários, você precisa definir a propriedade `files` como true no método `open`.

```twig
{{ form.open({ action: 'UserController.store', files: true }) }}

  <div class="field">
    {{ form.file('avatar') }}
  </div>

{{ form.close() }}
```

## Métodos do construtor de formulários
Aqui está a lista de todos os métodos disponíveis na instância do construtor de formulários.

#### label
```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

```html
<!-- Output -->

<label name="username"> Enter Username </label>
```

#### text
```twig
{{ form.text('username') }}
{{ form.text('username', 'John', {class: 'input'}) }}
```

```html
<!-- Output -->

<input type="text" name="username" value="John" class="input" />
```

Assim como `text`, você pode criar campos de entrada para todos os tipos fornecidos.

| Input type  | Method            |
|-------------|-------------------|
| password    | form.password()   |
| email       | form.email()      |
| color       | form.color()      |
| date        | form.date()       |
| url         | form.url()        |
| search      | form.search()     |
| hidden      | form.hidden()     |

#### file
Crie um botão de upload de arquivo

```twig
{{ form.file('avatar') }}
```

#### textarea
```twig
{{ form.textarea('description') }}
{{ form.textarea('description', value) }}
{{ form.textarea('description', value, {class: 'big'}) }}
```

#### radio
```twig
{{ form.radio('gender', 'male') }}
{{ form.radio('gender', 'female', true) }}
```

#### checkbox
```twig
{{ form.checkbox('terms', 'agree') }}
{{ form.checkbox('terms', 'agree', true) }}
```

#### select
```twig
{{ form.select('countries', ['India', 'US', 'UK'], null, 'Select Country') }}
```

```html
<!-- Output -->

<select name="countries">
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="US">US</option>
  <option value="UK">UK</option>
</select>
```

Além disso, você pode passar um objeto de pares chave/valor no lugar do array simples.

```twig
{{ form.select('countries', {ind: 'India', us: 'Usa'}) }}
```

```html
<!-- Output -->

<select name="countries">
  <option value="ind">India</option>
  <option value="us">US</option>
</select>
```

Você também pode definir opções *selecionadas* para uma caixa de seleção.

```twig
{{ form.select(
    'countries',
    {ind: 'India', us: 'Usa', uk: 'UK'},
    ['ind', 'us'],
    'Select Country',
    {multiple: true}
  )
}}
```

```html
<!-- Output -->

<select name="countries" multiple>
  <option value="">Select Country</option>
  <option value="ind" selected>India</option>
  <option value="us" selected>US</option>
  <option value="us">US</option>
</select>
```

#### selectRange
Crie uma caixa de seleção com múltiplas opções dentro do intervalo fornecido.

```twig
{{ form.selectRange('days', 1, 30) }}
```

```html
<!-- Output -->

<select name="days">
  <option value="1">1</option>
  <option value="2">3</option>
  <option value="3">3</option>
  ...
</select>
```

#### submit
```twig
{{ form.submit('Create Account', 'create') }}
```

```html
<!-- Output -->

<input type="submit" name="create" value="Create Account" />
```

#### button
```twig
{{ form.button('Create Account', 'create') }}
```

```html
<!-- Output -->

<button type="submit" name="create"> Create Account </button>
```

#### resetButton
```twig
{{ form.resetButton('Clear') }}
```

```html
<!-- Output -->

<button type="reset" name="Clear"> Clear </button>
```
