'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var AspectDetail = React.createClass({

  renderNewAspect: function(data) {
    console.log("rendering new aspect-detail");
    this.setState({
      id: "",
      name: data, 
      belt: "white",
      score: 0,
      fid: "",
      fseq: 0,
      future: "",
      status: "in progress",
      notes:"",
      moments: []
    });
    $('.aspect-detail-name').val(data);
  },

  getInitialState: function() {
    return {
      id: "",
      name: "", 
      belt: "white",
      score: 0,
      fid: "",
      fseq: 0,
      future: "",
      status: "in progress",
      notes:"",
      moments: []
    };
  },

  componentDidMount: function() {
    Dispatch.register("NEW_ASPECT_DETAIL", this.renderNewAspect);
    this.setState({
      id: "",
      name: "", 
      belt: "white",
      score: 0,
      fid: "",
      fseq: 0,
      future: "",
      status: "in progress",
      notes:"",
      moments: []
    });
  },
  save: function () {
  },
  cancel: function() {
    Dispatch.dispatch("SWITCHER_POP","");
    /* FIXME do some cleanup */
  }, 
  render: function() {
    console.log("rendering aspect-detail");
    var title = this.state.name;
    if (title.length == 0) {
      title = "none";
    }
    var id = this.state.id;
    var score="Score: "+this.state.belt+"/"+this.state.score;
    var future_label="Write the future you want to see here:";
    var notes_label="Notes:";
    var save_btn = "Save";
    var cancel_btn = "Cancel";

    $("#aspect-detail").scrollTop(0);
    return (
        <div className="aspect-detail-data">
           <div className="aspect-detail-menu"></div>
           <input type="text" className="aspect-detail-name" placeholder="an aspect of your life"></input>
           <span className="aspect-detail-score">{score}</span>
           <span className="aspect-detail-label">{future_label}</span>
           <textarea className="aspect-detail-future"></textarea>
           <span className="aspect-detail-label">{notes_label}</span>
           <textarea className="aspect-detail-notes"></textarea>
           <button className="aspect-detail-btn-save" onClick={this.save}>{save_btn}</button>
           <button className="aspect-detail-btn-cancel" onClick={this.cancel}>{cancel_btn}</button>
        </div>
    );
   }
});

module.exports=AspectDetail;
/*ReactDom.render(
  <BoxList url={countriesUrl} itemtype="Countries"/>,
  document.getElementById('box-list')
);*/

