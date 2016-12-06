const initMap = require('./map.js')
const getUrlVars = require('./getUrlVars.js')
const redFetch = require('./red_fetch.js')

var map

module.exports = function () {
  console.log('editor initialize start')

  var map = initMap()

  var lang = 'de'

  var urlVars = getUrlVars()
  var dataUrls
  const place = urlVars['place']
  if (place) {
    if (/^[0-9a-f-]{32,36}$/i.test(place)) {
      const normalizedPlace = place.replace(/-/, '')
      if (normalizedPlace.length == 32) {
        dataUrls = [ 'https://data.transformap.co/place/' + place, 'http://192.168.0.2:6000/place/' + place, place ]
      } else {
        dataUrls = [ place ]
      }
    } else {
      dataUrls = [ place ]
    }
  }

  var currentData = {}

  function fillForm (placeData) {
    currentData = placeData
    if (currentData.properties) {
      for (var key in currentData.properties) {
        var field = document.getElementById('_key_' + key)
        var value = currentData.properties[key]
        if (field) {
          // console.log(field)
          // console.log(value)
          field.value = value
        } else { // put it into "free tags"
          // get last child
          var freetags = document.getElementById('freetags')
          var lastRow = freetags.lastChild
          while (lastRow.nodeType == 3) { // 3 = text-node
            lastRow = lastRow.previousSibling
          }

          // set data on last child
          var keyNode = (lastRow.firstChild.nodeType == 1) ? lastRow.firstChild : lastRow.firstChild.nextSibling
          keyNode.value = key
          var valueNode = (lastRow.lastChild.nodeType == 1) ? lastRow.lastChild : lastRow.lastChild.previousSibling
          valueNode.value = value

          var newNr = parseInt(keyNode.id.slice(-1)) + 1
          // append child+1
          var newRow = document.createElement('div')
          var divClass = document.createAttribute('class')
          divClass.value = 'row'
          newRow.setAttributeNode(divClass)
          var newKey = document.createElement('input')
          var newValue = document.createElement('input')
          var keyId = document.createAttribute('id')
          keyId.value = 'key' + newNr
          var valueId = document.createAttribute('id')
          valueId.value = 'value' + newNr
          newKey.setAttributeNode(keyId)
          newValue.setAttributeNode(valueId)
          newRow.appendChild(newKey)
          newRow.appendChild(newValue)
          freetags.appendChild(newRow)
        }
      }
    }
    if (currentData.geometry && currentData.geometry.coordinates) {
      var lon = currentData.geometry.coordinates[0]
      var lat = currentData.geometry.coordinates[1]
      if (lat === undefined || lon === undefined) {
        console.error('lat or lon empty')
        return
      }

      document.getElementById('_geometry_lon').value = lon
      document.getElementById('_geometry_lat').value = lat

      map.my_current_marker = new L.marker([lat, lon], { icon: new map.my_placeMarker() })
      map.my_editableLayers.addLayer(map.my_current_marker)

      map.my_drawControl = map.getDrawControl(false)
      map.addControl(map.my_drawControl)

      map.panTo(new L.LatLng(lat, lon))
    } else { // allow adding a marker
      map.my_drawControl = map.getDrawControl(true)
      map.addControl(map.my_drawControl)
    }
  }

  if (place) {
    redFetch(dataUrls, fillForm, function (e) {
      console.error(e)
      map.my_drawControl = map.getDrawControl(true)
      map.addControl(map.my_drawControl)
    })
  } else {
    map.my_drawControl = map.getDrawControl(true)
    map.addControl(map.my_drawControl)
  }

  console.log('editor initialize end')
}
