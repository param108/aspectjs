'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var Aspect = require('./aspect');


var AspectList = React.createClass({
  getInitialState: function() {
    return {
            data: []
            };
  },

  loadAspects: function(data) {
  },
  componentDidMount: function() {
    Dispatch.register("USER_LOGGED_IN", this.loadAspects);
  },
  
  addAspectHandler: function(event) {
    Dispatch.dispatch("NEW_ASPECT_DETAIL", $('#add-aspect-name').val());
    Dispatch.dispatch("SWITCHER_PUSH", "#aspect-detail");
    $('#add-aspect-name').val("");
  },

  render: function() {
    var newdata = this.state.data;
    var List = newdata.map(function (itemdata) {
        return (
          <Aspect key={itemdata.id} name={itemdata.name} score={itemdata.score} belt={itemdata.belt} futures={itemdata.futures} moments={itemdata.moments} />
        );
      });

    return (
        <div className="aspects">
          <div className="add-aspects">
            <input id="add-aspect-name" type="text" placeholder="an aspect of your life"/>
            <button onClick={this.addAspectHandler} className="add-aspects-btn">+</button> 
          </div>
          {List}
        </div>
    );
  }
});

module.exports=AspectList;
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
