// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var places = [
    {lat: 47.656084, lng: -122.309322},
    {lat: 47.656489, lng: -122.312777},
    {lat: 47.655571, lng: -122.316135},
    {lat: 47.658151, lng: -122.313474},
    {lat: 47.660384, lng: -122.312777},
    {lat: 47.664161, lng: -122.313853},
    {lat: 47.662708, lng: -122.317738},
    {lat: 47.660072, lng: -122.317680}
];

var lettersToLocations = {
  A: 'Red Square',
  B: 'Schmitz Hall',
  C: 'Maple Hall',
  D: 'Starbucks on 42nd',
  E: 'University Book Store',
  F: 'Safeway',
  G: 'Trader Joe\'s',
  H: 'Disability Center'
};

// var travelRequests = [{name: 'Austin', time: '6pm', path: 'AF', number: '+14254451649'}, {name: 'Christine', time: '6pm', path: 'AF', number: '+14252935462'}, {name: 'Kush', time: '6pm', path: 'AG', number: '+12067392712'}, {name: 'Christine2', time: '7pm', path: 'AG', number: '+14252935462'}]
// combineWalkingRequests()

// createAndSendText('Austin', '+14254451649', [{src: 'A', dest: 'E', time: '9:00 pm', travelers: ['Barry']}])
// createAndSendText('Kush', '+12067392712', [{src: 'A', dest: 'E', time: '9:00 pm', travelers: ['Barry']}])
// createAndSendText('Christine', '+14252935462', [{src: 'A', dest: 'E', time: '9:00 pm', travelers: ['Barry']}])

function initMap() {
    var uluru = {lat: 47.608, lng: -122.335};
    var test = {lat: 47.656084, lng: -122.309322};

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var centerSpot = {lat: 47.6607, lng: -122.3147};
    // 47°39'21.9"N 122°18'33.6"W
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: centerSpot
    });

    var startSelect = document.getElementById('startLocation');
    var endSelect = document.getElementById('endLocation');
    for (coordinates of places) {
        var aMarker = new google.maps.Marker({
            position: coordinates,
            map: map,
            label: labels[labelIndex++ % labels.length]
        });
    }
}

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

function combineWalkingRequests() {
  var pathsToPeeps = {};
  for (var i = 0; i < travelRequests.length; i++) {
    if (!pathsToPeeps[travelRequests[i]['path']]) {
      pathsToPeeps[travelRequests[i]['path']] = {};
    }
    if (!pathsToPeeps[travelRequests[i]['path']][travelRequests[i]['time']]) {
      pathsToPeeps[travelRequests[i]['path']][travelRequests[i]['time']] = [];
    }
    pathsToPeeps[travelRequests[i]['path']][travelRequests[i]['time']].push({name: travelRequests[i]['name'], number: travelRequests[i]['number']});
    
  }

  sendMessages(pathsToPeeps);
}

function sendMessages(pathsToPeeps) {
  for (var path in pathsToPeeps) {
    var pathTravelers = pathsToPeeps[path];
    for (var time in pathTravelers) {
      var timeTravelers = pathTravelers[time];
      var names = [];
      for (var i = 0; i < timeTravelers.length; i++) {
        names.push(timeTravelers[i]['name']);
      }
      for (var i = 0; i < timeTravelers.length; i++) {
        names.splice(i, 1);
        var request = {
          src: path[0],
          dest: path[1],
          time: time,
          travelers: names
        }
        createAndSendText(timeTravelers[i]['name'], timeTravelers[i]['number'], [request])
        names.splice(i, 0, timeTravelers[i]['name']);
      }
    }
  }
}

function createAndSendText(name, number, journey) {
  // journey should be a list of dictionaries of the form:
  // {src: LETTER_OF_SRC, dest: LETTER_OF_DEST, time: DEPARTURE_TIME, travelers: LIST_OF_TRAVELERS}}
  // Ex: {src: 'B', dest: 'F', time: '7:00 pm', travelers: ['Larry', 'Bob', 'Laura']}

  var message = 'Hello ' + name + '!\n';
  message += 'Here are the details of your trip from ' + lettersToLocations[journey[0]['src']] + ' to ' + lettersToLocations[journey[journey.length - 1]['dest']] + ', starting at ' + journey[0]['time'] + ':\n';
  for (var i = 0; i < journey.length; i++) {
    var line = 'Leave from ' + lettersToLocations[journey[i]['src']] + ' to ' + lettersToLocations[journey[i]['dest']] + ' at ' + journey[i]['time'];
    var travelers = '';
    if (journey[i]['travelers'].length == 0) {
      travelers = ', unaccompanied';
    } else {
      travelers += ' with ' + journey[i]['travelers'][0];
      for (var j = 1; j < journey[i]['travelers'].length; j++) {
        travelers += ', ' + journey[i]['travelers'][j];
      }
    }
    travelers += '\n';
    line += travelers;
    message += line;
  }
  message += "Text YES to confirm, or NO to cancel."
  sendSmsMessage(number, message);
}

function sendSmsMessage(number, body) {
  // number must be in a format similar to '+12345678901'

  var accountSid = 'ACad44b176fb3ed197fd091c85a51cff0a'; // Your Account SID from www.twilio.com/console
  var authToken = '2ba150009b6d22ba9b2e69d9d0003b49';   // Your Auth Token from www.twilio.com/console

  var twilio = require('twilio');
  var client = new twilio(accountSid, authToken);

  client.messages.create({
      body: body,
      to: number,  // Text this number
      from: '+12068006289' // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}