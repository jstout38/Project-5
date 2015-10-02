function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.262664, lng: -77.581635},
    //scrollwheel: false,
    zoom: 14
  });
}
