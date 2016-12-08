const initMap = require('./map.js')
const getUrlVars = require('./getUrlVars.js')
const redFetch = require('./red_fetch.js')

var map
const endpoint = 'https://data.transformap.co/place/'

module.exports = function () {
  console.log('editor initialize start')

  map = initMap()

  var lang = 'de'

  var urlVars = getUrlVars()
  var dataUrls
  const place = urlVars['place']
  if (place) {
    if (/^[0-9a-f-]{32,36}$/i.test(place)) {
      const normalizedPlace = place.replace(/-/, '')
      if (normalizedPlace.length === 32) {
        dataUrls = [ endpoint + place, 'http://192.168.0.2:6000/place/' + place, place ]
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
        // ignore DB-generated fields
        if (/^_/.test(key)) {
          continue
        }

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
          while (lastRow.nodeType === 3) { // 3 = text-node
            lastRow = lastRow.previousSibling
          }

          // set data on last child
          var keyNode = (lastRow.firstChild.nodeType === 1) ? lastRow.firstChild : lastRow.firstChild.nextSibling
          keyNode.value = key
          var valueNode = (lastRow.lastChild.nodeType === 1) ? lastRow.lastChild : lastRow.lastChild.previousSibling
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
    if(currentData.properties._id) 
      document.getElementById('_id').value = currentData.properties._id
    else if(currentData._id)
      document.getElementById('_id').value = currentData._id
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

  function clickSubmit() {
    console.log('clickSubmit enter')
    const requiredFields = [ '_key_type_of_initiative','_key_name','_geometry_lat','_geometry_lon']
    for(var i = 0; i < requiredFields.length; i++) {
      var id = requiredFields[i]
      var value = document.getElementById(id).value
      if(! value || !value.length) {
        console.error('submit: field ' + id + ' empty')
        alert('Error on submit: field ' + id.replace(/^_key_/, '') + ' is not allowed to be empty')
        return false
      }
    }

    var data = {
      'type': 'Feature',
      'properties': {
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          parseFloat(document.getElementById('_geometry_lon').value),
          parseFloat(document.getElementById('_geometry_lat').value)
        ]
      }
    }

    // all 'input type=text'
    var allInputs = document.getElementsByTagName('input')
    var freeTags = { keys: {}, values: {} }

    console.log(allInputs)

    for (var i = 0; i < allInputs.length; i++) {
      var element = allInputs[i]
      if (!element.type === 'text') {
        continue
      }
      if (element.value && element.id) {
        console.log(element.id + ': ' + element.value)
        if (/^_key_/.test(element.id)) {
          var key = element.id.replace(/^_key_/, '')
          data.properties[key] = element.value.trim()
       // element of 'free tags'
        } else if (/^key[0-9]+$/.test(element.id) && element.name === 'freetags') {
          var nr = element.id.replace(/^key/, '')
          freeTags.keys[nr] = element.value
        } else if (/^value[0-9]+$/.test(element.id) && element.name === 'freetags') {
          var nr = element.id.replace(/^value/, '')
          freeTags.values[nr] = element.value
        }
      }
    }
    console.log(freeTags)

    for (var keynr in freeTags.keys) {
      var key = freeTags.keys[keynr].trim()
      if (key && freeTags.values[keynr]) { // only take if key and value are not ""
        data.properties[key] = freeTags.values[keynr].trim()
      }
    }

    // drop-down
    var allSelects = document.getElementsByTagName('select')
    for (var i = 0; i < allSelects.length; i++) {
      var element = allSelects[i]
      if (/^_key_/.test(element.id) && element.value) {
        var key = element.id.replace(/^_key_/, '')
        data.properties[key] = element.value
      }
    }

    // textarea
    var allTextareas = document.getElementsByTagName('textarea')
    console.log(allTextareas)
    for (var i = 0; i < allTextareas.length; i++) {
      var element = allTextareas[i]
      if (/^_key_/.test(element.id) && element.value) {
        var key = element.id.replace(/^_key_/, '')
        data.properties[key] = element.value.trim()
      }
    }

    console.log(data)

    function createCORSRequest (method, url) {
      // tajen from https://www.html5rocks.com/en/tutorials/cors/
      var xhr = new XMLHttpRequest()
      if ('withCredentials' in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true)
      } else if (typeof XDomainRequest !== 'undefined') {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest()
        xhr.open(method, url)
      } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null
      }
      return xhr
    }

    const uuid = document.getElementById('_id').value
    const sendData = JSON.stringify(data)
    console.log(sendData)

    // PUT is for UPDATE, POST is for CREATE
    var xhr = createCORSRequest(uuid ? 'PUT' : 'POST', endpoint + uuid)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(sendData)
    console.log(xhr)

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var retJson = JSON.parse(xhr.responseText)
          console.log(retJson)
          document.getElementById('_id').value = retJson.id
        } else {
          console.error(xhr)
        }
      }
    }
  }
  document.getElementById('save').onclick = clickSubmit

  console.log('editor initialize end')
}
