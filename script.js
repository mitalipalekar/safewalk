// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var places = [
    {lat: 47.656489, lng: -122.312777},
    {lat: 47.655571, lng: -122.316135},
    {lat: 47.658151, lng: -122.313474},
    {lat: 47.660384, lng: -122.312777},
    {lat: 47.664161, lng: -122.313853},
    {lat: 47.662708, lng: -122.317738},
    {lat: 47.660072, lng: -122.317680}
];

function initMap() {
    var uluru = {lat: 47.608, lng: -122.335};
    var test = {lat: 47.656084, lng: -122.309322};
    var centerSpot = {lat: 47.6607, lng: -122.3147};
    // 47°39'21.9"N 122°18'33.6"W
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: centerSpot
    });
    var marker = new google.maps.Marker({
      position: test,
      map: map
    });
    var marker2 = new google.maps.Marker({
      position: {lat: 47.111, lng: -122.111},
      map: map
    });

    for (coordinates of places) {
        var aMarker = new google.maps.Marker({
            position: coordinates,
            map: map
        });
    }
    

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
        console.log(event.latLng)
    });
}



// function initMap() {
//     var directionsService = new google.maps.DirectionsService;
//     var directionsDisplay = new google.maps.DirectionsRenderer;
//     var map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 7,
//       center: {lat: 41.85, lng: -87.65}
//     });
//     directionsDisplay.setMap(map);

//     var onChangeHandler = function() {
//       calculateAndDisplayRoute(directionsService, directionsDisplay);
//     };
//     document.getElementById('start').addEventListener('change', onChangeHandler);
//     document.getElementById('end').addEventListener('change', onChangeHandler);
//     document.getElementById('mode').addEventListener('change', onChangeHandler);
// }

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      travelMode: document.getElementById('mode').value
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      map: map
    });
}

var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var mapOptions = {
    zoom: 8,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}