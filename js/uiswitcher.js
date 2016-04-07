'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var UISwitcher = React.createClass({
  getInitialState: function() {
    return {
            stack: [],
            present: "",
            };
  },

  push: function(data) {
    $(this.state.present).hide();
    $(data).show();
    var stack = this.state.stack.slice();
    stack.push(data);
    this.setState({ stack: stack,
                    present: data}); 
  },

  /* data is ignored */
  pop: function(data) {
    /* can only pop if there is more than one entry on stack */
    if (this.state.stack.length == 1) {
      return;
    }
    $(this.state.present).hide();
    var pre = this.state.stack[this.state.stack.length - 2];
    $(pre).show();
    var stack = this.state.stack.slice();
    stack.pop();
    this.setState({ stack: stack,
                    present: pre}); 
  },

  clear: function(data) {
    var pre = this.state.stack[this.state.stack.length - 1];
    this.setState({ stack: [pre],
                    present: pre}); 
  
  },

  componentDidMount: function() {
    Dispatch.register("SWITCHER_PUSH",this.push);    
    Dispatch.register("SWITCHER_POP",this.pop);    
    Dispatch.register("SWITCHER_CLEAR", this.clear);
 
    this.setState({present:this.props.start,
                   stack:[this.props.start]
                   });
  },

  render: function() {
    var List = this.state.stack.map(function(stackelem) {
      return (
        <span>{stackelem}</span>
      );
    });
    return (
        <div className="switcher-list">
          {List}
        </div>
    );
   }
});

module.exports=UISwitcher;
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
