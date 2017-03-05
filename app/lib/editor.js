/* global alert, L, XMLHttpRequest, XDomainRequest */ // used by standardjs (linter)

const initMap = require('./map.js')
const getUrlVars = require('./getUrlVars.js')
const redFetch = require('./red_fetch.js')
const taxonomy = require('./taxonomy.js')
const translations = require('./translations.js')
window.translations = translations

var map
const endpoint = 'https://data.transformap.co/place/'

module.exports = function () {
  console.log('editor initialize start')

  map = initMap()

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

  function createToiArray (toiString) {
    if (typeof (toiString) !== 'string') { return [] }
    var toiArray = toiString.split(';')
    for (var i = 0; i < toiArray.length; i++) {
      toiArray[i] = toiArray[i].trim()
    }
    return toiArray
  }

  var startLang = translations.selectAllowedLang(translations.current_lang)
  console.log("lang on start: " + startLang)
  console.log(translations.supported_languages)
  var typeOfInintiatives = []
  var toiHashtable = {}

  function fillTransforMapTax (data) {
    console.log('fillTransforMapTax called')

    var dataArray = data.results.bindings
    const current_lang = dataArray[0].itemLabel['xml:lang']

    var needs = []
    var interactions = []
    var identities = []

    dataArray.forEach(function (entry) {
      if (!entry.subclass_of) {
        return
      }
      var label = {}
      label[current_lang] = entry.itemLabel.value
      var currentObject = {
        item: entry.item.value,
        label: label
      }
      if(entry.subclass_of.value == 'https://base.transformap.co/entity/Q146') {
        currentObject['needs_tag'] = entry.needs_tag.value
        needs.push(currentObject)
      } else if (entry.subclass_of.value == 'https://base.transformap.co/entity/Q150') {
        currentObject['interaction_tag'] = entry.interaction_tag.value
        interactions.push(currentObject)
      } else if (entry.subclass_of.value == 'https://base.transformap.co/entity/Q176') {
        currentObject['identity_tag'] = entry.identity_tag.value
        identities.push(currentObject)
      }
    });

    //needs
    $('#_key_provides').empty()
    needs.forEach(function (entry) {
      var newOption = $('<option>')
      newOption.attr('value', entry.needs_tag)

      if (currentData.properties && currentData.properties.provides) {
        var needs_array = createToiArray(currentData.properties.provides)
        needs_array.forEach(function (need) {
          if (need === entry.needs_tag) {
            newOption.attr('selected','selected')
          }
        })
      }
      newOption.append(entry.label[current_lang])
      $('#_key_provides').append(newOption)
    })

    //interaction
    $('#_key_interaction').empty()
    interactions.forEach(function (entry) {
      var newOption = $('<option>')
      newOption.attr('value', entry.interaction_tag)

      if (currentData.properties && currentData.properties.interaction) {
        var interactions_array = createToiArray(currentData.properties.interaction)
        interactions_array.forEach(function (interact) {
          if (interact === entry.interaction_tag) {
            newOption.attr('selected','selected')
          }
        })
      }
      newOption.append(entry.label[current_lang])
      $('#_key_interaction').append(newOption)
    })

    //identity
    $('#_key_identity').empty()
    identities.forEach(function (entry) {
      var newOption = $('<option>')
      newOption.attr('value', entry.identity_tag)

      if (currentData.properties && currentData.properties.identity) {
        var identity_array = createToiArray(currentData.properties.identity)
        identity_array.forEach(function (identity) {
          if (identity === entry.identity_tag) {
            newOption.attr('selected','selected')
          }
        })
      }
      newOption.append(entry.label[current_lang])
      $('#_key_identity').append(newOption)
    })
  }

  function fillTOIs (data) {
    $('#_key_type_of_initiative').empty()

    typeOfInintiatives = []
    toiHashtable = {}

    var toiSelect = document.getElementById('_key_type_of_initiative')
    var dataArray = data.results.bindings
    const current_lang = dataArray[0].itemLabel['xml:lang']
    dataArray.forEach(function (entry) {
      if (!entry.type_of_initiative_tag) {
        return
      }
      if (toiHashtable[entry.type_of_initiative_tag.value]) { // filter out duplicates
        return
      }
      var label = {}
      label[current_lang] = entry.itemLabel.value

      var currentObject = {
        item: entry.item.value,
        label: label,
        type_of_initiative_tag: entry.type_of_initiative_tag.value
      }
      typeOfInintiatives.push(currentObject)
      toiHashtable[entry.type_of_initiative_tag.value] = currentObject
    })
    function labelCompare (a, b) {
      // 'Others' cat should get sorted last
      if (a.item === 'https://base.transformap.co/entity/Q20') return 1
      if (b.item === 'https://base.transformap.co/entity/Q20') return -1

      // in toi list, 'other*' should be last
      if (a.type_of_initiative_tag && a.type_of_initiative_tag.match(/^other_/)) return 1
      if (b.type_of_initiative_tag && b.type_of_initiative_tag.match(/^other_/)) return -1

      if (a.label[current_lang] < b.label[current_lang]) {
        return -1
      } else {
        return 1
      }
    }
    typeOfInintiatives.sort(labelCompare)

    typeOfInintiatives.forEach(function (entry) {
      var newOption = document.createElement('option')
      var optionValue = document.createAttribute('value')
      optionValue.value = entry.type_of_initiative_tag
      newOption.setAttributeNode(optionValue)

      if (currentData.properties && currentData.properties.type_of_initiative) {
        var tois = createToiArray(currentData.properties.type_of_initiative)
        tois.forEach(function (toi) {
          if (toi === entry.type_of_initiative_tag) {
            var newSelected = document.createAttribute('selected')
            newOption.setAttributeNode(newSelected)
          }
        })
      }

      var label = document.createTextNode(entry.label[current_lang]) // FIXME fallback langs
      newOption.appendChild(label)

      toiSelect.appendChild(newOption)
    })
  }

  function addFreeTagsRow () {
    var freetags = document.getElementById('freetags')

    var lastRow = freetags.lastChild
    while (lastRow.nodeType === 3) { // 3 = text-node
      lastRow = lastRow.previousSibling
    }

    var keyNode = (lastRow.firstChild.nodeType === 1) ? lastRow.firstChild : lastRow.firstChild.nextSibling
    var newNr = parseInt(keyNode.id.slice(-1)) + 1

    var newRow = document.createElement('div')
    var divClass = document.createAttribute('class')
    divClass.value = 'row'
    newRow.setAttributeNode(divClass)
    var newKey = document.createElement('input')
    var bootstrapClass = document.createAttribute('class')
    bootstrapClass.value = 'form-control';
    newKey.setAttributeNode(bootstrapClass);
    var bootstrapClass = document.createAttribute('class')
    bootstrapClass.value = 'form-control';
    var newValue = document.createElement('input')
    newValue.setAttributeNode(bootstrapClass);
    var keyId = document.createAttribute('id')
    keyId.value = 'key' + newNr
    var valueId = document.createAttribute('id')
    valueId.value = 'value' + newNr
    newKey.setAttributeNode(keyId)
    newValue.setAttributeNode(valueId)

    var elementName = document.createAttribute('name')
    elementName.value = 'freetags'
    newKey.setAttributeNode(elementName)
    newValue.setAttributeNode(elementName.cloneNode(true))

    newRow.appendChild(newKey)
    newRow.appendChild(newValue)
    freetags.appendChild(newRow)
  }

  var currentData = {}

  function fillForm (placeData) {
    currentData = placeData

    if (currentData._deleted) {
      document.getElementById('deleted').style.display = 'block'
    }

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

          addFreeTagsRow()
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
    if (currentData.properties && currentData.properties._id) {
      document.getElementById('_id').value = currentData.properties._id
      $('#transformapapilink').attr('href', endpoint + currentData.properties._id)
    } else if (currentData._id) {
      document.getElementById('_id').value = currentData._id
      $('#transformapapilink').attr('href', endpoint + currentData._id)
    }
    if(currentData.properties.osm) {
      $('#osmlink').attr('href', currentData.properties.osm)
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

  //add languageswitcher
  var menu = document.getElementById('menu')
  $('#menu').append(
      '<div id=languageSelector onClick="$(\'#languageSelector ul\').toggleClass(\'open\');">' +
        '<span lang=en>Choose Language:</span>' +
        '<ul></ul>' +
      '</div>')

  function initializeTranslatedTOIs(Q5data) {
    translations.initializeLanguageSwitcher(Q5data)
    
    var nowPossibleLang = translations.selectAllowedLang(translations.current_lang)
    translations.current_lang = nowPossibleLang
    fetchAndSetNewTranslation(nowPossibleLang)
  }

  function fetchAndSetNewTranslation(lang) {
    redFetch([ taxonomy.getLangTaxURL(lang, 'Q8'), 'https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/taxonomy-backup/susy/taxonomy.' + lang + '.json' ],
        fillTOIs,
        function (error) { console.error('none of the taxonomy data urls available') },
        { cacheBusting: false })
    redFetch([ taxonomy.getLangTaxURL(lang, 'Q4'), 'https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/taxonomy-backup/susy/taxonomy.' + lang + '.json' ],
        fillTransforMapTax,
        function (error) { console.error('none of the taxonomy data urls available') },
        { cacheBusting: false })
  }
  translations.fetchAndSetNewTranslation = fetchAndSetNewTranslation

  redFetch( [ "https://base.transformap.co/wiki/Special:EntityData/Q5.json", "https://raw.githubusercontent.com/TransforMap/transformap-viewer/Q5-fallback.json" ],
    initializeTranslatedTOIs,
    function(error) { console.error("none of the lang init data urls available") } );


  function createCORSRequest (method, url) {
    // taken from https://www.html5rocks.com/en/tutorials/cors/
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

  function clickSubmit () {
    console.log('clickSubmit enter')
    const requiredFields = [ '_key_type_of_initiative', '_key_name', '_geometry_lat', '_geometry_lon' ]
    for (var i = 0; i < requiredFields.length; i++) {
      var id = requiredFields[i]
      var value = document.getElementById(id).value
      if (!value || !value.length) {
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

        for (var childCounter = 0; childCounter < element.children.length; childCounter++) {
          var child = element.children[childCounter]
          if (child.selected === true) {
            data.properties[key] = (data.properties[key] ? (data.properties[key] + ';') : '') + child.value
          }
        }
      }
    }

    // textarea
    var allTextareas = document.getElementsByTagName('textarea')
    for (var i = 0; i < allTextareas.length; i++) {
      var element = allTextareas[i]
      if (/^_key_/.test(element.id) && element.value) {
        var key = element.id.replace(/^_key_/, '')
        data.properties[key] = element.value.trim()
      }
    }

    console.log(data)

    const uuid = document.getElementById('_id').value
    const sendData = JSON.stringify(data)
    console.log(sendData)

    // PUT is for UPDATE, POST is for CREATE
    var xhr = createCORSRequest(uuid ? 'PUT' : 'POST', endpoint + uuid)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(sendData)
    console.log(xhr)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var retJson = JSON.parse(xhr.responseText)
          console.log(retJson)
          if(retJson.id) {
            document.getElementById('_id').value = retJson.id
            $('#transformapapilink').attr('href', endpoint + retJson.id)
            $('#osmlink').attr('href', $('#_key_osm').attr('value') )
            alert('Save successful')
          } else {
            alert('Error: something wrent wrong on saving: ' + JSON.stringify(retJson) )
          }
        } else {
          console.error(xhr)
        }
      }
    }
    document.getElementById('deleted').style.display = 'none'
  }
  document.getElementById('save').onclick = clickSubmit

  function clickDelete () {
    const uuid = document.getElementById('_id').value
    if (!uuid) {
      alert('nothing to delete')
      return
    }
    if(!confirm('Do you really want to delete this POI? It will be only marked as deleted and can be restored later if you save the current Browser URL.')) {
      console.log('user aborted delete')
      return
    }
    var xhr = createCORSRequest('DELETE', endpoint + uuid)
    xhr.send()
    console.log(xhr)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var retJson = JSON.parse(xhr.responseText)
          console.log(retJson)
        } else {
          console.error(xhr)
        }
      }
    }
    document.getElementById('deleted').style.display = 'block'
  }
  document.getElementById('delete').onclick = clickDelete
  document.getElementById('plus').onclick = addFreeTagsRow

  function clickSearch () {
    const country = document.getElementById('_key_addr:country').value
    const city = document.getElementById('_key_addr:city').value
    // const postcode = document.getElementById('_key_addr:postcode').value // postcode not used in nominatim, decreases result quality
    const street = document.getElementById('_key_addr:street').value
    const housenumber = document.getElementById('_key_addr:housenumber').value

    var querystring = 'q='
    if (street) {
      if (housenumber) {
        querystring += housenumber + '+'
      }
      querystring += street + ','
    }
    if (city) {
      querystring += city + ','
    }
    querystring += country

    var query = '//nominatim.openstreetmap.org/search?' + querystring + '&format=json&limit=1&email=mapping@transformap.co'
    console.log(query)

    redFetch([ query ],
        function (successData) {
          console.log(successData)
          if (successData.length !== 1) {
            console.error('error in Nominatim return data: length != 1')
            alert('Sorry, Nothing found')
            return
          }
          var result = successData[0]
          if (result.class === 'building' ||
              result.class === 'amenity' ||
              result.class === 'shop' ||
              (result.class === 'place' && result.type === 'house')
            ) {
            console.log('address found exactly')
            document.getElementById('_geometry_lon').value = result.lon
            document.getElementById('_geometry_lat').value = result.lat

            // trigger update of place marker
            document.getElementById('_geometry_lat').focus()
            document.getElementById('_geometry_lon').focus()
            map.setView(new L.LatLng(result.lat, result.lon), 18)
          } else {
            map.setView(new L.LatLng(result.lat, result.lon), 18)
            console.log('address not found exactly')
            setTimeout(function () { // wait for map to pan to location
              alert('Attention: The address was not found exactly, please place the marker manually!')
              document.getElementById('_geometry_lon').value = ''
              document.getElementById('_geometry_lat').value = ''
              document.getElementById('_geometry_lon').focus()
              document.getElementById('_geometry_lat').focus()
            }, 400)
          }
        },
        function (error) {
          console.log(error)
          alert('Sorry, Address search did not work')
        }
        )
  }
  document.getElementById('coordsearch').onclick = clickSearch

 function stopRKey(evt) {
    var evt = (evt) ? evt : ((event) ? event : null)
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null)
    if ((evt.keyCode == 13) && (node.type == 'text')) {
      return false
    } 
  }
  document.onkeypress = stopRKey

  function updateLinkPosition() {
    var centre = map.getCenter()
    var targetlocation = '#' + map.getZoom() + '/' + centre.lat + '/' + centre.lng

    var maplink = document.getElementById('gotomap')
    var href = maplink.getAttribute ('href')
    var splitstr = href.split('#')
    href = maplink.getAttribute ('href').split('#')[0] + targetlocation
    maplink.setAttribute('href',href);

    var newlink = document.getElementById('newbutton')
    newlink.setAttribute('href','./' + targetlocation)


  }
  map.on('moveend', updateLinkPosition);

  console.log('editor initialize end')
}
