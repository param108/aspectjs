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

var Login = React.createClass({
  getInitialState: function() {
    return {
            msg: "",
            };
  },

  componentDidMount: function() {
  },

  loginBtn: function(event) {
    var email=$('.login-email').val();
    var passwd=$('.login-passwd').val();

    // clear passwd
    $('.login-passwd').val("");
    var thisobj = this;
    $.ajax({url: "/doitgym/user/login/",
            method: "POST",
            data: {email:email,
                   password:passwd},
            success: function(data) {
                   if (data.status == 0) {
                     Dispatch.dispatch("USER_LOGGED_IN", email);
                     Dispatch.dispatch("SWITCHER_PUSH", "#aspect-list");
                     // clear the error
                     $('.login-msg').text("");
                   } else {
                     thisobj.setState({msg:data.msg});
                  }},
            error: function(obj, status, err) {
                     thisobj.setState({msg:err});
                  } 
           });
  },

  regBtn: function(event) {
    Dispatch.dispatch("SWITCHER_PUSH", "#register");
    $('.login-email').val('');
    $('.login-passwd').val('');
  },

  render: function() {
    var btn = "Login";
    var rbtn = "Sign Up";
    var msg = this.state.msg;
    return (
        <div className="login">
        <span className="login-msg">{msg}</span>
        <input className="login-email" type="text" placeholder="Email Id"></input>
        <input className="login-passwd" type="password" placeholder="Password"></input>
        <button onClick={this.loginBtn} className="login-btn">{btn}</button>
        <button onClick={this.regBtn} className="login-reg-button">{rbtn}</button>
        </div>
    );
   }
});

module.exports=Login;
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
