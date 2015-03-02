// Create the Google Map
var map;
google.load('visualization', '1.0', {'packages':['corechart']});
//google.load("visualization", "1.1", {packages:["bar"]});

// Add default value to always get the default case in case no value is greater than 0 in the array. 
var marker_colors = {"default": "444444","sweet": "803b66","salty": "ffde00","sour": "69bd45",
    "bitter": "5c8290", "spicy": "f05231"};

var flavor_colors = ["default","sweet","salty","sour","bitter", "spicy"];
var color_arr = ["#803b66", "#ffde00", "#69bd45", "#5c8290", "#f05231"];

var key_vals = ["count","reviews","tips","useful_votes","likes","stars"]
var get_val_all = function(d,f,k){
    if(k == "stars"){
        return d.flavor_sharer.flavors[f][k]/5.0;
    }
    return d.flavor_sharer.flavors[f][k];
}
var get_val = function(d,f){
    return d.flavor_sharer.flavors[f].count;
};

var m_color = function(arr){
    var max_val = d3.max(arr);
    var index_max = arr.indexOf(max_val);
    var max_flavor = flavor_colors[index_max];
    var max_color = marker_colors[max_flavor];
    //console.log("Arr", arr, "MAX", max_val, "Flavor", max_flavor, "Color", max_color);
    return max_color;
};
var m_info = function(d){
    return "<h3>"+d.name+"</h3>";
}

var infowindow;
//This function will add a marker to the map each time it
//is called.  It takes latitude, longitude, and html markup
//for the content you want to appear in the info window
//for the marker.
function addMarkerToMap(d){
    var myLatLng = new google.maps.LatLng(d.latitude, d.longitude);
    var m_id = d.business_id;
    var info = m_info(d);
    //console.log("Business: ", d.name);
    var arr = [0,get_val(d,"sweet"),get_val(d,"salty"),get_val(d,"sour"),get_val(d,"bitter"), get_val(d,"spicy")];
    var pinColor = m_color(arr) ;
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: pinImage,
        shadow: pinShadow,
        animation: google.maps.Animation.DROP,
    });
    var container = $(document.createElement('div')).addClass("info-window")
    //console.log("container",container);
    var node = $(document.createElement('div')).addClass("charts");
    $(container).append($(node));
    $(container).append($("#share-template").clone().addClass("show-share").attr("data-name",d.name));
    $(container).find("#review").eq(0).val("Eating at "+d.name+" #FlavorSavor ");
    //addEvents(container)

    //Creates the event listener for clicking the marker
    //and places the marker on the map
    google.maps.event.addListener(marker, "click", function() {
      if (infowindow){
          infowindow.close();
        $(document).off(".btn");
      }
       var data_arr = [
               ["Rating"], ["Counts"], ["Reviews"], ["Tips"], ["Useful Votes"], ["Likes"], ["Stars"]];
       for(i = 1; i < flavor_colors.length; i++){ // start from 1 because of default
           data_arr[0].push(flavor_colors[i]);
           for(j = 0; j < key_vals.length; j++){
               data_arr[j+1].push(get_val_all(d,flavor_colors[i],key_vals[j]));
           }
       }
       var data = google.visualization.arrayToDataTable(data_arr);
       var option_colors = [];

         // Set chart options
        var options = {
            'title':"Flavor Ratings of "+ d.name,
            'isStacked': true,
            'colors': color_arr,
            'width':400,
            'height':200,
            'bar': { groupWidth: '75%' },
            'chartArea':{width:'60%',height:'75%'},
            'legend': { position: 'bottom', maxLines: 3 },

        };
        var chart = new google.visualization.BarChart(node[0]);
        chart.draw(data,options); 
      infowindow = new google.maps.InfoWindow({content: container[0]});
      infowindow.open(map, marker);
        google.maps.event.addListener(infowindow, 'domready', function(){ 
                     //jQuery code here
            
            console.log("InfoWindow Context", $(document, infowindow));
            console.log("InfoWindow Content", $(infowindow.getContent()));
            console.log("InfoWindow Only Content", $(infowindow));
            $(document, infowindow).find(".share .buttons").each(function(i,t){
                t.onclick = function (e) {
                var elem = $(e.target);
                var cntrl = "#"+elem.text();
                console.log(elem, elem.text());
                var review = $(e.target).siblings("#review").eq(0);
                var result = review.val() + cntrl + " ";
                if (result.length <= review.attr('maxlength')) {
                    review.val(result);
                    updateCountdown(e);
                }
            }});
            $(document).on('change','.share #review',updateCountdown);
            $(document).on('keyup','.share #review',updateCountdown);
            $(document).on('click','.share .twitter-share',function(e){
                var review = $(e.target).parent().find('#review');
                var text = $(review).val();
                console.log($(e.target),review,text);
                var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
                $(e.target).attr('href',url);
            });
            $(document, '.share #review').trigger('change');
        }); 
    }); 
     
    //Pans map to the new location of the marker
    //map.panTo(myLatLng)
    return marker;
}

var chicago = new google.maps.LatLng(41.85, -87.65);

/**
 * The CenterControl adds a control to the map that recenters the map on Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map,name) {

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginLeft = '5px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to see food places in '+name;
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = name;
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    window.location.href="/test/"+name.toUpperCase();
  });

}


//var DATASET="/static/yelp_business_urbana_champaign_il.json";
function initialize(){
    var markers = [];
    //var map_div = $("#map")[0];
    var map_div = document.getElementById("map");
    console.log(map_div);
    map = new google.maps.Map(map_div, {
    mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631));
    map.fitBounds(defaultBounds);
    
    // Create the DIV to hold the control and
  // call the CenterControl() constructor passing
  // in this DIV.
var places = ["Urbana-Champaign","Pittsburg","Las-Vegas"]
    $.each(places, function(i,p){
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map,p);

  centerControlDiv.index = i+1;
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

});

    // Create the search box and link it to the UI element.
    //var input = /** @type {HTMLInputElement} */(
    //    $("#pac-input")[0]);
    var input = document.getElementById("pac-input");
    console.log(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
    });
   var bounds = new google.maps.LatLngBounds(); 
    console.log("Loading application")
    // Load the station data. When the data comes back, create an overlay.
    d3.json(DATASET, function(data) {
      var overlay = new google.maps.OverlayView();
        data.forEach(function(d){
            addMarkerToMap(d);
            bounds.extend(new google.maps.LatLng(d.latitude,d.longitude));
        });
        
      var center = bounds.getCenter();
        // using global variable:
        map.fitBounds(bounds);
        map.panTo(center);
      //map.setZoom(15);
    });
}

function updateCountdown(e) {
    // 140 is the max message length
    console.log("Event Target", $(e.target).parent());
    var review = $(e.target).parent().find('#review');
    var countdown = $(e.target).parent().find('.countdown').eq(0);
    var remaining = 140 - $(review).val().length;
    $(countdown).text(remaining + ' characters remaining');
}

$(document).ready(function() {
    //updateCountdown();
    initialize();
    //google.maps.event.addDomListener(window, 'load', initialize);

});

