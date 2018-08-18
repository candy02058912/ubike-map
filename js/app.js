const City = function(data) {
  const self = this;
  this.name = data.name;
  this.api = data.api;
  this.location = data.location;
  this.stations = ko.observableArray();
  $.getJSON(this.api).done(res => {
    self.stations(res);
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
  };

  this.filteredStations = ko.computed(function() {
    const stations = self.currentCity().stations();
    const results = stations.filter(station => station.StationName.En.toLowerCase().includes(self.query().toLowerCase()));
    return results;
  }, this);

  this.clickStation = function(e) {
    console.log(e);
  }
  
};

ko.applyBindings(new ViewModel());
