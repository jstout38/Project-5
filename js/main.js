//TODO : refactor marker code to use object

var map;
var infowindow;

//Model
var myLocations = {
	locationInfo : [
		{
			"name" : "Ginger 108",
			"location" : { lat : 35.262314, lng : -77.581747 },
			"address" : "108 W North St.",
			"zip" : 28501
		},
		{
			"name" : "Chef and the Farmer",
			"location" : { lat : 35.261328, lng : -77.58216299999998 },
			"address" : '120 W Gordon St.',
			'zip' : 28501
		},
		{
			"name" : "Mother Earth Brewery",
			"location" : { lat : 35.262897, lng : -77.582513 },
			'address' : '311 N Herritage St',
			'zip' : 28501
		},
		{
			"name" : "Boiler Room Oyster Bar",
			"location" : { lat : 35.262314, lng : -77.581747 },
			"address" : "108 W. North St.",
			"zip" : 28501
		},
		{
			"name" : "Aggie's Steak Subs",
			"location" : { lat: 35.270180, lng : -77.592441 },
			"address" : '901 W. Vernon Ave.',
			'zip' : 28501
		},
		{
			"name" : "The Peach House",
			"location" : { lat : 35.269265, lng : -77.587222 },
			'address' : '412 W. Vernon Ave.',
			'zip' : 28501
		},
		{
			"name" : "Christopher's",
			"location" : { lat : 35.262570, lng : -77.580782 },
			"address" : "217 N. Queen St.",
			"zip" : 28501
		},
		{
			"name" : "King's BBQ",
			"location" : { lat : 35.243379, lng : -77.579103 },
			"address" : '405 E. New Bern Rd.',
			'zip' : 28504
		},
		{
			"name" : "Lovick's Cafe",
			"location" : { lat : 35.263059, lng : -77.583075 },
			'address' : '320 N. Heritage St.',
			'zip' : 28501
		},
		{
			"name" : "El Azteca",
			"location" : { lat: 35.267563, lng : -77.625999 },
			"address" : "2928 W. Vernon Ave.",
			"zip" : 28504
		},
		{
			"name" : "The Olympian",
			"location" : { lat : 35.269720, lng : -77.588980 },
			"address" : '601 W. Vernon Ave.',
			'zip' : 28501
		},
		{
			"name" : "The Baron and the Beef",
			"location" : { lat : 35.230617, lng : -77.547364 },
			'address' : '1631 US-70',
			'zip' : 28501
		},
		{
			"name" : "Queen Street Deli & Bakery",
			"location" : { lat : 35.259798, lng : -77.581544 },
			"address" : "117 S. Queen Street",
			"zip" : 28501
		},
		{
			"name" : "Wok and Roll",
			"location" : { lat : 35.287941, lng : -77.590751 },
			"address" : '2424 N. Heritage St.',
			'zip' : 28501
		},
		{
			"name" : "Hawk's Nest",
			"location" : { lat : 35.260159, lng : -77.580978 },
			'address' : '100 S. Queen St.',
			'zip' : 28501
		},
		{
			"name" : "Barney's Pizzeria & Grill",
			"location" : { lat : 35.265175, lng : -77.637867 },
			"address" : "3647 W. Vernon Ave.",
			"zip" : 28504
		},
		{
			"name" : "Pizza Villa",
			"location" : { lat : 35.270506, lng : -77.600706 },
			"address" : '1400 W. Vernon Ave.',
			'zip' : 28501
		},
		{
			"name" : "El Nuevo San Juan",
			"location" : { lat : 35.270506, lng : -77.600706 },
			'address' : '2423 N. Herritage St.',
			'zip' : 28501
		},
		{
			"name" : "Tokyo House",
			"location" : { lat : 35.270751, lng : -77.596925 },
			"address" : "1201 W. vernon Ave.",
			"zip" : 28501
		},
		{
			"name" : "Lily's Pizza",
			"location" : { lat : 35.285904, lng : -77.586926 },
			"address" : '2423 N. Herritage St.',
			'zip' : 28501
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

myViewModel.getYelpInfo = function(title, address, zip) {

	var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey: "Q-BojsHf0qFdPXXyiQjukQ",
  consumerSecret: "01q1URieQ-auiOxVFsA3McnHJXQ",
  accessToken: "oSDJHuQfGOpb6n7pySn-4ToZp8eDBP1h",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "97XkS0O01emCELeTXZC1OyB49b0",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
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
console.log(parameterMap);
$.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(data);
    console.log(data.businesses[0].rating);
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
    				  '"' + snippetText + '"</span><br><a href="' + reviewsURL + '">Click here for ' + reviewCount + ' reviews</a></p><p>Powered by Yelp.</p>';
    $('#info').empty();
    $("#info").append(textBoxHTML);
  }
});
}

//View
function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.258004, lng: -77.581635},
    //scrollwheel: false,
    zoom: 14
  });

  initMarkers(map);

}

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
    		title: myLocations.locationInfo[i].name,
    		address: myLocations.locationInfo[i].address,
    		zip: myLocations.locationInfo[i].zip
 		});
 		myViewModel.currentMarker = marker;
 		marker.addListener('click', toggleBounce);
 		myViewModel.myObservableLocations.push(marker);
 		myViewModel.myFilteredLocations.push(marker);
	}
	setMarkers(myViewModel.myObservableLocations(), map);
}

function toggleBounce() {
	var marker = myViewModel.currentMarker;
	if (marker != this) {
		myViewModel.currentMarker.setAnimation(null);
		myViewModel.currentMarker = this;
		myViewModel.currentMarker.setAnimation(google.maps.Animation.BOUNCE);
		setInfoWindow();
	}
}

function setInfoWindow() {
	if (infowindow) {
		infowindow.close();
	}
	infowindow = new google.maps.InfoWindow({
		content: '<div id="info"><img src="images/loading.png"></div>'
	});
	map.panTo(myViewModel.currentMarker.getPosition())
	infowindow.open(map,myViewModel.currentMarker);
	myViewModel.getYelpInfo(myViewModel.currentMarker.title, myViewModel.currentMarker.address, myViewModel.currentMarker.zip);
}

function clearMarkers() {
  ko.utils.arrayForEach(myViewModel.myObservableLocations(), function(marker) {
  	marker.setMap(null);
  })

}

ko.applyBindings(myViewModel);

