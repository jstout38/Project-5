//This javascript provides the engine for the Google Maps display, as well as the ViewModel for binding the list of locations to the HTML and the predetermined data

//These variables need to be global
var map;
var infowindow;
var bounds;

//Static variables for the starting position of the map (Set as a default, the map will zoom to fit markers when they are initialized)
var STARTINGLAT = 35.258004;
var STARTINGLNG = -77.581635;

/////////////
//	MODEL  //
/////////////

//Creates a JSON object with the information provided for the restaurants to be included in the app. The lat/lng will be used to place markers and the address and zip will be used with the Yelp API
//Keywords are also provided for improved searching
var myLocations = {
	locationInfo : [
		{
			'name' : 'Ginger 108',
			'location' : { lat : 35.262314, lng : -77.581747 },
			'address' : '108 W North St.',
			'zip' : 28501,
			'keyword1' : 'chinese',
			'keyword2' : 'fusion',
			'keyword3' : 'gourmet',
			'keyword4' : 'bar'
		},
		{
			'name' : 'Chef and the Farmer',
			'location' : { lat : 35.261328, lng : -77.58216299999998 },
			'address' : '120 W Gordon St.',
			'zip' : 28501,
			'keyword1' : 'american',
			'keyword2' : 'southern',
			'keyword3' : 'gourmet',
			'keyword4' : 'bar'
		},
		{
			'name' : 'Mother Earth Brewery',
			'location' : { lat : 35.262897, lng : -77.582513 },
			'address' : '311 N Herritage St',
			'zip' : 28501,
			'keyword1' : 'beer',
			'keyword2' : 'bar',
			'keyword3' : 'brewery',
			'keyword4' : 'snacks'
		},
		{
			'name' : 'Boiler Room Oyster Bar',
			'location' : { lat : 35.262314, lng : -77.581747 },
			'address' : '108 W. North St.',
			'zip' : 28501,
			'keyword1' : 'american',
			'keyword2' : 'hamburgers',
			'keyword3' : 'bar',
			'keyword4' : 'oysters'
		},
		{
			'name' : "Aggie's Steak Subs",
			'location' : { lat: 35.270180, lng : -77.592441 },
			'address' : '901 W. Vernon Ave.',
			'zip' : 28501,
			'keyword1' : 'subs',
			'keyword2' : 'sanwiches',
			'keyword3' : 'american',
			'keyword4' : 'burgers'
		},
		{
			'name' : 'The Peach House',
			'location' : { lat : 35.269265, lng : -77.587222 },
			'address' : '412 W. Vernon Ave.',
			'zip' : 28501,
			'keyword1' : 'sandwiches',
			'keyword2' : 'soups',
			'keyword3' : 'lunch',
			'keyword4' : 'bakery'
		},
		{
			'name' : "Christopher's",
			'location' : { lat : 35.262570, lng : -77.580782 },
			'address' : '217 N. Queen St.',
			'zip' : 28501,
			'keyword1' : 'american',
			'keyword2' : 'breakfast',
			'keyword3' : 'diner',
			'keyword4' : 'southern'
		},
		{
			'name' : "King's BBQ",
			'location' : { lat : 35.243379, lng : -77.579103 },
			'address' : '405 E. New Bern Rd.',
			'zip' : 28504,
			'keyword1' : 'southern',
			'keyword2' : 'barbecue',
			'keyword3' : 'grill',
			'keyword4' : 'american'
		},
		{
			'name' : "Lovick's Cafe",
			'location' : { lat : 35.263059, lng : -77.583075 },
			'address' : '320 N. Heritage St.',
			'zip' : 28501,
			'keyword1' : 'american',
			'keyword2' : 'diner',
			'keyword3' : 'breakfast',
			'keyword4' : 'burgers'
		},
		{
			'name' : 'El Azteca',
			'location' : { lat: 35.267563, lng : -77.625999 },
			'address' : '2928 W. Vernon Ave.',
			'zip' : 28504,
			'keyword1' : 'mexican',
			'keyword2' : 'margaritas',
			'keyword3' : 'beer',
			'keyword4' : 'to go'
		},
		{
			'name' : 'The Olympian',
			'location' : { lat : 35.269720, lng : -77.588980 },
			'address' : '601 W. Vernon Ave.',
			'zip' : 28501,
			'keyword1' : 'greek',
			'keyword2' : 'diner',
			'keyword3' : 'pizza',
			'keyword4' : 'sandwiches'
		},
		{
			'name' : 'The Baron and the Beef',
			'location' : { lat : 35.230617, lng : -77.547364 },
			'address' : '1631 US-70',
			'zip' : 28501,
			'keyword1' : 'steak',
			'keyword2' : 'american',
			'keyword3' : 'salad bar',
			'keyword4' : 'southern'
		},
		{
			'name' : 'Queen Street Deli & Bakery',
			'location' : { lat : 35.259798, lng : -77.581544 },
			'address' : '117 S. Queen Street',
			'zip' : 28501,
			'keyword1' : 'sandwiches',
			'keyword2' : 'soups',
			'keyword3' : 'bakery',
			'keyword4' : 'healthy'
		},
		{
			'name' : 'Wok and Roll',
			'location' : { lat : 35.287941, lng : -77.590751 },
			'address' : '2424 N. Heritage St.',
			'zip' : 28501,
			'keyword1' : 'chinese',
			'keyword2' : 'fast food',
			'keyword3' : 'to go',
			'keyword4' : 'delivery'
		},
		{
			'name' : "Hawk's Nest",
			'location' : { lat : 35.260159, lng : -77.580978 },
			'address' : '100 S. Queen St.',
			'zip' : 28501,
			'keyword1' : 'diner',
			'keyword2' : 'american',
			'keyword3' : 'diner',
			'keyword4' : 'cafe'
		},
		{
			'name' : "Barney's Pizzeria & Grill",
			'location' : { lat : 35.265175, lng : -77.637867 },
			'address' : '3647 W. Vernon Ave.',
			'zip' : 28504,
			'keyword1' : 'pizza',
			'keyword2' : 'italian',
			'keyword3' : 'sandwiches',
			'keyword4' : 'snacks'
		},
		{
			'name' : 'Pizza Villa',
			'location' : { lat : 35.270506, lng : -77.600706 },
			'address' : '1400 W. Vernon Ave.',
			'zip' : 28501,
			'keyword1' : 'pizza',
			'keyword2' : 'italian',
			'keyword3' : 'sandwiches',
			'keyword4' : 'salad bar'
		},
		{
			'name' : 'El Nuevo San Juan',
			'location' : { lat : 35.285947, lng : -77.586973 },
			'address' : '2423 N. Herritage St.',
			'zip' : 28501,
			'keyword1' : 'mexican',
			'keyword2' : 'margaritas',
			'keyword3' : 'beer',
			'keyword4' : 'bar'
		},
		{
			'name' : 'Tokyo House',
			'location' : { lat : 35.270751, lng : -77.596925 },
			'address' : '1201 W. vernon Ave.',
			'zip' : 28501,
			'keyword1' : 'sushi',
			'keyword2' : 'japanese',
			'keyword3' : 'hibachi',
			'keyword4' : 'beer'
		},
		{
			'name' : "Lily's Pizza",
			'location' : { lat : 35.285904, lng : -77.586926 },
			'address' : '2423 N. Herritage St.',
			'zip' : 28501,
			'keyword1' : 'pizza',
			'keyword2' : 'subs',
			'keyword3' : 'sandwiches',
			'keyword4' : 'snacks'
		}
	]
}

