'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var Loading = React.createClass({
  donothing: function() {
    return true;
  },

  getInitialState: function() {
    return {
            fn: this.donothing,
            };
  },

  begin: function(data) {
    data.fn(this.done);
  },

  componentDidMount: function() {
    Dispatch.register("START_WAIT", this.begin);
  },

  done: function(ev) {
    Dispatch.dispatch("SWITCHER_POP","");    
  },

  render: function() {
    var title = this.state.name;
    var id = this.state.key;
    var loadingmsg = "Loading...";
    return (
        <div className="loading-div">
          <div className="spacing-div"></div>
          <span className="loading-span">{loadingmsg}</span>
        </div>
    );
   }
});

module.exports=Loading;
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
