'use strict'

const document = window.document

const domAdapter = {
  isNode: node => node && node.nodeName && node.nodeType,
  createElement: tagName => document.createElement( tagName ),
  createText: value => document.createTextNode( value ),
  appendChild: ( node, child ) => node.appendChild( child ),
  addAttributes: ( node, attributes ) =>
    Object.keys( attributes ).forEach( name =>
      node.setAttribute( name, String( attributes[ name ] ) )
    ),
  createDocument: () => {
    const doc = document.implementation.createHTMLDocument( '' )

    while( doc.firstChild )
      doc.firstChild.remove()

    return doc
  },
  createDocumentType: ( name, publicId = '', systemId = '' ) =>
    document.implementation.createDocumentType( name, publicId, systemId ),
  createComment: value => document.createComment( value ),
  createDocumentFragment: () => document.createDocumentFragment()
}

module.exports = domAdapter
