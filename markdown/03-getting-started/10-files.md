# Files

AdonisJs has out of the box support for handling file uploads. You can easily manage *bulk uploads*, *file size/extension validation* and add global checks to deny requests containing more than expected payload.

## Basic Example

Let's take an example of uploading user avatar. We will consider this as a **PUT** request to upload the user profile avatar and run necessary validations to make sure the user is uploading the right file.

```js
// app/Http/routes.js

Route.put('/users/:id/avatar', 'UsersController.updateAvatar')
```

Next, you need to create the `updateAvatar` method in `UsersController`.

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Helpers = use('Helpers')
const User = use('App/Model/User')

class UserController {

  * updateAvatar (request, response) {

    const avatar = request.file('avatar', { <1>
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    const userId = request.param('id')
    const user = yield User.findOrFail(userId)

    const fileName = `${new Date().getTime()}.${avatar.extension()}` <2>
    yield avatar.move(Helpers.storagePath(), fileName) <3>

    if (!avatar.moved()) {
      response.badRequest(avatar.errors())
      return
    }

    user.avatar = avatar.uploadPath() <4>
    yield user.save()
    response.ok('Avatar updated successfully')
  }
}

module.exports = UsersController
```

1. First we get a file object from the `request` object. Additionally we can define `maxSize` and `allowedExtensions` to validate the file.
2. It is important to rename the file, same is done by grabbing the current date time and appending the file extension to it.
3. Next, we call the move operation on the file instance. Any validation errors will be returned using `errors()` method.
4. If all went fine, we set the path of avatar next to the user model object and persist it to the database.

## Config

The configuration for the file uploads is stored inside `config/bodyParser.js` file.

```js
// config/bodyParser.js

uploads: {
  multiple: true,
  hash: false,
  maxSize: '2mb'
}
```

1. The `maxSize` is calculated on all the uploaded files, which means uploading two files of `1.5mb` each will exceed this limit.
2. The `maxSize` check is performed right at the beginning. This makes sure that attackers are not choking your servers by sending **Gigabytes** of data.

## File Instance

The `request.file` method returns an instance of the `File` class, which has a handful of methods to retrieve uploaded file information and move it to a given path.

Uploading multiple files return an array of `File` class instances. For example:

```js
const profilePics = request.file('profile[]')
// profilePics will be an array
```

## Validation

**File instance** can manage validation on file size and extensions for you. You just need to pass the options when accessing the instance.

```js
const avatar = request.file('avatar', {
  maxSize: '2mb',
  allowedExtensions: ['jpg', 'png']
})
```

Now when you will call the `move` method, the validations will fire based on the defined configuration. In case, if above validations are not enough for you, you can implement your own `validate` method.

### Manual Validation
Returning *true* or *false* from the `validate` method will define whether the validation has been passed or not. Also, you will be responsible for setting the error message on the file instance manually.

```js
const avatar = request.file('avatar')

avatar.validate = function () {
  if (avatar.extension() !== 'foo') {
    avatar._setError('We support foo files only')
    return false
  }
  return true
}
```

## File Instance Methods
Below is the list of available methods on File instance.

#### clientName
Returns the name of the uploaded file.

```js
avatar.clientName()
```

#### clientSize
Returns the size of the file (in bytes).

```js
avatar.clientSize()
```

#### mimeType
Returns file mime-type.

```js
avatar.mimeType()
```

#### extension
Returns file extension.

```js
avatar.extension()
```

#### tmpPath
The path to the temporary folder, where the file was uploaded.

```js
avatar.tmpPath()
```

#### exists
Tells whether the file exists inside the temporary folder or not.

```js
avatar.exists()
```

#### move(toPath, [newName])
Move the file to a given location with an optional name. If `newName` is not defined, it will make use of `clientName()`

```js
yield avatar.move(Helpers.storagePath())
```

#### delete()
Delete file from the `tmp` directory after the file has been moved.

```js
yield avatar.delete()
```

#### moved
Tells whether the move operation was successful or not.

```js
yield avatar.move(Helpers.storagePath())

if (avatar.moved()) {
    // moved successfully
}
```

#### errors
Returns errors occurred during the `move` process.

```js
yield avatar.move(Helpers.storagePath())

if (!avatar.moved()) {
  response.send(avatar.errors())
}
```

#### uploadPath

Full path to the upload directory with the file name.

```js
yield avatar.move(Helpers.storagePath())

avatar.uploadPath()
```

#### uploadName
Name of the uploaded file.

```js
yield avatar.move(Helpers.storagePath(), 'selfie.jpg')
avatar.uploadName()
```

> NOTE:: `uploadPath` and `uploadName` will only be available after the move operation.

#### toJSON
Returns **JSON** representation of the file properties.

```js
avatar.toJSON()
```
