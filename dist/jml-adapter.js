'use strict';

var Html = require('html-node');
var utils = require('mojule-utils');

var html = Html();
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var jmlAdapter = {
  isNode: function isNode(node) {
    return Array.isArray(node);
  },
  createElement: function createElement(tagName) {
    return [tagName];
  },
  createText: function createText(text) {
    return text;
  },
  appendChild: function appendChild(el, child) {
    return el.push(child);
  },
  addAttributes: function addAttributes(el, attributes) {
    return el.push(attributes);
  }
};

html.tagNames().forEach(function (name) {
  if (!name.startsWith('#')) return;

  name = name.slice(1);

  var fname = 'create' + capitalizeFirstLetter(name);

  if (typeof jmlAdapter[fname] !== 'function') jmlAdapter[fname] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return [name].concat(args);
  };
});

module.exports = jmlAdapter;