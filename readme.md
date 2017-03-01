# mojule-h

Create [mojule-dom](https://github.com/mojule/mojule-dom) virtual nodes using a
concise API, like [hyperscript](https://github.com/hyperhype/hyperscript).

This is an implementation of
[html-script](https://github.com/mojule/html-script) using an adapter over
`mojule-dom`. To use this syntax in the browser, see
[dom-script](https://github.com/mojule/dom-script), or to use it with some other
structure, eg some virtual DOM or whatever, see the
[html-script readme](https://github.com/mojule/html-script/blob/master/readme.md)

## Example

```javascript
'use strict'

const H = require( 'mojule-h' )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = H

const dom =
  document(
    documentType('html'),
    html(
      head(
        meta({charset:'utf-8'}),
        title('Hello World!')
      ),
      body(
        comment('Whose line is it anyway?'),
        div({id:'main'},
          p('The quick brown fox jumps over the ',strong('lazy dog')),
          input({type:'text',name:'firstName',placeholder:'Alex'})
        ),
        comment('Fragment not (usually) necessary but make sure it works'),
        documentFragment(
          comment('Text not necessary but etc.'),
          p(text('lol '),'wut')
        ),
        comment('But what if it is not in the spec?'),
        element('customtag',{class:'kk'},
          p('OK that works for me')
        )
      )
    )
  )
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello World!</title>
  </head>
  <body>
    <!--Whose line is it anyway?-->
    <div id="main">
      <p>The quick brown fox jumps over the <strong>lazy dog</strong></p>
      <input type="text" name="firstName" placeholder="Alex" />
    </div>
    <!--Fragment not (usually) necessary but make sure it works-->
    <!--Text not necessary but etc.-->
    <p>lol wut</p>
    <!--But what if it is not in the spec?-->
    <customtag class="kk">
      <p>OK that works for me</p>
    </customtag>
  </body>
</html>
```

## Installation and usage

`npm install mojule-h`

```javascript
const H = require( 'mojule-h' )

// now destructure out the functions you want - alternatively, use H.div etc.
const { div, p, comment, element } = H

// any objects passed will be treated as attributes
// <div id="main"></div>
const main = div( { id: 'main' } )

// any strings passed will be treated as text nodes
// <p>Hello world!</p>
const hello = p( 'Hello world!' )

// non-element nodes also supported
// <!--Hello world!-->
const helloComment = comment( 'Hello world!' )

// any nodes passed will be appended to the parent
// <div><p>Hello</p><p>World</p></div>
const nested =
  div(
    p( 'Hello' ),
    p( 'World' )
  )

// stick in the real DOM
document.body.appendChild( nested )

// if html-script doesn't have the element you want
// <custom id="myCustom">Hello world!</custom>
const custom =
  element( 'custom', { id: 'myCustom' },
    'Hello world!'
  )
```

## Attributes

An object passed to a `dom-script` function is treated as though it were an
attribute map for the node. For the most part, it is expected to be a simple map
of attribute name to attribute value, and the value is expected to be a string,
with some exceptions listed below.

```javascript
const nameField =
  div(
    label( { for: 'firstName' }, 'First Name' ),
    input( { type: 'text', name: 'firstName' } )
  )
```

```html
<div>
  <label for="firstName">First Name</label>
  <input type="text" name="firstName" />
</div>
```

### boolean attributes

To make working with boolean attributes easier, any attribute that has a boolean
value will be treated as though the boolean attribute is present on the node if
the value is `true`, and absent if the value is `false`:

```javascript
div(
  input( { type: 'radio', checked: true } ),
  input( { type: 'radio', checked: false } )
)
```

```html
<div>
  <input type="radio" checked />
  <input type="radio" />
</div>
```

### style

Either a string, or an object of name value pairs:

```javascript
div(
  p( { style: 'font-family: sans-serif' }, 'Hello' ),
  p( { style: { 'font-family': 'sans-serif', 'font-size': '1rem' }, 'World' )
)
```

```html
<div>
  <p style="font-family: sans-serif">Hello</p>
  <p style="font-family: sans-serif; font-size: 1rem;">World</p>
</div>
```

### data

An attribute named `data` with an object value will be treated similarly to the
[dataSet](https://developer.mozilla.org/en/docs/Web/API/HTMLElement/dataset)
property on DOM nodes, that is, the object keys will be converted from camelCase
to dash-style with a `data-` prefix. This makes it easy to use your existing
models to set data attributes without having to first mangle the names:

```javascript
div( { data: { firstName: 'Nik', lastName: 'Coughlin' } } )
```

```html
<div data-first-name="Nik" data-last-name="Coughlin"></div>
```

### other types

All other values are converted to a string via `String( value )`

## JsonML

Because JsonML is a convenient format for transportation and persistence, a
helper method is provided to populate your DOM from `JsonML` data:

```javascript
const H = require( 'mojule-h' )
const jsonML = require( './path/to/some/data.json' )

const dom = H.fromJsonML( jsonML )
```
