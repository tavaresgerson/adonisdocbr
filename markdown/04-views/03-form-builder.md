# Form Builder

Form builds make it easier to create quick and maintainable HTML forms. Think of a situation where you set the form action to a registered route and when route definition gets changed you have to come back to the views making sure your form action points to the right URL.

Form builder gives you the API to bind routes and controllers directly to your forms, making it easier to make changes at one place and same gets reflected within your views.

## Basic Example
Let's take an example of creating a new user form using the form builder.

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

`form.open` lets you bind the route controller action, which means if later you will change the route URL from `/users` to something else, you will not have to make changes inside your view since it is bound to the controller.

## Open/Close Forms
The `form.open` method can setup form *action* and *method* using one of the following properties.

#### action:
Fetch form action and method using the controller method.
```twig
{{ form.open({action: 'UserController.update'}) }}
{{ form.close() }}
```

#### route:
Fetch form action and method using the route name.

```twig
{{ form.open({route: 'users.store'}) }}
{{ form.close() }}
```

#### url:
Manually define a custom url and form method.

```twig
{{ form.open({url: '/users', method: 'POST'}) }}
{{ form.close() }}
```

#### params:
Passing route parameters as an object. *action* and *route* properties will use the parameters to form the correct URL
```twig
{{ form.open({ action: 'UserController.update', params: {id: 1} }) }}
{{ form.close() }}
```

## Uploading Files
To upload files using the form builder, you are required to set `files` property to true on the `open` method.

```twig
{{ form.open({ action: 'UserController.store', files: true }) }}

  <div class="field">
    {{ form.file('avatar') }}
  </div>

{{ form.close() }}
```

## Form Builder Methods
Here is the list of all the available methods available on form builder instance.

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

Just like `text` you can create input fields for all given types.


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
Create a file upload button

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

Also, you can pass an object of key/value pairs in place of the plain array.

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

You can also define *selected* options for a select box.

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
Create a select box with multiple options inside the given range.

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
