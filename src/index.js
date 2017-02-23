'use strict'

const Dom = require( 'mojule-dom' )
const Html = require( 'html-node' )
const utils = require( 'mojule-utils' )
const defaultAdapter = require( './default-adapter' )
const jmlAdapter = require( './jml-adapter' )
const fromJml = require( './from-jml' )

const html = Html()
const { capitalizeFirstLetter } = utils

const H = ( adapter = defaultAdapter ) => {
  const {
    isNode, createText, createElement, appendChild, addAttributes
  } = adapter

  const handleArg = ( el, arg ) => {
    if( typeof arg === 'string' ){
      const text = createText( arg )
      appendChild( el, text )
    } else if( isNode( arg ) ) {
      appendChild( el, arg )
    }
  }

  const createFromArgs = ( tagName, ...args ) => {
    const el = createElement( tagName )

    args.forEach( arg => {
      handleArg( el, arg )
      if( typeof arg === 'object' && !isNode( arg ) ) {
        addAttributes( el, arg )
      }
    })

    return el
  }

  const h = {
    element: createFromArgs,
    adapters: {
      default: defaultAdapter,
      jml: jmlAdapter
    },
    fromJml: jml => fromJml( jml, h )
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
    h[ name ] = ( ...args ) => createFromArgs( name, ...args )
  )

  nonTags.forEach( name => {
    const fname = 'create' + capitalizeFirstLetter( name )

    h[ name ] = ( ...args ) => {
      let node

      if( html.isEmpty( '#' + name ) ){
        node = adapter[ fname ]( ...args )
      } else {
        node = adapter[ fname ]()

        args.forEach( arg => {
          handleArg( node, arg )
        })
      }

      return node
    }
  })

  return h
}

Object.assign( H, H() )

module.exports = H
