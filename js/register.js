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

var Register = React.createClass({
  getInitialState: function() {
    return {
            msg: "",
            };
  },

  componentDidMount: function() {
  },

  cancelBtn: function(event) {
    Dispatch.dispatch("SWITCHER_POP", "");
  },

  registerBtn: function(event) {
    // clear the error
    $('.register-msg').text("");
    var email=$('.register-email').val();
    var passwd=$('.register-passwd').val();

    // clear passwd
    $('.register-passwd').val("");
    var thisobj = this;
    $.ajax({url: "/doitgym/user/register/",
            method: "POST",
            data: {email:email,
                   password:passwd},
            success: function(data) {
                   if (data.status == 0) {
                     Dispatch.dispatch("DIALOG_MSG_UPDATE", {msg: "A verification link has been sent to your email address "+email, btn: "Ok"});
                     Dispatch.dispatch("SWITCHER_POP", "#dialog");
                     Dispatch.dispatch("SWITCHER_PUSH", "#dialog");
                   } else {
                     thisobj.setState({msg:data.msg});
                   }
                  },
            error: function(obj, status, err) {
                     thisobj.setState({msg:err});
                  } 
           });
  },

  render: function() {
    var rbtn = "Register";
    var cbtn = "Cancel";
    var msg = this.state.msg;
    return (
        <div className="register">
        <span className="register-msg">{msg}</span>
        <input className="register-email" type="text" placeholder="Email Id"></input>
        <input className="register-passwd" type="password" placeholder="Password"></input>
        <button onClick={this.registerBtn} className="register-reg-button">{rbtn}</button>
        <button onClick={this.cancelBtn} className="register-cancel-button">{cbtn}</button>
        </div>
    );
   }
});

module.exports=Register;
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
