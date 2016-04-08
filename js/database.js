'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var __local = {};
var __fs = {};
var Database = React.createClass({
  getInitialState: function() {
    return {
            };
  },
  save_local: function(data) {
  },
  save: function(data) {
  },
  retrieve: function(data) {
  },
  register: function(data) {
  },
  componentDidMount: function() {
    Dispatch.register("SAVE_DATA", this.save);
    Dispatch.register("REGISTER_DATA", this.register);
  },

  render: function() {
    locallist=[];
    for (var key in __local) {
      locallist.push(key);
    }
    List = locallist.map(function(localkey) {
      var name = localkey;
      var cnt = __local[localkey].length;
      var dt = name+"-"+cnt.toString();
      return (
        <span key={name} className="database-view-elem">{dt}</span>
      );
    });
    return (
        <div className="database-view">
        {List}
        </div>
    );
   }
});

module.exports=Database;
/*ReactDom.render(
  <BoxList url={countriesUrl} itemtype="Countries"/>,
  document.getElementById('box-list')
);


ReactDom.render(
  <BoxList url={airportsUrl} itemtype="Airports"/>,
  document.getElementById('airports-list')
);

ReactDom.render(
  <BoxList url={airportsUrl} itemtype="Consolidated"/>,
  document.getElementById('consolidate-list')
);

ReactDom.render(
  <BoxList url="php/categories.php" itemtype="Categories"/>,
  document.getElementById('category-list')
);

ReactDom.render(
  <BoxList url="php/sku_rep.php" itemtype="Generics"/>,
  document.getElementById('generics-list')
);


ReactDom.render(
  <BoxList url="php/skus.php" itemtype="Merchandise"/>,
  document.getElementById('merchandise-list')
);*/