/////////////////
//  VIEWMODEL  //
/////////////////

//These functions help create an observable array of markers for binding to the HTMl and filtering

//Sets variables for MyViewVariable
var myViewModel = {
	myObservableLocations : ko.observableArray(),
	filter : ko.observable(''),
	myFilteredLocations : ko.observableArray(),
	currentMarker : []
}

//Filters List View and Markers based on the filter input
//Filters on name, address, and four keywords
myViewModel.filteredItems = ko.computed(function() {
	var self = this;
	var filter = self.filter().toLowerCase();
	if (!filter) {
		return self.myObservableLocations();
	} else {
		return ko.utils.arrayFilter(self.myObservableLocations(), function(item) {
			return ((item.title.toLowerCase().indexOf(filter)) !== -1 || (item.address.toLowerCase().indexOf(filter) !== -1) || (item.keyword1.toLowerCase().indexOf(filter) !== -1) ||
				    (item.keyword2.toLowerCase().indexOf(filter) !== -1) || (item.keyword3.toLowerCase().indexOf(filter) !== -1) || (item.keyword4.toLowerCase().indexOf(filter) !== -1));
		});
	}
}, myViewModel);

//Updates the List view and Markers based on the filtered output
myViewModel.updateList = function() {
	var self = this;
	var filteredList = self.filteredItems();
	if (filteredList != self.myFilteredLocations()) {
		self.myFilteredLocations.removeAll();
		for (var i = 0; i < filteredList.length; i++) {
			self.myFilteredLocations.push(filteredList[i]);
		}
		clearMarkers();
		setMarkers(self.myFilteredLocations(), map);
	}
}

////////////
//  VIEW  //
////////////

//These functions power the Google Maps interface, place the markers, and use the Yelp API to provide additional information in the view

//Initializes the map
function initMap() {
	// Create a map object and specify the DOM element for display.
	var showControls = true;
	// Don't show controls on smaller windows for increased responsiveness
	if ($( window ).height() < 800) {
		showControls = false;
	}
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: STARTINGLAT, lng: STARTINGLNG},
		mapTypeControl: showControls
	});
	bounds = new google.maps.LatLngBounds();
	initMarkers(map);
}

//Simple function to place markers based on location input
function setMarkers(locations, map) {
	for (var i = 0; i < locations.length; i++) {
		locations[i].setMap(map);
	}
}

