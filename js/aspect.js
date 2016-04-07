'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

// functions specific to this class
function hideAspectList(data) {
  // do nothing for now
}

var Aspect = React.createClass({
  getInitialState: function() {
    return {
            name: "",
            score: "",
            belt: "",
            key: "",
            };
  },

  componentDidMount: function() {
    this.setState({name:this.props.name,
                   score: this.props.score,
                   belt: this.props.belt,
                   key:this.props.key
                   });
  },

  showAspect: function(ev) {
    Dispatch.dispatch("SHOW_ASPECT",this.props);    
  },

  render: function() {
    var title = this.state.name;
    var id = this.state.key;
    var score = this.state.score;
    var belt = this.state.belt;
    var disp = belt.toString()+"/"+score.toString();
    return (
        <div onClick={this.showAspect} className="aspect">
           <span className="aspect-name">{title}</span><span className="aspect-score">{disp}</span>
        </div>
    );
   }
});

module.exports=Aspect;
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
