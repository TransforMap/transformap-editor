const L = require('leaflet')

module.exports = function () {
  console.log("called initMap, didn't reply")
  const center = new L.LatLng(51.1657, 10.4515)
  var baseMaps = {}
  baseMaps['stamen_terrain'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
      'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
    maxZoom: 18,
    noWrap: true
  })
  const basemaps = {
    'Stamen - Terrain': baseMaps['stamen_terrain']
  }
  const map = L.map('map', {
    zoomControl: false,
    center: center,
//    zoom: window.zoom ? zoom : 5,
    zoom: 5,
    layers: baseMaps['stamen_terrain']
  })
  const ctrl = new L.Control.Layers(basemaps)
  map.addControl(ctrl)
  console.log("'initMap' called")
}
