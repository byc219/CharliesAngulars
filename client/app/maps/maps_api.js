angular.module('parksAndEx.googleApi', [])

.controller('googleApiController', function ($scope) {
	
	$scope.locations = [];
	
	
	
	handleAddress("San Francisco");
	
	function callbackFn(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
		console.log(results);
		$scope.locations = results;
		$scope.$apply();
		  for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		  }
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
		  map: map,
		  position: place.geometry.location
		});

		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.setContent(place.name);
		  infowindow.open(map, this);
		});
	}
	  
	function handleAddress(input) {
		var formattedInput = input.split(' ').join('%20');
		httpGetAsync('https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedInput + '&key=AIzaSyAvP71A4zQ3bBjri75-1y6AaLP3s-JfNO0', handleLocation);
		
	}
	
	function handleLocation(input) {
		
		var inputJSON = JSON.parse(input);
		 
	  
		
		var location = {lat: inputJSON.results[0].geometry.location.lat, lng: inputJSON.results[0].geometry.location.lng};

		map = new google.maps.Map(document.getElementById('map'), {
		  center: location,
		  zoom: 12
		});

		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
		  location: location,
		  radius: 2500,
		  type: ['park']
		}, callbackFn);
	  
	}

	function httpGetAsync(theUrl, callback)
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		}
		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		xmlHttp.send();
	}
});

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map;
var infowindow;
//var results_global;

