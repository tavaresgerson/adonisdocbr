# Formulário de construção

Formulários de construção facilitam a criação de formulários rápidos e mantidos. Imagine uma situação em que você define a ação do formulário para uma rota registrada e quando a definição da rota é alterada, você precisa voltar para as visualizações garantindo que sua ação do formulário aponte para o URL correto.

O construtor de formulários fornece a você a API para vincular rotas e controladores diretamente aos seus formulários, tornando mais fácil fazer alterações em um único local e o mesmo é refletido dentro de suas visualizações.

## Exemplo básico
Vamos pegar um exemplo de criação de uma nova forma de usuário usando o construtor de formulários.

```js
// Route

Route.post('/users', 'UserController.store')
```

```twig
{# View #}

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

O `form.open` permite que você vincule a ação do controlador de rota, o que significa que se mais tarde você mudar a URL da rota de `/usuários` para algo diferente, você não precisará fazer alterações dentro da sua visão, pois está vinculado ao controlador.

## Open/Close Forms
O método `form.open` pode configurar o atributo *action* e *method* do formulário usando uma das seguintes propriedades.

### ação
Recuperar ação e método do formulário usando o método do controlador.

```twig
{{ form.open({action: 'UserController.update'}) }}
{{ form.close() }}
```

### rota
Recuperar ação e método de formulário usando o nome da rota.

```twig
{{ form.open({route: 'users.store'}) }}
{{ form.close() }}
```

### url
Defina manualmente uma URL personalizada e um método de formulário.

```twig
{{ form.open({url: '/users', method: 'POST'}) }}
{{ form.close() }}
```

### parâmetros
Passando parâmetros de rota como um objeto. As propriedades *action* e *route* usarão os parâmetros para formar a URL correta

```twig
{{ form.open({ action: 'UserController.update', params: {id: 1} }) }}
{{ form.close() }}
```

## Carregando arquivos
Para fazer o upload de arquivos usando o construtor de formulários, você precisa definir a propriedade `files` como verdadeira no método `open`.

```twig
{{ form.open({ action: 'UserController.store', files: true }) }}

  <div class="field">
    {{ form.file('avatar') }}
  </div>

{{ form.close() }}
```

## Métodos de Construção de Formulários
Aqui está a lista de todos os métodos disponíveis na instância do construtor de formulários.

#### rótulo

```twig
{{ form.label('username', 'Enter Username') }}
{{ form.label('username', 'Enter Username', {class: 'label-class'}) }}
```

Saída:

```html
<label name="username"> Enter Username </label>
```

#### texto

```twig
{{ form.text('username') }}
{{ form.text('username', 'John', {class: 'input'}) }}
```

Saída:

```html
<input type="text" name="username" value="John" class="input" />
```

Assim como `texto`, você pode criar campos de entrada para todos os tipos dados.

| Tipo de entrada | Método |
|------------|--------|
| senha | form.password() |
| e-mail | form.email() |
| cor | form.color() |
| data | form.date() |
| url | form.url() |
| pesquisar | form.search() |
| hidden | form.hidden() |

#### arquivo
Criar um botão de upload de arquivos

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

#### Selecione

```twig
{{ form.select('countries', ['India', 'US', 'UK'], null, 'Select Country') }}
```

Saída:

```html
<select name="countries">
  <option value="">Select Country</option>
  <option value="India">India</option>
  <option value="US">US</option>
  <option value="UK">UK</option>
</select>
```

Além disso, você pode passar um objeto de pares chave/valor no lugar da matriz simples.

```twig
{{ form.select('countries', {ind: 'India', us: 'Usa'}) }}
```

Saída:

```html
<select name="countries">
  <option value="ind">India</option>
  <option value="us">US</option>
</select>
```

Você também pode definir *opções selecionadas* para uma caixa de seleção.

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

Saída:

```html
<select name="countries" multiple>
  <option value="">Select Country</option>
  <option value="ind" selected>India</option>
  <option value="us" selected>US</option>
  <option value="us">US</option>
</select>
```

#### selectRange
Crie uma caixa de seleção com várias opções dentro do intervalo fornecido.

```twig
{{ form.selectRange('days', 1, 30) }}
```

Saída:

```html
<select name="days">
  <option value="1">1</option>
  <option value="2">3</option>
  <option value="3">3</option>
  ...
</select>
```

#### enviar
```twig
{{ form.submit('Create Account', 'create') }}
```

Saída:

```html
<input type="submit" name="create" value="Create Account" />
```

#### botão

```twig
{{ form.button('Create Account', 'create') }}
```

Saída:

```html
<button type="submit" name="create"> Create Account </button>
```

#### resetButton

```twig
{{ form.resetButton('Clear') }}
```

Saída:

```html
<button type="reset" name="Clear"> Clear </button>
```
