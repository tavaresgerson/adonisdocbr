---
title: Why Adonis install?
category: recipes
---
# Why Adonis install?

AdonisJs ships with a command called `adonis install <package>`, which is same as `npm install` or `yarn add`.

In fact behind the scenes `adonis install` uses npm or yarn to install the package, but also performs an extra step after the install.

## Command execution

![image](http://res.cloudinary.com/adonisjs/image/upload/q_100/v1509020167/adonis-install-flow.png)

Every provider can have two files [instructions.js](https://github.com/adonisjs/adonis-lucid/blob/develop/instructions.js) and [instructions.md](https://github.com/adonisjs/adonis-lucid/blob/develop/instructions.md), which are used by adonis to perform `post install` steps.

### instructions.js
The `.js` file exports a function. This function can be used to perform any steps since you can write functional code inside it.

Most commonly performed steps are

- Copy config files.
- Create entities like controllers, models and so on.

### instructions.md
The `.md` files are the small set of instructions to be followed by hand from the user of the provider. So it is a nice place to drop some usage and setup instructions written in Github flavored markdown.
