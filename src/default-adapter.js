const Dom = require( 'mojule-dom' )
const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )

const html = Html()
const { capitalizeFirstLetter } = utils

const defaultAdapter = {
  isNode: node => typeof node.get === 'function',
  createElement: tagName =>
    Dom( Dom.createElement( tagName ) ),
  appendChild: ( el, child ) =>
    el.append( child ),
  addAttributes: ( el, attributes ) =>
    el.attributes( attributes )
}

html.tagNames().forEach( name => {
  if( !name.startsWith( '#' ) ) return

  const fname = 'create' + capitalizeFirstLetter( name.slice( 1 ) )

  defaultAdapter[ fname ] = ( ...args ) =>
    Dom( Dom[ fname ]( ...args ) )
})

module.exports = defaultAdapter
