'use strict'

const domAdapter = require( './dom-adapter' )
const H = require( '../../dist' )

window.mojule = { H: H( domAdapter ) }
