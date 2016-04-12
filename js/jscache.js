'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var __latest_tid = 1;
var __local = {};
var __fs = {};
function init_local_data() {
  return ({ data: null,
           tid: 0,
           func: "",
           finished: false}) ;
}
var JSCache = React.createClass({
  getInitialState: function() {
    return {
            };
  },
  save_local: function(data) {
  },
  save_done: function(data) {
    if (__local.hasOwnProperty(data.name)) {
      if (__local[data.name].request.data.tid == data.tid) {
        __local[data.name].finished = true;
        if (data.status == 0) {
          // update the local data if its a successful read
          __local[data.name].data = data;
          __local[data.name].request.cb(__local[data.name].data);
        } else {
          __local[data.name].request.ecb(__local[data.name].data);
        }
      }
    } 
    // dont do anything if the the tid dont match
  },
  save: function(data) {
    if (__local.hasOwnProperty(data.name)) {
      __local[data.name].num = __local[data.name].num + 1;
      __local[data.name].func = 'write';
      __local[data.name].finished = false;

      // update the transaction id
      __latest_tid += 1;
      data.data.tid = __latest_tid;
      data.data.name = data.name;
      __local[data.name].data = data.data;
      __local[data.name].request = data;
      // local save done

      // add '/write' to the url for write and
      // '/read' for read
      data.url = data.url + '/write';
      if (__fs.hasOwnProperty(data.fstype)) {
        __fs[data.fstype].write(data,this.save_done);
      } else {
        console.log("Failed to find filesystem for:"+data.fstype);
      }
    } else {
      console.log("Failed to find data:"+data.name);
    }
  },
  register: function(data) {
    if (!__local.hasOwnProperty(data.name)) {
      __local[data.name] = init_local_data();
    }
    __local[data.name].func = 'read';
    __local[data.name].finished = false;

    // update the transaction id
    __latest_tid += 1;
    data.data.tid = __latest_tid;
    data.data.name = data.name;
    __local[data.name].request = data;
    __local[data.name].reg_req = data;
    // add '/write' to the url for write and
    // '/read' for read
    data.url = data.url + '/read';
    if (__fs.hasOwnProperty(data.fstype)) {
      __fs[data.fstype].read(data,this.save_done);
    } else {
      console.log("Failed to find filesystem for "+data.name);
    }
  },
  retrieve: function(data) {
    if (__local.hasOwnProperty(data.name)) {
      if (__local[data.name].data != null) {
          data.cb(__local[data.name].data);
      } else {
          // need to wait for a read to start
      }
    }  
  },
  register_fs: function(data) {
    __fs[data.name]=data.fns; 
  },

  reload: function() {
    for (var key in __local) {
      if (__local[key].finished) {
        // fire another read if its finished
        if (__fs.hasOwnProperty(__local[key].request.fstype)) {
          __local[key].request = __local[key].reg_req;
          __latest_tid += 1;
          __local[key].request.data.tid = __latest_tid;
          __local[key].func = "read";
          __local[key].finished = false;
          __fs[__local[key].request.fstype].read(__local[key].request,this.save_done);
        }
      } else {
      }
    }
  },

  componentDidMount: function() {
    Dispatch.register("SAVE_DATA", this.save);
    Dispatch.register("REGISTER_DATA", this.register);
    Dispatch.register("REGISTER_FS", this.register_fs);
    Dispatch.register("GET_DATA", this.retrieve);
    setInterval(this.reload, 1000);
  },

  render: function() {
    var locallist=[];
    for (var key in __local) {
      locallist.push(key);
    }
    var List = locallist.map(function(localkey) {
      var name = localkey;
      var cnt = 0;
      if (__local[localkey].data) {
        cnt = __local[localkey].data.tid;
      }
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

module.exports=JSCache;
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
