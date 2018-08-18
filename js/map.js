function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    // Initial center at New Taipei City
    center: {lat: 24.9875278, lng: 121.3645979},
    zoom: 11
  });
}