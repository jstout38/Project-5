//TODO : refactor marker code to use object

var map

var myLocations = {
	locationInfo : [
		{
			"name" : "Library",
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

var myViewModel = {
	myObservableLocations : ko.observableArray(),
	filter : ko.observable("")
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

function setMarkers(locations, map) {
	console.log(locations);
	for (var i = 0; i < locations.length; i++) {
		locations[i].setMap(map);
	}
}

function initMarkers(map) {
	for (var i = 0; i < myLocations.locationInfo.length; i++) {
		var marker = new google.maps.Marker({
    		position: myLocations.locationInfo[i].location,
   			map: map,
    		title: myLocations.locationInfo[i].name
 		});
 		myViewModel.myObservableLocations.push(marker);
	}
	setMarkers(myViewModel.myObservableLocations(), map);
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
	clearMarkers();
	setMarkers(filteredList, map);
}

function clearMarkers() {
  ko.utils.arrayForEach(myViewModel.myObservableLocations(), function(marker) {
  	marker.setMap(null);
  })

}

ko.applyBindings(myViewModel);

