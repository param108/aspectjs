'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var AspectList = require('./aspectlist');
var AspectDetail = require('./aspect-detail');
var UISwitcher= require('./uiswitcher');
var Loading= require('./loading');
var Database = require('./database');
$(document).ready(function() {
ReactDom.render(
  <AspectDetail/>,
  document.getElementById('aspect-detail')
);

ReactDom.render(
  <AspectList url="/doitgym/aspects/list/"/>,
  document.getElementById('aspect-list')
);
ReactDom.render(
  <UISwitcher start="#aspect-list"/>,
  document.getElementById('uiswitcher')
);
ReactDom.render(
  <Loading/>,
  document.getElementById('loading')
);
ReactDom.render(
  <Database/>,
  document.getElementById('database')
);

});
