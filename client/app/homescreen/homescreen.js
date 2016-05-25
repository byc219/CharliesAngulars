angular.module('parksAndEx.homescreen', [])

.controller('homescreenController', function($scope, homescreenFactory, $location) {
  //$scope.test = mainFactory.getText();
  $scope.searchStatus = false;

  $scope.submitSearch = function(input){
    console.log(input)
  	var filtered = homescreenFactory.filter("  death valley");
  	if(filtered){
	  	$scope.searchStatus = true;
	  	$scope.text = filtered;
	  }
	 else{
	 	$scope.test = "BAD DATA"
	 }
  	//call michaels API

  }
  
}).factory('homescreenFactory', function(){

	var filterText = function(text){
		var filteredText = text.trim();
		if(text.length)
			return text;
		else{
			return false;
		}
	}
	return {filter:filterText};

})
.factory('googleApiFactory', function() {
	var obj = {};
	
	obj.callback = callback;
	obj.createMarker = createMarker;
	obj.handleAddress = handleAddress;
	obj.handleLocation = handleLocation;
	obj.httpGetAsync = httpGetAsync;
	
	return obj

})

.controller('googleApiController', function ($scope, googleApiFactory) {
	$scope.googleApi = googleApiFactory;
	$scope.locations = [];
	
	
	$scope.googleApi.handleAddress("San Francisco");
	setTimeout(function() {
	$scope.locations = results_global;
	console.log("$scope.locations: ", $scope.locations);
	$scope.$apply();
	}, 1000);
});

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map;
var infowindow;
var results_global;

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
		console.log(results);
		results_global = results;
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

//handleAddress('San Francisco');

function handleLocation(input) {

    var inputJSON = JSON.parse(input);



    var pyrmont = {
        lat: inputJSON.results[0].geometry.location.lat,
        lng: inputJSON.results[0].geometry.location.lng
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 2500,
        type: ['park']
    }, callback);

}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send();
}



function print(text) {
    console.log(JSON.parse(text));
}
