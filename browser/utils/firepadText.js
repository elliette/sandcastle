const html = `<center>
  <h1>My Tiny App</h1>
</center>
<div id="map"></div>

<link href="https://fonts.googleapis.com/css?family=Space+Mono" rel="stylesheet">`;

const css = `h1 {
  color: #add8e6;
  font-family: 'Space Mono', monospace;
}

#map {
  height: 400px;
  width: 100%;
  background-color: #add8e6;
}`;

const js = `var _ = require('lodash');
var axios = require('axios');

console.log('====chunk', _.chunk(['a', 'b', 'c', 'd'], 2));


$(document).ready(function() {
  console.log("document ready!");
    if (document.querySelectorAll('#map').length > 0) {
    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAYFe4X2zwVZvzFXc57XWOJ_QP4Mff_J9s&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
});

let map;
initMap = () => {

  var gracehopper = {lat: 40.705344, lng: -74.009171};
  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 1,
          center: gracehopper
    });

    // add markers that are posted to server
    axios.get('/markers')
    .then((res) => {
      console.log('markerData', res.data);
      return res.data;
    })
    .then((markerData) => {
      if (markerData.length > 0) {
        plotMarkers(markerData);
      }
    })
    .catch(console.error);
}

let markers;
let bounds;

function plotMarkers(m) {
  markers = [];
  bounds = new google.maps.LatLngBounds();

  m.forEach(function (markerDataPt) {
    const position = new google.maps.LatLng(markerDataPt.lat, markerDataPt.lng);

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP
    })

    const infowindow = new google.maps.InfoWindow({
          content: markerDataPt.name
    });

    marker.addListener('click', function() {
          infowindow.open(map, marker);
    });

    markers.push(marker);
  });
}`;

const server = `// get all map markers
router.get('/markers', (req, res) => {
  models.MapMarker.findAll()
  .then((mapMarkers) => {
      res.send(mapMarkers)
  })
  .catch(console.error);
});

// add a map marker
router.post('/addMarker', (req, res) => {
  models.MapMarker.create({
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng
  })
  .then((mapMarker) => {
    res.send(mapMarker);
  })
  .catch(console.error);
});

// get map marker by name
router.get('/markers/:name', (req, res) => {
  models.MapMarker.findOne({
    where: {
      name: req.params.name
    }
  })
  .then((mapMarker) => {
    res.send(mapMarker);
  })
  .catch(console.error);
});

// update map marker's name
router.put('/markers/:name', (req, res) => {
  models.MapMarker.findOne({
    where: {
      name: req.params.name
    }
  })
  .then((mapMarker) => {
    return mapMarker.update({
      name: req.body.name
    })
  })
  .then((updatedMapMarker) => {
    res.send(updatedMapMarker)
  })
  .catch(console.error)
})

// delete a marker by name
router.delete('/markers/:name', (req, res) => {
  let id;
  models.MapMarker.findOne({
    where: {
      name: req.params.name
    }
  })
  .then((mapMarker) => {
    id = mapMarker.id;
    mapMarker.destroy();
  })
  .then(() => {
    // response for delete route must be the deleted instance's id
    res.json(id);
  })
  .catch(console.error)
})`;

const db = `const MapMarker = db.define('MapMarker', {
  name: Sequelize.STRING,
  lat: Sequelize.DECIMAL,
  lng: Sequelize.DECIMAL
})

module.exports = {
  db: db,
  // include your models below
  MapMarker: MapMarker
}`;
