'use strict'

const fromJml = ( jml, h ) => {
  const mapArg = arg => {
    if( Array.isArray( arg ) )
      return fromArr( arg )

    return arg
  }

  const fromArr = arr => {
    const head = arr[ 0 ]
    const args = arr.slice( 1 ).map( mapArg )

    if( head in h )
      return h[ head ]( ...args )

    return h.element( head, ...args )
  }

  return mapArg( jml )
}

module.exports = fromJml
