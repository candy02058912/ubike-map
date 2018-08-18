let map, largeInfoWindow;

/**
 * Shows the info window when marker is clicked
 *
 * @param {*} marker - the marker clicked
 * @param {*} infoWindow - window that popups on top of the marker
 * @param {*} api - check if bikes are available api
 * @param {*} stationUid - uid of the bike station used to filter api
 */
function populateInfoWindow(marker, infoWindow, api, stationUid) {
  if (infoWindow.marker != marker) {
    $.getJSON(`${api}&$filter eq '${stationUid}'`).done(([status]) => {
      infoWindow.marker = marker;
        infoWindow.setContent(`<div>
        <h4>${marker.title}</h4>
        <p>Service <span class=${status.ServieAvailable === 1 ? 'text-success>Available' : 'text-danger>Unavailable'}</span></p>
        <p>Bikes for rent: ${status.AvailableRentBikes}</p>
        <p>Space for return: ${status.AvailableReturnBikes}</p> 
        </div>`);
        infoWindow.open(map, marker);
    }).failed(err => alert('Could not retrieve information.'));
    }
};

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    // Initial center at New Taipei City
    center: {lat: 24.9875278, lng: 121.3645979},
    zoom: 11
  });
  largeInfoWindow = new google.maps.InfoWindow();

}

const City = function(data) {
  const self = this;
  this.name = data.name;
  this.api = data.api;
  this.availabilityApi = data.availabilityApi;
  this.location = data.location;
  this.stations = ko.observableArray();
  this.markers = ko.observableArray();
  $.getJSON(this.api).done(res => {
    self.stations(res);
    self.stations().forEach(station => {
      const marker = new google.maps.Marker({
        position: {lat: station.StationPosition.PositionLat, lng: station.StationPosition.PositionLon},
        map: map,
        title: station.StationName.En,
      });
      marker.setVisible(false);
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow, self.availabilityApi, station.StationUID);
      });
      self.markers.push(marker);
    })
  }).fail(err => alert('Could not retrive information'));
};

const ViewModel = function() {
  const self = this;
  // Search query
  this.query = ko.observable('');
  // Generate cities
  this.cities = ko.observableArray();
  CITIES.forEach(city => {
    self.cities.push(new City(city));
  });
  // Current city user is viewing
  this.currentCity = ko.observable(this.cities()[0]);
  // Set city to user's selection
  this.setCity = function(clickedCity) {
    // Remove old city markers
    const prevMarkers = self.currentCity().markers();
    prevMarkers.forEach(marker => marker.setVisible(false));
    // Close info window
    largeInfoWindow.close();
    // Set current city to the clicked city
    self.currentCity(clickedCity);
    self.query('');
  };

  this.filteredStations = ko.computed(function() {
    const stations = self.currentCity().stations();
    const markers = self.currentCity().markers();
    const results = stations.filter((station, idx) => {
      const isMatched = station.StationName.En.toLowerCase().includes(self.query().toLowerCase());
      if (markers[idx]) { markers[idx].setVisible(isMatched); }
      if(isMatched) { return true; }
      largeInfoWindow.close();
    });
    return results;
  }, this);
  // Show info window when click on station name in sidebar
  this.clickStation = function(clickedStation) {
    const stations = self.currentCity().stations();
    const markers = self.currentCity().markers();
    stations.forEach((station, idx) => {
      const isMatched = station.StationName.En.toLowerCase().includes(clickedStation.StationName.En.toLowerCase());
      if (isMatched) {
        google.maps.event.trigger(markers[idx], 'click');
      }
    });
  }
  
};

ko.applyBindings(new ViewModel());
