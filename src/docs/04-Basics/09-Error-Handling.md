---
title: Error Handling
category: basics
---

# Lidando com exceções

O AdonisJs não trata as exceções apenas como uma forma de orientar o desenvolvedor sobre o que deu errado, mas também como uma forma de construir o fluxo do aplicativo em torno delas.

Neste guia, aprendemos como as exceções são geradas, como escrever lógica em torno delas e, finalmente, criar suas próprias exceções personalizadas.

## Introdução
As exceções são ótimas, pois interrompem o programa em um determinado estágio e garantem que tudo esteja correto antes de prosseguir.

As exceções geralmente são tratadas apenas como guias para informar ao desenvolvedor o que deu errado, mas, se tratadas com cuidado, podem ajudar a construir o fluxo do aplicativo em torno delas.

Por padrão, o AdonisJs lida com todas as exceções para você e as exibe em um [bom formato](http://res.cloudinary.com/adonisjs/image/upload/v1485520687/Screen_Shot_2017-01-27_at_6.07.28_PM_blcaau.png) durante o desenvolvimento. No entanto, você é livre para lidar com exceções como quiser.

## Lidando com exceções
Exceções podem ser tratadas vinculando um manipulador de exceção curinga ou tratando exceções individuais usando seus nomes.

### Manipulador curinga
Vamos criar um manipulador de exceção curinga usando o comando `adonis`:

```bash
adonis make:ehandler
```

```bash
# .make:ehandler output

✔ create  app/Exceptions/Handler.js
```

Uma vez criado, o manipulador de exceção curinga recebe todas as exceções que ocorreram durante o ciclo de vida HTTP:

```js
// .app/Exceptions/Handler.js

const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { response, session }) {
    if (error.name === 'ValidationException') {
      session.withErrors(error.messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }

    return super.handle(...arguments)
  }
}

module.exports = ExceptionHandler
```

No exemplo acima, o método `handle` lida com a `ValidationException` exibindo erros de validação de volta ao formulário.

### Exceções individuais
Você pode se conectar a exceções individuais definindo um manipulador inline para elas.

Isso pode ser feito dentro do arquivo `start/hooks.js`:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Exception = use('Exception')

  Exception.handle('ValidationException', async (error, { response, session }) => {
    session.withErrors(error.messages).flashAll()
    await session.commit()
    response.redirect('back')
    return
  })
})
```

## Exceções personalizadas
O AdonisJs simplifica a criação de suas próprias exceções personalizadas e define manipuladores para elas.

Vamos usar o comando `adonis` para criar uma exceção personalizada:

```bash
adonis make:exception Custom
```

```bash
# .make:exception output

✔ create  app/Exceptions/CustomException.js
```

```js
// .app/Exceptions/CustomException.js

const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {}

module.exports = CustomException
```

Você pode lançar essa exceção importando seu arquivo de origem (os valores `status` e `code` são opcionais):

```js
const CustomException = use('App/Exceptions/CustomException')

throw new CustomException(message, status, code)
```

Você pode definir mensagens, status e códigos padrão em uma exceção personalizada:

```js
// .app/Exceptions/NotEditableException.js

const { LogicalException } = require('@adonisjs/generic-exceptions')
const message = 'The item is in an status where modifications are disallowed'
const status = 403
const code = 'E_NOT_EDITABLE'

class NotEditableException extends LogicalException {
  constructor () {
    super(message, status, code)
  }
}

module.exports = NotEditableException
```

```js
const NotEditableException = use('App/Exceptions/NotEditableException')

throw new NotEditableException()
```

A beleza dessa abordagem é que você pode dar um nome exclusivo às suas exceções como o nome da classe e, em seguida, capturá-las e respondê-las adequadamente.

### Um passo adiante
Podemos levar o tratamento de exceções personalizado um passo adiante definindo os métodos `handle` e `report` em nossa classe de exceção personalizada:

```js
// .app/Exceptions/CustomException.js

const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {
  handle (error, { response }) {
    response
      .status(500)
      .send('Custom exception handled!')
  }
}

module.exports = CustomException
```

Se definido, o AdonisJs chama o método `handle` da exceção personalizada para criar e retornar a resposta da exceção.
