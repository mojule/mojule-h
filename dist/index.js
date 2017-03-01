'use strict';

var HtmlScript = require('html-script');
var adapter = require('./mojuleDomAdapter');

var H = HtmlScript(adapter);

module.exports = H;