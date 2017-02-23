'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Dom = require('mojule-dom');
var Html = require('html-node');
var utils = require('mojule-utils');

var html = Html();
var capitalizeFirstLetter = utils.capitalizeFirstLetter;


var handleArg = function handleArg(el, arg) {
  if (typeof arg === 'string') {
    var text = el.createText(arg);
    el.append(text);
  } else if (typeof arg.get === 'function') {
    el.append(arg);
  }
};

var createFromArgs = function createFromArgs(tagName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var el = Dom(Dom.createElement(tagName));

  args.forEach(function (arg) {
    handleArg(el, arg);
    if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && typeof arg.get !== 'function') {
      el.attributes(arg);
    }
  });

  return el;
};

var H = {
  element: createFromArgs
};

var nodeNames = html.tagNames();

var _nodeNames$reduce = nodeNames.reduce(function (categories, name) {
  if (name.startsWith('#')) {
    categories.nonTags.push(name.slice(1));
  } else {
    categories.tags.push(name);
  }

  return categories;
}, { tags: [], nonTags: [] }),
    tags = _nodeNames$reduce.tags,
    nonTags = _nodeNames$reduce.nonTags;

tags.forEach(function (name) {
  return H[name] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return createFromArgs.apply(undefined, [name].concat(args));
  };
});

nonTags.forEach(function (name) {
  var fname = 'create' + capitalizeFirstLetter(name);

  H[name] = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var node = void 0;

    if (html.isEmpty('#' + name)) {
      node = Dom(Dom[fname].apply(Dom, args));
    } else {
      node = Dom(Dom[fname]());

      args.forEach(function (arg) {
        handleArg(node, arg);
      });
    }

    return node;
  };
});

module.exports = H;