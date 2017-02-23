# mojule-h

A bit like hyperscript, but for mojule-dom

mojule-dom is a virtual DOM, but you can use it with other backing types like a
real DOM by using a custom adapter, see below

You can also use it to create a JSON-compatible object via an included adapter,
and convert that object back to a usable DOM, see below

## Example, using mojule-dom

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

console.log( dom.stringify() )
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

## Adapters

You can get an instance of mojule-h that uses your custom adapter by calling it
as a function with your adapter as the parameter:

```javascript
const H = require( 'mojule-h' )
const adapter = require( './path/to/your/adapter' )

const Mine = H( adapter )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = Mine

const dom =
  document(
    documentType('html')
    // etc.
  )
```

An adapter is an object containing the following functions (where `Node` is your
custom backing type). Type notation below should be self explanatory, it's
similar to rtype/typescript etc.

```javascript
{
  isNode: ( node:Node ) => Boolean,
  createElement: ( tagName:String ) => elementNode:Node,
  createText: ( value:String ) => textNode:Node,
  appendChild: ( node:Node, child:Node ) => Void,
  addAttributes: ( node:Node, attributes:Object ) => Void,
  createDocument: () => documentNode:Node,
  createDocumentType: ( name:String, publicId:String?, systemId:String? ) => documentTypeNode:Node,
  createComment: ( value:String ) => commentNode:Node,
  createDocumentFragment: () => documentFragmentNode:Node
}
```

mojule-h expects `createDocument` to return a document node with no children!
Note that the default DOM implementation takes a title and adds various children
like an html tag element etc. - if you are backing this with the real DOM, you
will have to clear out all the children before returning the node.

See './example' for mojule-h running in the browser using an adapter over the
real DOM

## JML Adapter (JSON Markup Language)

An adapter that uses JSON-compatible objects as a backing store is provided:

```javascript
const H = require( '../' )
const J = H( H.adapters.jml )

const { div, p, strong, input } = J

const obj =
  div({id:'main'},
    p('The quick brown fox jumps over the ',strong('lazy dog')),
    input({type:'text',name:'firstName',placeholder:'Alex'})
  )

console.log( JSON.stringify( obj ) )
```

```json
["div",{"id":"main"},
  ["p","The quick brown fox jumps over the ",["strong","lazy dog"]],
  ["input",{"type":"text","name":"firstName","placeholder":"Alex"}]
]
```

If you have some JML somewhere, you can also create nodes with the `fromJml`
function:

Create mojule-dom nodes:
```javascript
const H = require( '../' )
const jml = require( './path/to/jml.json' )

const dom = H.fromJml( jml )
```

With custom adapter:
```javascript
const H = require( '../' )
const adapter = require( './path/to/adapter' )
const jml = require( './path/to/jml.json' )

const Mine = H( adapter )

const dom = Mine.fromJml( jml )
```
