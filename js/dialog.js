'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');


var Dialog= React.createClass({
  getInitialState: function() {
    return {
            msg: "None",
            btn: "None"
            };
  },

  updateMsg: function(data) {
    this.setState({msg: data.msg,
                   btn: data.btn});
  },

  componentDidMount: function() {
    Dispatch.register('DIALOG_MSG_UPDATE', this.updateMsg);
  },

  btnClick: function(event) {
    Dispatch.dispatch("SWITCHER_POP","");
  },

  render: function() {
    return (
        <div className="dialog-div">
           <span className="dialog-msg">{this.state.msg}</span>
           <button onClick={this.btnClick} className="dialog-btn">{this.state.btn}</button>
        </div>
    );
   }
});

module.exports=Dialog;
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
