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
    var node = document.createElement('div');
    //Creates the event listener for clicking the marker
    //and places the marker on the map
    google.maps.event.addListener(marker, "click", function() {
      if (infowindow) infowindow.close();
      /**
       var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            data.addRows([
              ['Sweet', arr[1]],
              ['Salty', arr[2]],
              ['Sour', arr[3]],
              ['Bitter', arr[4]],
              ['Spicy', arr[5]]
            ]);
         // Set chart options
        var options = {'title':"Flavor Ratings of "+ d.name,
            'width':400,
            'height':200,
            'pieHole': 0.4,
            'colors' :["#803b66", "#ffde00", "#69bd45", "#5c8290", "#f05231"],
            'pieSliceTextStyle': {color: "black", fontSize: 12},
            'legend': {'position': 'bottom'},
        };
        var chart = new google.visualization.PieChart(node);
        **/
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
        var chart = new google.visualization.BarChart(node);
        chart.draw(data,options); 
      infowindow = new google.maps.InfoWindow({content: node});
      infowindow.open(map, marker);
    }); 
     
    //Pans map to the new location of the marker
    //map.panTo(myLatLng)
    return marker;
}


function initialize(){
    var markers = [];
    map = new google.maps.Map(document.getElementById('map'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631));
    map.fitBounds(defaultBounds);

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
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
    
    console.log("Loading application")
    // Load the station data. When the data comes back, create an overlay.
    d3.json("/static/yelp_business_urbana_champaign_il.json", function(data) {
      var overlay = new google.maps.OverlayView();
        data.forEach(function(d){
            addMarkerToMap(d);
        });
      var center = new google.maps.LatLng(data[0].latitude,data[1].longitude);
        // using global variable:
      map.panTo(center);
      map.setZoom(15);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
