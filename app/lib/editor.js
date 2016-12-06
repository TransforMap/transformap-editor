const initMap = require('./map.js')
const getUrlVars = require('./getUrlVars.js')
const redFetch = require('./red_fetch.js')

var map;

module.exports = function () {
  console.log("called initialize, didn't reply")

  var map = initMap()

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
          //console.log(field)
          //console.log(value)
          field.value = value
        } else { //put it into "free tags"
          //get last child
          var freetags = document.getElementById("freetags")
          var last_row = freetags.lastChild
          while(last_row.nodeType == 3) //3 = text-node
            last_row = last_row.previousSibling

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
    if(current_data.geometry && current_data.geometry.coordinates) {
      var lon = current_data.geometry.coordinates[0],
          lat = current_data.geometry.coordinates[1];
      if(lat === undefined || lon === undefined) {
        console.error("lat or lon empty")
        return
      }

      document.getElementById("_geometry_lon").value = lon
      document.getElementById("_geometry_lat").value = lat

      map.my_editableLayers.addLayer(new L.marker([lat,lon], { icon: new map.my_placeMarker() }))

      map.my_drawControl = map.getDrawControl(false)
      map.addControl(map.my_drawControl)

      map.panTo(new L.LatLng(lat,lon))

    }
    else { //allow adding a marker
      map.my_drawControl = map.getDrawControl(true)
      map.addControl(map.my_drawControl)
    }

  }

  redFetch(data_urls,fillForm,console.error)

  console.log("'initialize' called")
}
