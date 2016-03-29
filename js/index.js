'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var AspectList = require('./aspectlist');

$(document).ready(function() {
ReactDom.render(
  <AspectList url="/doitgym/aspects/list/"/>,
  document.getElementById('aspect-list')
);
});
