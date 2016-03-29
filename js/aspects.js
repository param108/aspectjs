'use strict';

var assign = require('object-assign');
var Dispatcher = require('./dispatcher');
var Dispatch = assign({}, Dispatcher.prototype,{});
var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var ListItem = require('./listitem');
var chosenLocation="";
var chosenCategory="";
var BoxList = React.createClass({
  getInitialState: function() {
    var width = 550;
    if ($(window).width() < 550) {
        width=Math.floor($(window).width()/110)*110;
    }
    return {filter: 'none',
            data: [],
            windowWidth: width};
  },

  handleResize: function(e) {
    var width = 550;
    if ($(window).width() < 550) {
        width=Math.floor($(window).width()/110)*110;
    }
    console.log("width="+width);
 
    this.setState({windowWidth: width});
  }, 

  chosen: function(data) {
    console.log("chosenItem:"+data.itemtype+":"+data.name+":"+this.props.itemtype);
    if (this.props.itemtype == 'Airports') {
      if (data.itemtype == 'Countries') {
        var data_name = data.name;
        if (data_name == 'placeholder') {
            data_name='none';
        }
        var airportsUrl=encodeURI("php/airports.php?mode=list&list="+data_name);
           $.ajax({
             url: airportsUrl, 
             dataType: 'json',
             cache: false,
             success: function(data) {
            this.setState({data: data}); 
            // clear the filter when changing countries!
            this.setState({filter:'none'});
          }.bind(this)}); 
      } else if (data.itemtype == 'Airports') {
        if (data.name == 'placeholder') {
        this.setState({filter:'none'});
        chosenLocation='none';
        } else {
        this.setState({filter:data.name});
        chosenLocation=data.key;
        }
      }
    } else if (this.props.itemtype == 'Countries') {
        if (data.itemtype == 'Countries') {
            if (data.name == 'placeholder') {
                this.setState({filter:'none'});
            } else {
                this.setState({filter:data.name});
            }
        }
    } else if (this.props.itemtype == 'Consolidated') {
      if (data.name == "placeholder") {
        if (data.itemtype == 'Countries') {
          this.setState({data: []});
        } else if (data.itemtype == 'Airports') {
          var output = this.state.data.filter(function(itemdata) {
              if (itemdata.itemtype == 'Airports') {
                  return false;
              }
              return true;
          });
          this.setState({data: output});
        } else if (data.itemtype == 'Consolidated') {
          //$("#carousel").fadeIn();
          $("#box-list").fadeIn();
          $("#airports-list").fadeIn();
          $("#consolidate-list").fadeOut(); 
          $("#category-list").fadeOut(); 
        }
      } else {
        if (this.state.data.filter(function(itemdata) {
          if (itemdata.name == data.name &&
              itemdata.itemtype == data.itemtype) {
            return true;
          } 
          return false;
        }).length == 0) {
          var output = this.state.data.slice(0);
          // we want country which will be first chosen to be left most
          // next item will be to the right
          output.push(data);
          this.setState({data: output});
        } 
        if (data.itemtype == "Countries") {
          // If the button pressed is not a placeholder
          // If it is the chosen Countries again
          // We need to clear the chosen airports as that
          // will be deselected automatically.
          var output = this.state.data.filter(function(itemdata) {
              if (itemdata.itemtype == 'Airports') {
                  return false;
              }
              return true;
          });
          this.setState({data: output});
        }
        if (data.itemtype == 'Airports') {
            $("#carousel").fadeOut();
            $("#box-list").fadeOut();
            $("#airports-list").fadeOut();
            $("#consolidate-list").fadeIn(); 
            $("#category-list").fadeIn(); 
        }
      }
    } else if (this.props.itemtype == 'Categories') {
      if (data.itemtype == "Airports" && data.name != "placeholder") {
        var categoryUrl=encodeURI("php/categories.php?location_id="+data.key);
        $.ajax({
          url: categoryUrl, 
          dataType: 'json',
          cache: false,
          success: (function(data) {
          this.setState({data: data});        
          }).bind(this)
        });
      } else if ((data.itemtype == "Airports"|| data.itemtype == "Consolidated") && data.name == "placeholder") {
        this.setState({filter:'none'});
      } else if (data.itemtype == "Categories") {
        if (data.name == 'placeholder') {
        chosenCategory='none';
        this.setState({filter:'none'});
        } else {
        chosenCategory=data.key;
        this.setState({filter:data.name});
        }
      } 
    } else if (this.props.itemtype == "Generics") {
      if (data.itemtype == "Generics") {
        if (data.name == 'placeholder') {
          this.setState({filter:'none'});
        } else {
          this.setState({filter:data.name});
        }
      } else if ((data.itemtype == "Airports"||data.itemtype == "Categories" || data.itemtype == "Consolidated") 
         && data.name == "placeholder") {
        this.setState({filter:'none'});
        $("#generics-list").fadeOut();
      } else if (data.itemtype == "Categories" && data.name != "placeholder") {
        console.log("category_id="+data.key);
        var genericsUrl=encodeURI("php/sku_rep.php?location_id="+chosenLocation+"&category_id="+data.key);
        $.ajax({
          url: genericsUrl, 
          dataType: 'json',
          cache: false,
          success: (function(data) {
          this.setState({data: data});        
          this.setState({filter:'none'});
          $("#generics-list").fadeIn();
          }).bind(this)
        });
      }
    } else if (this.props.itemtype == 'Merchandise') {
      if ((data.itemtype == "Airports"||data.itemtype == "Categories" || data.itemtype == "Consolidated" 
         || data.itemtype == "Generics") 
         && data.name == "placeholder") {
        $("#merchandise-list").fadeOut();
      } else if (data.itemtype == "Generics" && data.name != "placeholder") {
        console.log("category_id="+data.key);
        var merchandiseUrl=encodeURI("php/skus.php?location_id="+chosenLocation+"&category_id="+chosenCategory+"&generic_name="+data.name);
        $.ajax({
          url: merchandiseUrl, 
          dataType: 'json',
          cache: false,
          success: (function(data) {
          this.setState({data: data});        
          $("#merchandise-list").fadeIn();
          }).bind(this)
        });
      }
    }
  },

  chosenDropDownCountry: function(data) {
    // add the chosen country from drop down
    // to the beginning of the list and filter
    // on it, so that clicking the placeholder
    // will expand to show a number of airports
    // again
    if (this.props.itemtype == 'Countries') {
      // dont allow repeats
      if (this.state.data.filter(function(itemdata) {
            if (itemdata.id == data.id) {
                return true;
            } 
            return false;
        }).length == 0) {
         var output = this.state.data.slice(0);
         output.unshift(data);
         this.setState({data: output});
      }
    }
    Dispatch.dispatch('ChosenItem', {key: data.id,
                                     itemtype: data.itemtype,
                                     name: data.name,
                                     url: data.url,
                                     code: ""});

  },
  

  componentDidMount: function() {
    Dispatch.register("CountryFromList", this.chosenDropDownCountry);
    Dispatch.register('ChosenItem', this.chosen);
    if (this.props.itemtype != "Consolidated") {
      $.ajax({
        url: this.props.url, 
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({data: data}); 
        }.bind(this)}); 
    }
    window.addEventListener('resize', this.handleResize);
  },

  // for Airports and Countries we add a special icon at the end of the list
  // Depending on the itemtype this can be used to choose other options
  // than the ones on screen
  addPlaceholder: function(itemtype, List) {
    var corner_pc = (this.state.windowWidth/110)-1;

    // if the List is not long enough just bung it on the end
    if (List.length == 0) {
      corner_pc = 0;
    } else if (List.length < corner_pc) {
      corner_pc = List.length;
    }

    var placeholder = { id:itemtype+"_placeholder", name:"placeholder", url:"placeholder.png", itemtype:itemtype, parenttype:itemtype };

    List.splice(corner_pc, 0,
          <ListItem key={placeholder.id} name={placeholder.name} url={placeholder.url} code="" itemid="-1"  itemtype={placeholder.itemtype} parenttype={placeholder.parenttype}/>
    );
 
    if (itemtype == "Countries" && chosenCountries=="mode=popular&num=5") {
      List = List.slice(0, corner_pc+1);
    }

    return List;
  },

  getPromptString: function(itemtype) {
    if (itemtype == "Countries") {
      return ("Choose a country to Start");
    } else if (itemtype == "Airports") {
      return ("Choose an Airport from where you want to shop");
    } else if (itemtype == "Consolidated") {
      return ("Chosen");
    } else if (itemtype == "Categories") {
      return ("Categories");
    } else if (itemtype == "Generics") {
      return ("Brand");
    } else if (itemtype == "Merchandise") {
      return ("Merchandise");
    }

  },

  render: function() {
   var pparent = this;
   var itemtype = this.props.itemtype;
   var newdata=this.state.data;
   var filter = this.state.filter;
   if (filter != 'none') {
    newdata = this.state.data.filter(
      function(itemdata) {
        if (itemdata.name == filter) {
          return true;
        } 
        return false;  
      });
   }
   var List=newdata.filter(function(itemdata) {
      if (itemdata.name != null) {
          return true;
      }
      return false;
    }).map(function (itemdata) {

      if (itemtype == "Food") {
        return (
          <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.url} itemid={itemdata.id} price={itemdata.price} spicy={itemdata.spicy} course={itemdata.course} gravy={itemdata.gravy} desc={itemdata.desc} itemtype={itemtype} parenttype={itemtype}/>
        );
      } else if (itemtype == "Countries") {
        return (  <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.url} desc={itemdata.desc} id={itemdata.id} itemtype={itemtype} parenttype={itemtype}/>
        );
      } else if (itemtype == "Airports") {
        return (  <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.url} desc={itemdata.desc} id={itemdata.id} itemtype={itemtype} code={itemdata.code} parenttype={itemtype}/>
        );
      } else if (itemtype == "Consolidated") {
        if (itemdata.itemtype == "Airports") {
            return (  <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.url} desc={itemdata.desc} id={itemdata.id} itemtype={itemdata.itemtype} code={itemdata.code} parenttype={itemtype}/>);
        } else if (itemdata.itemtype == "Countries") {
            return (  <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.url} desc={itemdata.desc} id={itemdata.id} itemtype={itemdata.itemtype} parenttype={itemtype}/>);
        }
      } else if (itemtype == "Categories") {
        return ( <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.category_image} itemtype={itemdata.itemtype} parenttype={itemtype} id={itemdata.id}/>);
      } else if (itemtype == "Generics") {
        return ( <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.item_image} itemtype={itemdata.itemtype} parenttype={itemtype} id={itemdata.id}/>);
      } else if (itemtype == "Merchandise") {
        console.log("Merchandise:"+itemdata.image);
        return ( <ListItem key={itemdata.id} name={itemdata.name} url={itemdata.image} itemtype={itemdata.itemtype} parenttype={itemtype} id={itemdata.id} desc={itemdata.desc} price={itemdata.price} currency={itemdata.currency} company={itemdata.company} hsprice={itemdata.highstreet_price}/>);
      }
   });

   // the idea here is that if we are not filtering we dont need a 
   // 'Choose another Airport' button
   if (itemtype == "Countries" || 
      (itemtype == "Consolidated" && List.length !=0) ||
      (itemtype == "Airports" && filter != 'none') ||
      (itemtype == "Generics" && filter != 'none') ||
      (itemtype == "Categories" && filter != 'none')) {
      List = this.addPlaceholder(itemtype, List); 
      var prompt=this.getPromptString(itemtype);
      return (
        <div className="items" style={{width:this.state.windowWidth+'px'}}>
        <p className="bold">{prompt}</p>
          {List}
        </div>
      );
   } else if (itemtype == "Airports") {
        var prompt=this.getPromptString(itemtype);
        if (List.length > 0) {
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               {List}
             </div>
            );
        } else {
            // for an empty list tell user that no country has been chosen
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               <p className="listempty">No country chosen</p>
             </div>
            );
        }
   } else if (itemtype == "Categories") {
        var prompt=this.getPromptString(itemtype);
        if (List.length > 0) {
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               {List}
             </div>
            );
        } else {
            // for an empty list tell user that no country has been chosen
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               <p className="listempty">No merchandise registered for this location</p>
             </div>
            );
        }
   } else if (itemtype == "Generics") {
        var prompt=this.getPromptString(itemtype);
        if (List.length > 0) {
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               {List}
             </div>
            );
        } else {
            // for an empty list tell user that no country has been chosen
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               <p className="listempty">No Brands registered for this location</p>
             </div>
            );
        }
   } else if (itemtype == "Merchandise") {
        var prompt=this.getPromptString(itemtype);
        if (List.length > 0) {
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               {List}
             </div>
            );
        } else {
            // for an empty list tell user that no country has been chosen
            return (
             <div className="items" style={{width:this.state.windowWidth+'px'}}>
               <p className="bold">{prompt}</p>
               <p className="listempty">No merchandise registered for this location</p>
             </div>
            );
        }
   } else {
      return (
        <div className="items" style={{width:this.state.windowWidth+'px'}}>
          {List}
        </div>
      );
   }
  }
});

if (chosenAirports.length == 0) {
  chosenAirports="mode=list&list=none";
}

if (chosenCountries.length == 0) {
  chosenCountries="mode=popular&num=5";
}

// this should be set by the php script in a script tag
var airportsUrl="php/airports.php?"+chosenAirports;
var countriesUrl="php/countries.php?"+chosenCountries;

ReactDom.render(
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
);
