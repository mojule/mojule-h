'use strict'

const Dom = require( 'mojule-dom' )
const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )

const html = Html()
const { capitalizeFirstLetter } = utils

const handleArg = ( el, arg ) => {
  if( typeof arg === 'string' ){
    const text = el.createText( arg )
    el.append( text )
  } else if( typeof arg.get === 'function' ) {
    el.append( arg )
  }
}

const createFromArgs = ( tagName, ...args ) => {
  const el = Dom( Dom.createElement( tagName ) )

  args.forEach( arg => {
    handleArg( el, arg )
    if( typeof arg === 'object' && typeof arg.get !== 'function' ) {
      el.attributes( arg )
    }
  })

  return el
}

const H = {
  element: createFromArgs
}

const nodeNames = html.tagNames()

const { tags, nonTags } = nodeNames.reduce(
  ( categories, name ) => {
    if( name.startsWith( '#' ) ){
      categories.nonTags.push( name.slice( 1 ) )
    } else {
      categories.tags.push( name )
    }

    return categories
  },
  { tags: [], nonTags: [] }
)

tags.forEach( name =>
  H[ name ] = ( ...args ) => createFromArgs( name, ...args )
)

nonTags.forEach( name => {
  const fname = 'create' + capitalizeFirstLetter( name )

  H[ name ] = ( ...args ) => {
    let node

    if( html.isEmpty( '#' + name ) ){
      node = Dom( Dom[ fname ]( ...args ) )
    } else {
      node = Dom( Dom[ fname ]() )

      args.forEach( arg => {
        handleArg( node, arg )
      })
    }

    return node
  }
})

module.exports = H
