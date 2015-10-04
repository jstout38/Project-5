//TODO : refactor marker code to use object

var map

//Model
var myLocations = {
	locationInfo : [
		{
			"name" : "Kinston-Lenoir County Public Library",
			"location" : { lat: 35.266334, lng : -77.581517 }
		},
		{
			"name" : "Chef and the Farmer",
			"location" : { lat : 35.261328, lng : -77.58216299999998 }
		},
		{
			"name" : "Mother Earth Brewery",
			"location" : { lat : 35.262897, lng : -77.582513 }
		},
		{
			"name" : "Grangier Stadium",
			"location" : { lat : 35.270551, lng : -77.574589 }
		},
		{
			"name" : "Neuseway Park",
			"location" : { lat : 35.260348, lng : -77.585265 }
		}
	]
}

//ViewModel
var myViewModel = {
	myObservableLocations : ko.observableArray(),
	filter : ko.observable(""),
	myFilteredLocations : ko.observableArray(),
	currentMarker : []
}

myViewModel.filteredItems = ko.computed(function() {
	var filter = this.filter().toLowerCase();
	if (!filter) {
		return this.myObservableLocations();
	} else {
		return ko.utils.arrayFilter(this.myObservableLocations(), function(item) {
			return item.title.toLowerCase().indexOf(filter) !== -1;
		});
	}
}, myViewModel);

myViewModel.updateList = function() {
	var filteredList = myViewModel.filteredItems();
	myViewModel.myFilteredLocations.removeAll();
	for (var i = 0; i < filteredList.length; i++) {
		myViewModel.myFilteredLocations.push(filteredList[i]);
	}
	clearMarkers();
	setMarkers(myViewModel.myFilteredLocations(), map);
}

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.262664, lng: -77.581635},
    //scrollwheel: false,
    zoom: 14
  });

  initMarkers(map);

}

//View

function setMarkers(locations, map) {
	for (var i = 0; i < locations.length; i++) {
		locations[i].setMap(map);
	}
}

function initMarkers(map) {
	for (var i = 0; i < myLocations.locationInfo.length; i++) {
		var marker = new google.maps.Marker({
    		position: myLocations.locationInfo[i].location,
   			map: map,
   			animation: google.maps.Animation.DROP,
    		title: myLocations.locationInfo[i].name
 		});
 		myViewModel.currentMarker = marker;
 		marker.addListener('click', toggleBounce);
 		myViewModel.myObservableLocations.push(marker);
 		myViewModel.myFilteredLocations.push(marker);
	}
	setMarkers(myViewModel.myObservableLocations(), map);
}

function toggleBounce() {
	myViewModel.currentMarker.setAnimation(null);
	myViewModel.currentMarker = this;
	this.setAnimation(google.maps.Animation.BOUNCE);
}

function clearMarkers() {
  ko.utils.arrayForEach(myViewModel.myObservableLocations(), function(marker) {
  	marker.setMap(null);
  })

}

ko.applyBindings(myViewModel);

