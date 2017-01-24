const L = require('leaflet')
const L_Hash = require('leaflet-hash')
const L_Draw = require('leaflet-draw')

var editableLayers
var drawControl
var placeMarker

function getDrawControl (allowNewMarker) {
  var markerValue = allowNewMarker ? { icon: new placeMarker() } : false
  var options = {
    position: 'bottomleft',
    draw: {
      polyline: false,
      polygon: false,
      rectangle: false,
      circle: false,
      marker: markerValue
    },
    edit: {
      featureGroup: editableLayers, // REQUIRED!!
      remove: false
    }
  }
  return new L.Control.Draw(options)
}

function initMap () {
  console.log('initMap start')
  var map

  var attrOsm = 'Map data by <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, under <a href="https://www.openstreetmap.org/copyright">ODbL</a>. '
  var attrPois = 'POIs by <a href="http://solidariteconomy.eu">SUSY</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC-0</a>. '
  var leafletBgMaps
  var zoom
  var defaultlayer
  var center
  var baseMaps = {}

  baseMaps['mapnik'] = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: attrOsm + attrPois,
    maxZoom: 19,
    noWrap: true
  })
  baseMaps['stamen_terrain'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
        'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
        attrOsm + attrPois,
    maxZoom: 18,
    noWrap: true
  })
  baseMaps['stamen_terrain_bg'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
        'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
        attrOsm + attrPois,
    maxZoom: 18,
    noWrap: true
  })
  baseMaps['hot'] = new L.tileLayer('http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>. ' +
        attrOsm + attrPois,
    maxZoom: 20,
    noWrap: true
  })

  if (!leafletBgMaps) {
    leafletBgMaps = {
      'Stamen - Terrain': baseMaps['stamen_terrain'],
      'Stamen - Terrain Background': baseMaps['stamen_terrain_bg'],
      'OpenStreetMap - Mapnik': baseMaps['mapnik'],
      'Humanitarian OpenStreetMap ': baseMaps['hot']
    }
  }
  if (!defaultlayer) {
    defaultlayer = baseMaps['mapnik']
  }

  map = L.map('map', {
    zoomControl: true,
    center: center ? center : new L.LatLng(51.1657, 10.4515),
    zoom: zoom ? zoom : 15,
    layers: defaultlayer
  })

  const ctrl = new L.Control.Layers(leafletBgMaps)
  map.addControl(ctrl)
  var hash = new L.Hash(map) // Leaflet persistent Url Hash function

  // leaflet draw
  editableLayers = new L.FeatureGroup()
  map.addLayer(editableLayers)
  placeMarker = L.Icon.extend({
    options: {
      shadowUrl: null,
      iconAnchor: new L.Point(12, 40),
      iconSize: new L.Point(25, 40),
      iconUrl: 'marker-green.png'
    }
  })

  map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType
    var layer = e.layer

    if (type === 'marker') {
      layer.bindPopup('Press the edit button to move me. <img style="width:30px;height:30px;background-position:-150px -1px;background-image:url(\'images/spritesheet.svg\');background-size: 270px 30px;"> <br><br> Find it on the bottom left corner of the map.')
    }

    editableLayers.addLayer(layer)
    map.my_current_marker = layer
    document.getElementById('_geometry_lon').value = layer._latlng.lng.toFixed(6)
    document.getElementById('_geometry_lat').value = layer._latlng.lat.toFixed(6)

    map.removeControl(map.my_drawControl)
    map.my_drawControl = getDrawControl(false) // deactivate "add marker" after the 1st one
    map.addControl(map.my_drawControl)
      // fixme instantly enable 'edit' mode of layer
  })

  map.on('draw:editmove', function (e) {
    console.log('editmove')
    console.log(e)
    document.getElementById('_geometry_lon').value = e.layer._latlng.lng.toFixed(6)
    document.getElementById('_geometry_lat').value = e.layer._latlng.lat.toFixed(6)
  })

  map.my_editableLayers = editableLayers
  map.my_drawControl = drawControl
  map.my_placeMarker = placeMarker
  map.getDrawControl = getDrawControl

  map.updateMarkerFromForm = function () {
    const lat = document.getElementById('_geometry_lat').value
    const lon = document.getElementById('_geometry_lon').value
    console.log('new lat: ' + lat + ' lon: ' + lon)

    if (lat && lon) {
      const coords = L.latLng(lat, lon)
      map.my_current_marker.setLatLng(coords)
      map.panTo(coords)
    }
  }
  document.getElementById('_geometry_lat').onblur = map.updateMarkerFromForm
  document.getElementById('_geometry_lon').onblur = map.updateMarkerFromForm

  // console.log(map)

  console.log('initMap end')
  return map
}

module.exports = initMap
