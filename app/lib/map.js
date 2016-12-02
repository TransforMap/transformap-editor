const L = require('leaflet')
const redFetch = require('./red_fetch.js')

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

  var lang = 'de'
  const data_urls = [ 'http://192.168.0.2:6000/place/2c10b95ea433712f0b06a3f7d300020f', '2c10b95ea433712f0b06a3f7d310e7d5' ]

  var current_data = {}

  function fillForm(place_data) {
    current_data = place_data
    if(current_data.properties) {
      for(var key in current_data.properties) {
        var field = document.getElementById("_key_" + key)
        var value = current_data.properties[key]
        if(field) {
          console.log(field)
          console.log(value)
          field.value = value
        } else {
          //get last child
          var freetags = document.getElementById("freetags")
          console.log(freetags)
          var last_row = freetags.lastChild
          while(last_row.nodeType == 3) //3 = text-node
            last_row = last_row.previousSibling
          console.log(last_row)

          //set data on last child
          var key_node = (last_row.firstChild.nodeType == 1) ? last_row.firstChild : last_row.firstChild.nextSibling
          key_node.value = key
          var value_node = (last_row.lastChild.nodeType == 1) ? last_row.lastChild : last_row.lastChild.previousSibling
          value_node.value = value

          var new_nr = parseInt(key_node.id.slice(-1)) + 1
          //append child+1
          var new_row = document.createElement("div")
          var div_class = document.createAttribute("class");
          div_class.value = "row";
          new_row.setAttributeNode(div_class);
          var new_key = document.createElement("input")
          var new_value = document.createElement("input")
          var key_id = document.createAttribute("id")
            key_id.value = "key" + new_nr
          var value_id = document.createAttribute("id")
            value_id.value = "value" + new_nr
          new_key.setAttributeNode(key_id)
          new_value.setAttributeNode(value_id)
          new_row.appendChild(new_key)
          new_row.appendChild(new_value)
          freetags.appendChild(new_row)
        }
      }
    }
  }

  redFetch(data_urls,fillForm,console.error)

  console.log("'initMap' called")
}
