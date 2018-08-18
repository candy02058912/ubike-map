const CITIES = [
  // {
  //   name: 'New Taipei City',
  //   location: {lat: 24.9875278, lng: 121.3645979},
  //   api: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NewTaipei?$format=JSON'
  // },
  {
    name: 'Taipei City',
    location: {lat: 24.9875278, lng: 121.3645979},
    api: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Station/Taipei?$format=JSON',
    availabilityApi: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/Taipei?$format=JSON',
  },
  {
    name: 'Taoyuan City',
    id: 'Taoyuan',
    location: {lat: 24.9875278, lng: 121.3645979},
    api: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Station/Taoyuan?$format=JSON',
    availabilityApi: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/Taoyuan?$format=JSON'
  },
];