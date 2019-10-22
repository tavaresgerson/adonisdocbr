# Manipulação de Erros

O AdonisJs não apenas trata as exceções como uma maneira de orientar o desenvolvedor sobre o que deu errado, mas também 
como uma maneira de criar um fluxo de aplicativos em torno deles.

Neste guia, aprendemos como as exceções são geradas, como escrever a lógica em torno delas e, finalmente, criando suas próprias 
exceções personalizadas.

## Introdução
As exceções são ótimas, pois interrompem o programa em um determinado estágio e garantem que tudo esteja correto antes de prosseguir.

As exceções geralmente são tratadas apenas como guias para informar ao desenvolvedor o que deu errado, mas se tratadas com cuidado, 
elas podem ajudá-lo a criar um fluxo de aplicativos em torno delas.

Por padrão, o AdonisJs lida com todas as exceções para você e as exibe em um bom formato durante o desenvolvimento. No entanto, 
você é livre para lidar com exceções da maneira que desejar.

## Manipulando exceções
As exceções podem ser tratadas vinculando um manipulador de exceções curinga ou manipulando exceções individuais usando seus nomes.

### Manipulador curinga
Vamos criar um manipulador de exceções curinga usando o comando `adonis`:

```
> adonis make:ehandler
```

```
✔ create  app/Exceptions/Handler.js
```

Depois de criado, o manipulador de exceções curinga recebe todas as exceções que ocorreram durante o ciclo de vida do HTTP:

``` js
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

No exemplo acima, o método `handle` manipula os erros de validação `ValidationException` alertando de volta para o formulário.

### Exceções individuais
Você pode conectar-se a exceções individuais definindo um manipulador embutido para elas.

Isso pode ser feito dentro do arquivo `start/hooks.js`:

``` js
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
O AdonisJs simplifica a criação de suas próprias exceções personalizadas e define os manipuladores para elas.

Vamos usar o comando `adonis` para criar uma exceção personalizada:

``` 
> adonis make:exception Custom
```

```
✔ create  app/Exceptions/CustomException.js
```

``` js
const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {}

module.exports = CustomException
```

Você pode lançar essa exceção importando seu arquivo de origem (os valores `status` e `code` são opcionais):

``` js
const CustomException = use('App/Exceptions/CustomException')

throw new CustomException(message, status, code)
```

Você pode definir mensagens, status e códigos padrão em uma exceção personalizada:

``` js
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

``` js
const NotEditableException = use('App/Exceptions/NotEditableException')

throw new NotEditableException()
```

A vantagem dessa abordagem é que você pode atribuir um nome exclusivo às suas exceções como o nome da classe e, em seguida, 
capturar e responder a elas adequadamente.

### Um passo a frente
Podemos tornar a exceção personalizada ao definir métodos `handlee` e `report` na nossa classe de exceção personalizada:

``` js
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

