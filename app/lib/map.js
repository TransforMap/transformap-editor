const L = require('leaflet')
const L_Hash = require('leaflet-hash')
const L_Draw = require('leaflet-draw')
const getUrlVars = require('./getUrlVars.js')

var editableLayers,
    drawControl,
    placeMarker;

function getDrawControl(allow_new_marker) {
  var marker_value = allow_new_marker ? { icon: new placeMarker() } : false
  var options = {
    position: 'bottomleft',
    draw: {
      polyline: false,
      polygon: false,
      rectangle: false,
      circle: false,
      marker: marker_value
    },
    edit: {
      featureGroup: editableLayers, //REQUIRED!!
      remove: false
    }
  }
  return new L.Control.Draw(options);
}

function initMap () {
  console.log("initMap start")
  var map;

  var attr_osm = 'Map data by <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, under <a href="https://www.openstreetmap.org/copyright">ODbL</a>. ',
      attr_pois = 'POIs by <a href="http://solidariteconomy.eu">SUSY</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC-0</a>. ';
  var leaflet_bg_maps,
      center,
      zoom,
      defaultlayer,
      base_maps = {};

  base_maps['mapnik'] = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: attr_osm + attr_pois,
      maxZoom : 19,
      noWrap: true
  });
  base_maps['stamen_terrain'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, '+
        'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. '+
        attr_osm  + attr_pois,
      maxZoom : 18,
      noWrap: true
  });
  base_maps['stamen_terrain_bg'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, '+
        'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. '+
        attr_osm + attr_pois,
      maxZoom : 18,
      noWrap: true
  });
  base_maps['hot'] = new L.tileLayer('http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: 'Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>. '+
        attr_osm + attr_pois,
      maxZoom : 20,
      noWrap: true
  });

  if(!leaflet_bg_maps)
    leaflet_bg_maps = {
      'Stamen - Terrain': base_maps['stamen_terrain'],
      'Stamen - Terrain Background': base_maps['stamen_terrain_bg'],
      'OpenStreetMap - Mapnik': base_maps['mapnik'],
      'Humanitarian OpenStreetMap ': base_maps['hot']
    };
  if(!defaultlayer)
    defaultlayer = base_maps['mapnik'];

  map = L.map('map', {
    zoomControl: true,
    center: center ? center : new L.LatLng(51.1657, 10.4515),
    zoom: zoom ? zoom : 15,
    layers: defaultlayer
  })

  const ctrl = new L.Control.Layers(leaflet_bg_maps)
  map.addControl(ctrl)
  var hash = new L.Hash(map); // Leaflet persistent Url Hash function

  //leaflet draw
  editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);
  placeMarker = L.Icon.extend({
      options: {
          shadowUrl: null,
          iconAnchor: new L.Point(12, 40),
          iconSize: new L.Point(25, 40),
          iconUrl: 'marker-green.png'
      }
  });

  map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
          layer = e.layer;
  
      if (type === 'marker') {
          layer.bindPopup('A popup!');
      }
  
      editableLayers.addLayer(layer);
      map.my_current_marker = layer
      document.getElementById("_geometry_lon").value = layer._latlng.lng.toFixed(6)
      document.getElementById("_geometry_lat").value = layer._latlng.lat.toFixed(6)

      map.removeControl(map.my_drawControl) 
      map.my_drawControl = getDrawControl(false) //deactivate "add marker" after the 1st one
      map.addControl(map.my_drawControl)
      //fixme instantly enable 'edit' mode of layer
  });


  map.on('draw:editmove', function(e) {
    console.log("editmove");
    console.log(e);
    document.getElementById("_geometry_lon").value = e.layer._latlng.lng.toFixed(6)
    document.getElementById("_geometry_lat").value = e.layer._latlng.lat.toFixed(6)

  })

  map.my_editableLayers = editableLayers
  map.my_drawControl = drawControl
  map.my_placeMarker = placeMarker
  map.getDrawControl = getDrawControl

  map.updateMarkerFromForm = function () {
    const lat = document.getElementById("_geometry_lat").value
    const lon = document.getElementById("_geometry_lon").value
    console.log("new lat: " + lat + " lon: " + lon)

    if(lat && lon) {
      const coords = L.latLng(lat,lon)
      map.my_current_marker.setLatLng(coords)
      map.panTo(coords)
    }

  }
  document.getElementById("_geometry_lat").onblur = map.updateMarkerFromForm
  document.getElementById("_geometry_lon").onblur = map.updateMarkerFromForm

  //console.log(map)

  console.log("initMap end")
  return map
}

module.exports = initMap
