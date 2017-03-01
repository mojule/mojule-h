'use strict'

const assert = require( 'assert' )
const H = require( '../dist' )
const HtmlScript = require( 'html-script' )

const {
  document, documentType, text, comment, documentFragment, element,
  html, head, body, meta, title, div, p, strong, input
} = H

const expected = '<!doctype html><html><head><meta charset="utf-8" /><title>Hello World!</title></head><body><!--Whose line is it anyway?--><div id="main"><p>The quick brown fox jumps over the <strong>lazy dog</strong></p><input type="text" name="firstName" placeholder="Alex" /></div><!--Fragment not (usually) necessary but make sure it works--><!--Text not necessary but etc.--><p>lol wut</p><!--But what if it is not in the spec?--><customtag class="kk"><p>OK that works for me</p></customtag></body></html>'

const expectedJml = ["document",["documentType","html"],["html",["head",["meta",{"charset":"utf-8"}],["title","Hello World!"]],["body",["comment","Whose line is it anyway?"],["div",{"id":"main"},["p","The quick brown fox jumps over the ",["strong","lazy dog"]],["input",{"type":"text","name":"firstName","placeholder":"Alex"}]],["comment","Fragment not (usually) necessary but make sure it works"],["documentFragment",["comment","Text not necessary but etc."],["p","lol ","wut"]],["comment","But what if it is not in the spec?"],["customtag",{"class":"kk"},["p","OK that works for me"]]]]]

describe( 'mojule-h', () => {
  // proper tests to come (yeah, right)
  it( 'default adapter', () => {
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

    assert.equal( dom.stringify(), expected )
  })

  it( 'fromJml', () => {
    const {
      document, documentType, text, comment, documentFragment, element,
      html, head, body, meta, title, div, p, strong, input
    } = HtmlScript

    const jml =
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

    const dom = H.fromJsonML( jml )

    assert.equal( dom.stringify(), expected )
  })
})

