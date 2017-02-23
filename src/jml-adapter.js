const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )

const html = Html()
const { capitalizeFirstLetter } = utils

const jmlAdapter = {
  isNode: node => Array.isArray( node ),
  createElement: tagName =>
    [ tagName ],
  createText: text => text,
  appendChild: ( el, child ) =>
    el.push( child ),
  addAttributes: ( el, attributes ) =>
    el.push( attributes )
}

html.tagNames().forEach( name => {
  if( !name.startsWith( '#' ) ) return

  name = name.slice( 1 )

  const fname = 'create' + capitalizeFirstLetter( name )

  if( typeof jmlAdapter[ fname ] !== 'function' )
    jmlAdapter[ fname ] = ( ...args ) =>
      [ name, ...args ]
})

module.exports = jmlAdapter
