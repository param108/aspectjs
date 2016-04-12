'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

// functions specific to this class
var SimpleForm = React.createClass({
  getInitialState: function() {
    return {
            url: "",
            saved: true, // is the update in the network somewhere ?
            modified: false, // modified since last save
            val: "",
            key: -1
            };
  },

  handleChange: function(event) {
    this.setState({val: event.target.value,
                   modified: true});
  },

  
  errupdate: function(data) {
    // called on errored write
  },

  update: function(data) {
    if (!this.state.modified) {
      if (data.val != this.state.val) {
        // there could be an outstanding write
        // so we dont set saved to true or false
        this.setState({val: data.val,
                       key: data.key});
      } else {
        this.setState({val: data.val,
                       key: data.key,
                       saved: true});
      }
    }
  },

  reset: function(event) {
    // get back to the last written value
    this.setState({modified: false,
                   saved: true});
    Dispatch.dispatch("GET_DATA", {fstype: "webfs",
                                    name: "simpleform.data",
                                    cb: this.update,
                                    ecb: this.errupdate,
                                    url: this.props.url, 
                                    data: {val: "",
                                           key: this.state.key}});
  },

  write: function(event) {
    this.setState({modified: false,
                   saved: false});
    Dispatch.dispatch("SAVE_DATA", {fstype: "webfs",
                                    name: "simpleform.data",
                                    cb: this.update,
                                    ecb: this.errupdate,
                                    url: this.props.url, 
                                    data: {val: this.state.val,
                                           key: this.state.key}});
  },

  componentDidMount: function() {
    this.setState({url:this.props.url,
                   val:"",
                   saved:true
                   });
    Dispatch.dispatch("REGISTER_DATA", {fstype: "webfs",
                                        name: "simpleform.data",
                                        cb: this.update,
                                        ecb: this.errupdate,
                                        url: this.props.url, 
                                        data: {val: ""}}); 
  },

  render: function() {
    var val = this.state.val;
    return (
        <div onClick={this.showAspect} className="simpleform">
           <textarea id="testinput" onChange={this.handleChange} value={val}></textarea>
           <button onClick={this.write} id="simpleform-save">Save</button>
           <button onClick={this.reset} id="simpleform-reset">Reset</button>
        </div>
    );
   }
});

module.exports=SimpleForm;
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