//Initializes markers and pushes them to the ViewModel
function initMarkers(map) {
	for (var i = 0; i < myLocations.locationInfo.length; i++) {
		markerInfo = myLocations.locationInfo[i];
		var marker = new google.maps.Marker({
			position: markerInfo.location,
			map: map,
			animation: google.maps.Animation.DROP,
			title: markerInfo.name,
			address: markerInfo.address,
			zip: markerInfo.zip,
			keyword1: markerInfo.keyword1,
			keyword2: markerInfo.keyword2,
			keyword3: markerInfo.keyword3,
			keyword4: markerInfo.keyword4,
			keywords: markerInfo.keyword5
		});
		myViewModel.currentMarker = marker;
		marker.addListener('click', clickActions);
		myViewModel.myObservableLocations.push(marker);
		myViewModel.myFilteredLocations.push(marker);
		//Push markers to bounds array to help with auto-centering
		bounds.extend(marker.getPosition());
	}
	setMarkers(myViewModel.myObservableLocations(), map);
	map.fitBounds(bounds);
}

//Function that is called upon clicking a marker or an item in the list view. Animates the marker and calls the info window function
function clickActions() {
	var self = this;
	var marker = myViewModel.currentMarker;
	if (marker != self) {
		myViewModel.currentMarker.setAnimation(null);
		myViewModel.currentMarker = self;
		myViewModel.currentMarker.setAnimation(google.maps.Animation.BOUNCE);
		setInfoWindow();
	}
}

//Sets a new info window and calls the function to get the Yelp data to fill it
function setInfoWindow() {
	var marker = myViewModel.currentMarker;
	if (infowindow) {
		infowindow.close();
	}
	infowindow = new google.maps.InfoWindow({
		content: '<div id="info"><img src="images/loading.png"></div>',
	});
	map.panTo(marker.getPosition())
	infowindow.open(map,marker);
	getYelpInfo(marker.title, marker.address, marker.zip);
}

//Utility function to clear markers
function clearMarkers() {
	ko.utils.arrayForEach(myViewModel.myObservableLocations(), function(marker) {
		marker.setMap(null);
	})
}

//Calls the Yelp API to get the info used to fill the info window
getYelpInfo = function(title, address, zip) {
	//The first part of this function goes through the necessary steps to fulfill Oauth authentication requirements
	var auth = {
		consumerKey: 'Q-BojsHf0qFdPXXyiQjukQ',
		consumerSecret: '01q1URieQ-auiOxVFsA3McnHJXQ',
		accessToken: 'oSDJHuQfGOpb6n7pySn-4ToZp8eDBP1h',
		accessTokenSecret: '97XkS0O01emCELeTXZC1OyB49b0',
		serviceProvider: {
			signatureMethod: 'HMAC-SHA1'
		}
	};
	var accessor = {
		consumerSecret: auth.consumerSecret,
		tokenSecret: auth.accessTokenSecret
	};
	parameters = [];
	parameters.push(['term', title]);
	parameters.push(['location', address + ' ' + zip]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	var message = {
		'action': 'http://api.yelp.com/v2/search',
		'method': 'GET',
		'parameters': parameters
	};
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	//Makes the AJAX call now that Oauth is set up correctly
	$.ajax({
		'url': message.action,
		'data': parameterMap,
		'cache': true,
		'dataType': 'jsonp',
		'jsonpCallback': 'cb',
		//Pulls the data from the JSONP object if the call succeeds and formats it for the info window
		'success': function(data, textStats, XMLHttpRequest) {
			var businessData = data.businesses[0];
			var name = businessData.name;
			var phone = businessData.display_phone;
			var address1 = businessData.location.display_address[0];
			var address2 = businessData.location.display_address[1];
			var image;
			if (businessData.image_url) {
				image = '<img src="' + businessData.image_url + '">'
			}
			else {
				image = ''
			}
			var openStatus;
			if (!businessData.is_closed) {
				openStatus = '<span id="open">Open</span>';
			}
			else {
				openStatus = '<span id="closed">Closed</span>';
			}
			var rating = businessData.rating_img_url_small;
			var reviewCount = businessData.review_count;
			var snippetText = businessData.snippet_text;
			var reviewsURL = businessData.url;
			var textBoxHTML = '<h4>' + name + '</h4><span>' + image + '</span><p>' + address1 + '<br>' + address2 + '<br>' + phone + '</p><p>' + openStatus + '</p><p><img src="' + rating + '"></p><p><span id="snippet">' +
							  '"' + snippetText + '"</span><br><a href="' + reviewsURL + '">Click here for ' + reviewCount + ' reviews</a></p><p>Powered by Yelp</p>';
			$('#info').empty();
			$("#info").append(textBoxHTML);
		},
		//Error Handling
		'error': function() {
			alert('There was a problem talking to Yelp. Please try again later!')
		}
	});
}

//Bind the ViewModel
ko.applyBindings(myViewModel);