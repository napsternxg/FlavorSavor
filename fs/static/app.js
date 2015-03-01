// Create the Google Map
function initialize(){
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
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
        var flavor_colors = ["sweet","salty","sour","bitter", "spicy"];

      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "stations");

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
          var projection = this.getProjection(),
              padding = 10;

          var marker = layer.selectAll("svg")
              .data(data)
              .each(transform) // update existing markers
            .enter().append("svg:svg")
              .each(transform)
              .attr("class", "marker");
        r = d3.scale.log().domain([1,500]).range([1.0,8.0]);
        get_val = function(d,f){
            return d.flavor_sharer.flavors[f].reviews;
        };
          // Add a circle.
          marker.append("svg:circle")
              .attr("r", function(d){
                return r(d.flavor_sharer.aggregate.reviews+1);
            })
              .attr("cx", padding)
              .attr("cy", padding)
                .attr("class", function(d){
               arr = [get_val(d,"sweet"),get_val(d,"salty"),get_val(d,"sour"),get_val(d,"bitter"), get_val(d,"spicy")];
               return flavor_colors[arr.indexOf(d3.max(arr))];
});

          // Add a label.
          marker.append("svg:text")
              .attr("x", padding + 7)
              .attr("y", padding)
              .attr("dy", ".31em")
              .text(function(d) { return d.name; });

          function transform(d) {
            d = new google.maps.LatLng(d.latitude, d.longitude);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px");
          }
        };
      };

      // Bind our overlay to the map
      overlay.setMap(map);
      var center = new google.maps.LatLng(data[0].latitude,data[1].longitude);
        // using global variable:
      map.panTo(center);
      map.setZoom(20);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
