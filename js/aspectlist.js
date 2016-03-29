'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var Aspect = require('./aspect');

// functions specific to this class
function hideAspectList(data) {
  // do nothing for now
}

var AspectList = React.createClass({
  getInitialState: function() {
    return {
            data: []
            };
  },

  componentDidMount: function() {
    Dispatch.register("HideAspectList", hideAspectList);
    $.ajax({
      url: this.props.url, 
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.data}); 
      }.bind(this)}); 
  },

  render: function() {
    var newdata = this.state.data;
    var List = newdata.map(function (itemdata) {
        return (
          <Aspect key={itemdata.id} name={itemdata.name} url={itemdata.url} />
        );
      });

    return (
        <div className="aspects">
          <div className="add-aspects">
            <input type="text" placeholder="an aspect of your life"/>
            <button className="add-aspects-btn">+</button> 
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
