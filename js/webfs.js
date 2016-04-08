'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var __store = {};
var __status={};
var __list_of_keys = [];
var __work_idx = 0;
var __storeid = 0;
var Webfs = React.createClass({
  getInitialState: function() {
    return {
            };
  },
  save_done: function(data) {
    d = __store[data.tablename][0];
    if (d.tid != data.tid) {
      // now remove it from the list
      console.log("Success:Wrong transaction id found");
      // CRASH AND DIE BASICALLY
      return;
    }

    d.response = data;
    d.status = 0; // success
    // delete it from the list
    __store[data.tablename].shift();
    // call the callback
    d.cb(d);
    // set work to be done again for this queue if there is work
    if (__store[data.tablename].length == 0) {
      __status[data.name] = 1;
    } else {
      __status[data.name] = 0;
    }
  },
  save_fail: function(data) {
    d = __store[data.tablename][0];
    if (d.tid != data.tid) {
      // now remove it from the list
      console.log("Error:Wrong transaction id found");
      // CRASH AND DIE BASICALLY
      return;
    }

    if (d.retries < 3) {
      d.retries = d.retries + 1;
    } else {
      // crossed maximum retries delete it from the list
      __store[data.tablename].shift();
      d.response = data;
      d.status = 1; // success
      // call the callback
      d.cb(d);
    }
    // set work to be done again for this queue if there is work
    if (__store[data.tablename].length == 0) {
      __status[data.name] = 1;
    } else {
      __status[data.name] = 0;
    }
  },

  /*
   * adds the data to the service queue
   */
  save: function(data, cb) {
    //create a unique transaction id
    __storeid = __storeid + 1;
    // add it to the object so we get it back in the response
    data.data.tid = __storeid;
    // populate the tablename as the name passed in
    data.data.tablename = data.name;
    // add the callback to the object
    data.cb = cb;
    // add a fail counter
    data.retries = 0;
    if (!__store.hasOwnProperty(data.name)) {
      __store[data.name] = [];
      // 1 means no work to be done
      __status[data.name] = 1;
      __list_of_keys.push(data.name);
    }
    __store[data.name].push(data);
    // 0 means work to be done
    __status[data.name] = 0;
  },

  // makes one call
  makecall: function(key) {
    // set it to one so that if its not passed the next time
    // we come around, we ignore this queue
    __status[key] = 1;
    $.ajax({
      method:"POST",
      cache:false,
      url:__store[key][0].url,
      data:__store[key][0].data,
      success:this.save_done,
      error:this.save_fail
    });
  },
  /*
   * send worker
   */
  worker: function() {
    var loop_chk = 0;
    if (__list_of_keys.length == 0) {
      return;
    }
 
    if (__work_idx >= __list_of_keys.length) {
      __work_idx = 0;
    }
 
    while (__status[__list_of_keys[__work_idx]] != 0) {
      if (loop_chk == __list_of_keys.length) {
        // we have done a full loop and still no work to be done
        // go back to sleep
        return;
      }
      __work_idx+=1;
      if (__work_idx == __list_of_keys.length) {
        __work_idx = 0;
      }
      loop_chk+=1;
    }

    this.makecall(__list_of_keys[__work_idx]);
    __work_idx+=1;
  },

  retrieve: function(data) {
  },
  register: function(data) {
    __fs[data.name]=data.fns; 
  },
  componentDidMount: function() {
    Dispatch.dispatch("REGISTER_DATA", {fns: {write: this.save},
                                        name: "webfs"});
    setInterval(this.worker, 2000);
  },

  render: function() {
    locallist=[];
    for (var key in __local) {
      locallist.push(key);
    }
    List = locallist.map(function(localkey) {
      var name = localkey;
      var cnt = __local[localkey];
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

module.exports=Webfs;
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
