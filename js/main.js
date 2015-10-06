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
			"city" : "Kinston, NC",
			"zip" : 28501
		},
		{
			"name" : "Chef and the Farmer",
			"location" : { lat : 35.261328, lng : -77.58216299999998 },
			"address" : '120 W Gordon St.',
			'city' : 'Kinston, NC',
			'zip' : 28501
		},
		{
			"name" : "Mother Earth Brewery",
			"location" : { lat : 35.262897, lng : -77.582513 },
			'address' : '311 N Herritage St',
			'city' : 'Kinston, NC',
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

myViewModel.getYelpInfo = function(title, address) {
	/* var consumerKey = "Q-BojsHf0qFdPXXyiQjukQ";
	var consumerKeySecret = "01q1URieQ-auiOxVFsA3McnHJXQ";
	var token = "oSDJHuQfGOpb6n7pySn-4ToZp8eDBP1h";
	var tokenSecret = "97XkS0O01emCELeTXZC1OyB49b0";

	function nonce_generate() {
		return (Math.floor(Math.random() * 1e12).toString());
	}

	var yelp_url = "http://api.yelp.com/v2/search/";

	var parameters = {
		oauth_consumer_key: consumerKey,
		oauth_token: token,
		oauth_nonce: nonce_generate(),
		oauth_timestamp: Math.floor(Date.now() / 1000),
		oauth_signature_method: "HMAC-SHA1",
		oauth_version: "1.0",
		callback: "cb",
		term: title,
		location: address,
		limit: 1
	};

	var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, consumerKey, consumerKeySecret, tokenSecret);
	parameters.oauth_signature = encodedSignature;
	var settings = {
		url: yelp_url,
		data: parameters,
		cache: true,
		dataType: 'jsonp',
		success: function(results) {
			console.log("exito");
		},
		error: function() {
			console.log("error");
		}
	};
	$.ajax(settings); */
	var test;
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
var terms = 'food';
var near = 'San+Francisco';
var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};
parameters = [];
parameters.push(['term', title]);
parameters.push(['location', address]);
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
    var image = businessData.image_url;
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
    var textBoxHTML = '<h4>' + name + '</h4><span><img src="' + image + '"></span><p>' + address1 + '<br>' + address2 + '<br>' + phone + '</p><p>' + openStatus + '</p><p><img src="' + rating + '"></p><p><span id="snippet">' +
    				  '"' + snippetText + '"</span><br><a href="' + reviewsURL + '">Click here for ' + reviewCount + ' reviews</a></p><p>Powered by Yelp.</p>';
    $("#info").append(textBoxHTML);
  }
});
}

//View
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
	myViewModel.currentMarker.setAnimation(null);
	myViewModel.currentMarker = this;
	myViewModel.currentMarker.setAnimation(google.maps.Animation.BOUNCE);
	setInfoWindow();
}

function setInfoWindow() {
	if (infowindow) {
		infowindow.close();
	}
	infowindow = new google.maps.InfoWindow({
		content: '<div id="info"></div>'
	});
	infowindow.open(map,myViewModel.currentMarker);
	myViewModel.getYelpInfo(myViewModel.currentMarker.title, myViewModel.currentMarker.zip);
}

function clearMarkers() {
  ko.utils.arrayForEach(myViewModel.myObservableLocations(), function(marker) {
  	marker.setMap(null);
  })

}

ko.applyBindings(myViewModel);

