'use strict';

var Dom = require('mojule-dom');
var Html = require('html-node');
var utils = require('mojule-utils');

var html = Html();
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var mojuleDomAdapter = {
  isNode: function isNode(node) {
    return typeof node.get === 'function';
  },
  createElement: function createElement(tagName) {
    return Dom(Dom.createElement(tagName));
  },
  appendChild: function appendChild(el, child) {
    return el.append(child);
  },
  addAttributes: function addAttributes(el, attributes) {
    return el.attributes(attributes);
  }
};

html.tagNames().forEach(function (name) {
  if (!name.startsWith('#')) return;

  var fname = 'create' + capitalizeFirstLetter(name.slice(1));

  mojuleDomAdapter[fname] = function () {
    return Dom(Dom[fname].apply(Dom, arguments));
  };
});

module.exports = mojuleDomAdapter;