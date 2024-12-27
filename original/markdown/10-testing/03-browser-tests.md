---
title: Browser Tests
category: testing
---

# Browser Tests

AdonisJs makes it simple to write *functional tests* using the Chrome browser. Under the hood, it uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to launch a web browser and run assertions.

In this guide, we learn about opening a browser programmatically and running tests like a real user is using your application.

> NOTE: Since AdonisJs uses the Chrome engine, you cannot run your tests on multiple browsers like *IE* or *Firefox*. Cross-browser testing is usually implemented for frontend JavaScript, which is out of the scope of the AdonisJs documentation.

## Setup

> NOTE: [Puppeteer](https://github.com/GoogleChrome/puppeteer) comes bundled with Chromium and takes a while to download and install. To skip the Chromium install, pass the `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` environment variable. If skipped, make sure to define your [custom Chromium path](#custom-chromium-path) also.

As the *Browser Provider* is not installed by default, we need to pull it from `npm`:

```bash
adonis install @adonisjs/vow-browser

# Skip Chromium download
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true adonis install @adonisjs/vow-browser
```

Next, register the provider in the `start/app.js` file `aceProviders` array:

```js
// .start/app.js

const aceProviders = [
  '@adonisjs/vow-browser/providers/VowBrowserProvider'
]
```

## Basic Example
Now we've set up the provider, we can use the `Test/Browser` trait to test against a web browser.

Create a new *functional test* by running the following command:

```bash
adonis make:test hello-world
```

```bash
# .make:test Menu

> Select the type of test to create
  Unit test
❯ Functional test
```

```bash
# Output

create: test/functional/hello-world.spec.js
```

Next, open the test file and paste in the following code:

```js
// .test/functional/hello-world.spec.js

'use strict'

const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Adonis')
})
```

Examining our test file...

1. We register the `Test/Browser` trait, providing us a `browser` object to make HTTP requests with
2. We visit the root `/` URL and save the reference to the page object
3. We run an assertion to confirm the page HTML contains the text `Adonis`

Finally, run all your functional tests via the following command:

```bash
adonis test functional
```

```bash
# Output

  Hello World
    ✓ Visit home page (978ms)

   PASSED

  total       : 1
  passed      : 1
  time        : 998ms
```

Your first browser test <span style="background: lightgreen; padding: 0 5px;">PASSED</span>. Congratulations! 🎉

> NOTE: If the test failed, ensure you haven't changed the default output of the root `/` route.

## Custom Chromium Path
If you used the `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` environment variable to install the *Browser Provider*, then Chromium is not installed by default and you must pass an executable path to Chromium yourself.

1. First, download [Chromium](https://chromium.woolyss.com/download/) and place it in a Node.js accessible directory
2. When using the `Test/Browser` trait, define your executable path to Chromium:
  ```js
  trait('Test/Browser', {
    executablePath: '/absolute/path/to/chromium'
  })
  ```

  Alternatively, define the executable path as an env var in the `.env.testing` file:
  ```bash
  # .env.testing

  CHROMIUM_PATH=/absolute/path/to/chromium
  ```

## Configuration
The following browser options can be configured via the `Test/Browser` trait:

#### `options`

| Key               | Description     | Description |
|-------------------|-----------------|-------------|
| `headless`        | Boolean <true>  | Whether to run tests in headless mode or launch a real browser. |
| `executablePath`  | String          | Path to the Chromium executable (only required when you don't use bundled Chromium). |
| `slowMo`          | Number          | Number of millseconds used for slowing down each browser interaction (can be used to see tests in slow motion). |
| `dumpio`          | Boolean <false> | Log all browser console messages to the terminal. |

```js
// Example Usage

trait('Test/Browser', {
  headless: false
})
```

For all other options, see the [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions) official documentation.

## Browser API
AdonisJs adds a wrapper on top of Puppeteer to make it more suitable for testing.

The following API is for the main browser and page objects.

#### `browser.visit`
Calls the Puppeteer [page.goto](https://pptr.dev/#?product=Puppeteer&version=v1.8.0&show=api-pagegotourl-options) method and has the same signature:

```js
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/', {
    waitUntil: 'load'
  })

  await page.assertHas('Adonis')
})
```

You can access the actual Puppeteer page object via the `page.page` property:

```js
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  // puppeteer page object
  page.page.addScriptTag()
})
```

## Page Interactions
The following methods can be used to interact with a webpage.

> TIP: The page interaction methods support all [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

#### `type(selector, value)`
Type inside an element with the given selector:

```js
const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('[name="username"]', 'virk')
})
```

To type multiple values, chain method calls:

```js
await page
  .type('[name="username"]', 'virk')
  .type('[name="age"]', 22)
```

#### `select(selector, value)`
Select the value inside a select box:

```js
await page
  .select('[name="gender"]', 'Male')
```

To select multiple values, pass an array:

```js
await page
  .select('[name="lunch"]', ['Chicken box', 'Salad'])
```

#### `radio(selector, value)`
Select a radio button based on its value:

```js
await page
  .radio('[name="gender"]', 'Male')
```

#### `check(selector)`
Check a checkbox:

```js
await page
  .check('[name="terms"]')
```

#### `uncheck(selector)`
Uncheck a checkbox:

```js
await page
  .uncheck('[name="newsletter"]')
```

#### `submitForm(selector)`
Submit a selected form:

```js
await page
  .submitForm('form')

// or use a name
await page
  .submitForm('form[name="register"]')
----

#### `click(selector)`
Click an element:

```js
await page
  .click('a[href="/there"]')
```

#### `doubleClick(selector)`
Double click an element:

```js
await page
  .doubleClick('button')
```

#### `rightClick(selector)`
Right click an element:

```js
await page
  .rightClick('button')
```

#### `clear(selector)`
Clear the value of a given element:

```js
await page
  .clear('[name="username"]')
```

#### `attach(selector, [files])`
Attach one or multiple files:

```js
await page
  .attach('[name="profile_pic"]', [
    Helpers.tmpPath('profile_pic.jpg')
  ])
```

#### `screenshot(saveToPath)`
Save a screenshot of the current state of a webpage:

```js
await page
  .type('[name="username"]', 'Virk')
  .type('[name="age"]', 27)
  .screenshot()
```

## Waiting For Actions
There are times when you might have to wait for an action to take effect.

For example, you might have to wait for an element to appear on the page before you can click it, or you might have to wait for a webpage to redirect, and so on.

The following methods can be used to handle such scenarios.

#### `waitForElement(selector, timeout = 15000)`
Wait until an element appears inside the DOM:

```js
await page
  .waitForElement('div.alert')
  .assertHasIn('div.alert', 'Success!')
```

> NOTE: The default wait timeout is `15` seconds.

#### `waitUntilMissing(selector)`
Wait until an element disappears from the DOM:

```js
await page
  .waitUntilMissing('div.alert')
  .assertNotExists('div.alert')
```

#### `waitForNavigation()`
Wait until a page has navigated properly to a new URL:

```js
await page
  .click('a[href="/there"]')
  .waitForNavigation()
  .assertPath('/there')
```

#### `waitFor(closure)`
Wait until the passed closure function returns true:

```js
await page
  .waitFor(function () {
    return !!document.querySelector('body.loaded')
  })
```

> NOTE: The closure is executed in the browser context and has access to variables like `window`, `document`, and so on.

#### `pause(timeout = 15000)`
Pause the webpage for a given timeframe:

```js
await page.pause()
```

> NOTE: The default pause timeout is `15` seconds.

## Reading Values
The following methods can be used to read values from a webpage.

#### `getText([selector])`
Get text for a given element or the entire page:

```js
await page
  .getText()

// or
await page
  .getText('span.username')
```

#### `getHtml([selector])`
Get HTML for a given element or the entire page:

```js
await page
  .getHtml()

// or
await page
  .getHtml('div.header')
```

#### `isVisible(selector)`
Find if a given element is visible:

```js
const isVisible = await page
  .isVisible('div.alert')

assert.isFalse(isVisible)
```

#### `hasElement(selector)`
Find if an element exists in the DOM:

```js
const hasElement = await page
  .hasElement('div.alert')

assert.isFalse(hasElement)
```

#### `isChecked(selector)`
Find whether a checkbox is checked:

```js
const termsChecked = await page
  .isChecked('[name="terms"]')

assert.isTrue(termsChecked)
```

#### `getAttribute(selector, name)`
Get the value of a given attribute:

```js
const dataTip = await page
  .getAttribute('div.tooltip', 'data-tip')
```

#### `getAttributes(selector)`
Get all attributes for a given element selector:

```js
const attributes = await page
  .getAttributes('div.tooltip')
```

#### `getValue(selector)`
Get the value of a given form element:

```js
const value = await page
  .getValue('[name="username"]')

assert.equal(value, 'virk')
```

#### `getPath()`
Get the current webpage path:

```js
await page
  .getPath()
```

#### `getQueryParams()`
Get the current query parameters:

```js
await page
  .getQueryParams()
```

#### `getQueryParam(key)`
Get the value of a single query parameter:

```js
await page
  .getQueryParam('orderBy')
```

#### `getTitle()`
Get the webpage title:

```js
await page
  .getTitle()
```

## Assertions
One way to run assertions is to read the value of target elements and then assert against those values manually.

The AdonisJS browser client provides a number of convenient helper methods to run inline page assertions to simplify the process for you.

#### `assertHas(expected)`
Assert the webpage includes the expected text value:

```js
await page
  .assertHas('Adonis')
```

#### `assertHasIn(selector, expected)`
Assert a given selector contains the expected value:

```js
await page
  .assertHasIn('div.alert', 'Success!')
```

#### `assertAttribute(selector, attribute, expected)`
Assert the value of an attribute is the same as the expected value:

```js
await page
  .assertAttribute('div.tooltip', 'data-tip', 'Some helpful tooltip')
```

#### `assertValue(selector, expected)`
Assert the value for a given form element:

```js
await page
  .assertValue('[name="username"]', 'virk')
```

#### `assertIsChecked(selector)`
Assert a checkbox is checked:

```js
await page
  .assertIsChecked('[name="terms"]')
```

#### `assertIsNotChecked(selector)`
Assert a checkbox is not checked:

```js
await page
  .assertIsNotChecked('[name="terms"]')
```

#### `assertIsVisible(selector)`
Assert an element is visible:

```js
await page
  .assertIsVisible('div.notification')
```

#### `assertIsNotVisible(selector)`
Assert an element is not visible:

```js
await page
  .assertIsNotVisible('div.notification')
```

#### `assertPath(value)`
Assert the value of the current path:

```js
await page
  .assertPath('/there')
```

#### `assertQueryParam(key, value)`
Assert the value of a query parameter:

```js
await page
  .assertQueryParam('orderBy', 'id')
```

#### `assertExists(selector)`
Assert an element exists inside the DOM:

```js
await page
  .assertExists('div.notification')
```

#### `assertNotExists(selector)`
Assert an element does not exist inside the DOM:

```js
await page
  .assertNotExists('div.notification')
```

#### `assertCount(selector, expectedCount)`
Assert the number of elements for a given selector:

```js
await page
  .assertCount('table tr', 2)
```

#### `assertTitle(expected)`
Assert the webpage title:

```js
await page
  .assertTitle('Welcome to Adonis')
```

#### `assertEval(selector, fn, [args], expected)`
Assert the value of a function executed on a given selector (`fn` is executed in the browser context):

```js
await page
  .assertEval('table tr', function (el) {
    return el.length
  }, 2)
```

In above example, we count the number of `tr` inside a table and assert that count is `2`.

You can also pass *arguments* (`[args]`) to the selector `fn`:

```js
await page
  .assertEval(
    'div.notification',
    function (el, attribute) {
      return el[attribute]
    },
    ['id'],
    'notification-1'
  )
```

In the above example, we assert over a given attribute of the `div.notification` element. The given attribute is dynamic and passed as an argument (`['id']`).

#### `assertFn(fn, [args], expected)`
Assert the output of a given function (`fn` is executed in the browser context):

```js
await page
  .assertFn(function () {
    return document.title
  }, 'Welcome to Adonis')
```

> NOTE: The difference between `assertFn` and `assertEval` is that `assertEval` selects an element before running the function.
