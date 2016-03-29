var assign = require('object-assign');

var _callbacks = {};
var _promises = {};

var Dispatcher = function(){};

Dispatcher.prototype = assign({}, Dispatcher.prototype, {
  register: function(key, callback) {
    if (!_callbacks.hasOwnProperty(key)) {
      _callbacks[key] = [];
    } 
    _callbacks[key].push(callback); 
  },

  dispatch: function(key, payload) {
    if (_callbacks.hasOwnProperty(key)) {
      _callbacks[key].forEach(function(callback, i) {
        callback(payload);
        });
    } else {
      console.log("Failed to dispatch event");
    }
  }
});

console.log(Dispatcher);
module.exports = Dispatcher;
