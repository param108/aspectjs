'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var AspectList = require('./aspectlist');
var AspectDetail = require('./aspect-detail');
var UISwitcher= require('./uiswitcher');
var Loading= require('./loading');
var JSCache = require('./jscache');
var Login = require('./login');
var Register = require('./register');
var Dialog = require('./dialog');

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = "";

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ready(function() {
ReactDom.render(
  <Login/>,
  document.getElementById('login')
);
ReactDom.render(
  <Register/>,
  document.getElementById('register')
);

ReactDom.render(
  <AspectDetail/>,
  document.getElementById('aspect-detail')
);

ReactDom.render(
  <Dialog/>,
  document.getElementById('dialog')
);

ReactDom.render(
  <AspectList url="/doitgym/aspects/list/"/>,
  document.getElementById('aspect-list')
);
ReactDom.render(
  <UISwitcher start="#login"/>,
  document.getElementById('uiswitcher')
);
ReactDom.render(
  <Loading/>,
  document.getElementById('loading')
);
ReactDom.render(
  <JSCache/>,
  document.getElementById('database')
);
// Get the csrf token
$.ajax({url: '/doitgym/user/getcsrf/',
        method: 'GET',
        success: function(data) {
          console.log("GOT CSRF");
          csrftoken= getCookie('csrftoken');
          $.ajaxSetup({
            beforeSend: function(xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
            }
          });
        }.bind(this)}); 
});
