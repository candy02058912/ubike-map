let map;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    // Initial center at New Taipei City
    center: {lat: 24.9875278, lng: 121.3645979},
    zoom: 11
  });


}

const City = function(data) {
  const self = this;
  this.name = data.name;
  this.api = data.api;
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
        console.log('hi');
      });
      self.markers.push(marker);
    })
  });
};

const ViewModel = function() {
  const self = this;

  this.query = ko.observable('');

  this.cities = ko.observableArray();
  CITIES.forEach(city => {
    self.cities.push(new City(city));
  });

  this.currentCity = ko.observable(this.cities()[0]);

  this.setCity = function(clickedCity) {
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
    });
    return results;
  }, this);

  this.clickStation = function(e) {
    console.log(e);
  }
  
};

ko.applyBindings(new ViewModel());
