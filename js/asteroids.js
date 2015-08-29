$(function() {
  var options = {
    center: new google.maps.LatLng(37.7577, -122.4376),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  }
  var map = new google.maps.Map($("#map")[0], options);

  $.ajax({
    url: "https://data.nasa.gov/resource/gh4g-9sfh.json",
    type: "GET",
    data: {
      "fall" : "Found",
      "$where": "mass > 36000",
      "$order" : "year",
      "$$app_token": "CGxaHQoQlgQSev4zyUh5aR5J3"
    }
  }).done(function(asteroids) {
    // Clean out asteroids at (0,0) because those are boring
    asteroids = $.grep(asteroids, function(astr) {
      return astr.geolocation
        && astr.geolocation.latitude != 0
        && astr.geolocation.longitude != 0
    });

    // Start our timer
    var start_time = new Date();

    var idx = 0;
    setInterval(function() {
      var asteroid = asteroids[idx];
      var latlng = new google.maps.LatLng(
        parseFloat(asteroid.geolocation.latitude),
        parseFloat(asteroid.geolocation.longitude)
      ); 

      // Put a scaled circle on the map at the center of this asteroid
      var impact = new google.maps.Circle({
        strokeOpacity: 0.0,
        fillColor: "#FF0000",
        fillOpacity: 0.4,
        map: map,
        radius: Math.max(parseInt(asteroid.mass) / 100, 10000),
        center: latlng
      });
      map.setCenter(latlng);
      map.setZoom(6);

      // Add it to our list
      $("#results").prepend(
        "<li>" + asteroid.year.slice(0, 4) + ": " + asteroid.name 
        + " (" + (parseFloat(asteroid.mass) / 1000) + "kg, " + asteroid.recclass + ")</li>"
      );
      
      idx++;
    }, 2000);
  });
});

