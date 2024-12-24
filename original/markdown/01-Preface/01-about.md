---
title: About AdonisJs
category: Preface
---

# About AdonisJs

AdonisJs is a Node.js MVC framework that runs on all major operating systems. It offers a stable ecosystem to write server-side web applications so you can focus on business needs over finalizing which package to choose or not.

AdonisJs favors developer joy with a consistent and expressive API to build full-stack web applications or micro API servers.

## Getting started
There are no hard prerequisites for using AdonisJs, but having a conventional understanding of JavaScript, Async programming and Node.js is very helpful.

Also, if you are new to JavaScript or unfamiliar with its recent progress in ES6, we recommend watching [Wes Bos's ES6 course](https://goo.gl/ox3uSc).

Finally, make sure to read through our [installation](/original/markdown/03-getting-started/01-installation.adoc) guide, especially if this is your first time using AdonisJs.

## Providers
AdonisJs is a modular framework that consists of multiple service providers, the building blocks of AdonisJs applications.

In theory, they are like any other npm module with some code on top to work smoothly with AdonisJs applications (for example, [BodyParser](https://github.com/adonisjs/adonis-bodyparser) to parse the HTTP request body, or [Lucid](https://github.com/adonisjs/adonis-lucid) which is a SQL ORM).

## FAQ's
Below is the list of frequently asked questions. If you think a common question is missing from the list, please create an issue [here](https://github.com/adonisjs/docs).

1. *How is AdonisJs different to Express or Koa?*
  + Express and Koa are routing libraries with a thin layer of middleware on top. They are great for several use cases but fall apart when projects start to grow.
  + Since your projects have their own standards and conventions, it may become harder to hire developers to work on them. As AdonisJs follows a set of standardized conventions, it should be easier to hire someone to work on existing AdonisJs apps.

2. *Is AdonisJs for monolithic apps?*
   + No. The AdonisJs Framework is a combination of multiple packages that gracefully integrate with the rest of your application.
   + The framework provides a robust link:ioc-container[dependency injection] layer leveraged by all official and 3rd party packages to offer functionality without manually wiring up each part of your app.
