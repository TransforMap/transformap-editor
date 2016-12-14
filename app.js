(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var editor = require('lib/editor');

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  editor();
  console.log('Initialized app');
});
});

;require.register("lib/editor.js", function(exports, require, module) {
'use strict';

var initMap = require('./map.js');
var getUrlVars = require('./getUrlVars.js');
var redFetch = require('./red_fetch.js');
var taxonomy = require('./taxonomy.js');

var map;
var endpoint = 'https://data.transformap.co/place/';

module.exports = function () {
  console.log('editor initialize start');

  map = initMap();

  var urlVars = getUrlVars();
  var dataUrls;
  var place = urlVars['place'];
  if (place) {
    if (/^[0-9a-f-]{32,36}$/i.test(place)) {
      var normalizedPlace = place.replace(/-/, '');
      if (normalizedPlace.length === 32) {
        dataUrls = [endpoint + place, 'http://192.168.0.2:6000/place/' + place, place];
      } else {
        dataUrls = [place];
      }
    } else {
      dataUrls = [place];
    }
  }

  function createToiArray(toi_string) {
    if (typeof toi_string !== 'string') return [];
    var toi_array = toi_string.split(';');
    for (var i = 0; i < toi_array.length; i++) {
      toi_array[i] = toi_array[i].trim();
    }
    return toi_array;
  }

  var lang = 'en';
  var typeOfInintiatives = [];
  var toiHashtable = {};

  function fillTOIs(data) {
    var toiSelect = document.getElementById('_key_type_of_initiative');
    var dataArray = data.results.bindings;
    var lastTypeOfInitiative = '';
    dataArray.forEach(function (entry) {
      if (!entry.type_of_initiative_tag) {
        return;
      }
      if (toiHashtable[entry.type_of_initiative_tag.value]) {
        // filter out duplicates
        return;
      }
      var label = {};
      label[entry.itemLabel['xml:lang']] = entry.itemLabel.value;

      var currentObject = {
        item: entry.item.value,
        label: label,
        type_of_initiative_tag: entry.type_of_initiative_tag.value
      };
      typeOfInintiatives.push(currentObject);
      toiHashtable[entry.type_of_initiative_tag.value] = currentObject;
    });
    function labelCompare(a, b) {
      // 'Others' cat should get sorted last
      if (a.item == "https://base.transformap.co/entity/Q20") return 1;
      if (b.item == "https://base.transformap.co/entity/Q20") return -1;

      //in toi list, 'other*' should be last
      if (a.type_of_initiative_tag && a.type_of_initiative_tag.match(/^other_/)) return 1;
      if (b.type_of_initiative_tag && b.type_of_initiative_tag.match(/^other_/)) return -1;

      if (a.label[lang] < b.label[lang]) return -1;else return 1;
    }
    typeOfInintiatives.sort(labelCompare);

    typeOfInintiatives.forEach(function (entry) {
      var newOption = document.createElement('option');
      var optionValue = document.createAttribute('value');
      optionValue.value = entry.type_of_initiative_tag;
      newOption.setAttributeNode(optionValue);

      if (currentData.properties && currentData.properties.type_of_initiative) {
        var tois = createToiArray(currentData.properties.type_of_initiative);
        tois.forEach(function (toi) {
          if (toi == entry.type_of_initiative_tag) {
            var newSelected = document.createAttribute('selected');
            newOption.setAttributeNode(newSelected);
          }
        });
      }

      var label = document.createTextNode(entry.label[lang]); //FIXME fallback langs
      newOption.appendChild(label);

      toiSelect.appendChild(newOption);
    });
  }

  // load taxonomy from server
  redFetch([taxonomy.getLangTaxURL(lang), "https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/taxonomy-backup/susy/taxonomy." + lang + ".json"], fillTOIs, function (error) {
    console.error("none of the taxonomy data urls available");
  });

  function addFreeTagsRow() {
    var freetags = document.getElementById('freetags');

    var lastRow = freetags.lastChild;
    while (lastRow.nodeType === 3) {
      // 3 = text-node
      lastRow = lastRow.previousSibling;
    }

    var keyNode = lastRow.firstChild.nodeType === 1 ? lastRow.firstChild : lastRow.firstChild.nextSibling;
    var newNr = parseInt(keyNode.id.slice(-1)) + 1;

    var newRow = document.createElement('div');
    var divClass = document.createAttribute('class');
    divClass.value = 'row';
    newRow.setAttributeNode(divClass);
    var newKey = document.createElement('input');
    var newValue = document.createElement('input');
    var keyId = document.createAttribute('id');
    keyId.value = 'key' + newNr;
    var valueId = document.createAttribute('id');
    valueId.value = 'value' + newNr;
    newKey.setAttributeNode(keyId);
    newValue.setAttributeNode(valueId);

    var elementName = document.createAttribute('name');
    elementName.value = 'freetags';
    newKey.setAttributeNode(elementName);
    newValue.setAttributeNode(elementName.cloneNode(true));

    newRow.appendChild(newKey);
    newRow.appendChild(newValue);
    freetags.appendChild(newRow);
  }

  var currentData = {};

  function fillForm(placeData) {
    currentData = placeData;

    if (currentData._deleted) {
      document.getElementById('deleted').style.display = "block";
    }

    if (currentData.properties) {
      for (var key in currentData.properties) {
        // ignore DB-generated fields
        if (/^_/.test(key)) {
          continue;
        }

        var field = document.getElementById('_key_' + key);
        var value = currentData.properties[key];

        if (field) {
          // console.log(field)
          // console.log(value)
          field.value = value;
        } else {
          // put it into "free tags"
          // get last child
          var freetags = document.getElementById('freetags');
          var lastRow = freetags.lastChild;
          while (lastRow.nodeType === 3) {
            // 3 = text-node
            lastRow = lastRow.previousSibling;
          }

          // set data on last child
          var keyNode = lastRow.firstChild.nodeType === 1 ? lastRow.firstChild : lastRow.firstChild.nextSibling;
          keyNode.value = key;
          var valueNode = lastRow.lastChild.nodeType === 1 ? lastRow.lastChild : lastRow.lastChild.previousSibling;
          valueNode.value = value;

          addFreeTagsRow();
        }
      }
    }
    if (currentData.geometry && currentData.geometry.coordinates) {
      var lon = currentData.geometry.coordinates[0];
      var lat = currentData.geometry.coordinates[1];
      if (lat === undefined || lon === undefined) {
        console.error('lat or lon empty');
        return;
      }

      document.getElementById('_geometry_lon').value = lon;
      document.getElementById('_geometry_lat').value = lat;

      map.my_current_marker = new L.marker([lat, lon], { icon: new map.my_placeMarker() });
      map.my_editableLayers.addLayer(map.my_current_marker);

      map.my_drawControl = map.getDrawControl(false);
      map.addControl(map.my_drawControl);

      map.panTo(new L.LatLng(lat, lon));
    } else {
      // allow adding a marker
      map.my_drawControl = map.getDrawControl(true);
      map.addControl(map.my_drawControl);
    }
    if (currentData.properties && currentData.properties._id) document.getElementById('_id').value = currentData.properties._id;else if (currentData._id) document.getElementById('_id').value = currentData._id;
  }

  if (place) {
    redFetch(dataUrls, fillForm, function (e) {
      console.error(e);
      map.my_drawControl = map.getDrawControl(true);
      map.addControl(map.my_drawControl);
    });
  } else {
    map.my_drawControl = map.getDrawControl(true);
    map.addControl(map.my_drawControl);
  }

  function createCORSRequest(method, url) {
    // taken from https://www.html5rocks.com/en/tutorials/cors/
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
    return xhr;
  }

  function clickSubmit() {
    console.log('clickSubmit enter');
    var requiredFields = ['_key_type_of_initiative', '_key_name', '_geometry_lat', '_geometry_lon'];
    for (var i = 0; i < requiredFields.length; i++) {
      var id = requiredFields[i];
      var value = document.getElementById(id).value;
      if (!value || !value.length) {
        console.error('submit: field ' + id + ' empty');
        alert('Error on submit: field ' + id.replace(/^_key_/, '') + ' is not allowed to be empty');
        return false;
      }
    }

    var data = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': [parseFloat(document.getElementById('_geometry_lon').value), parseFloat(document.getElementById('_geometry_lat').value)]
      }
    };

    // all 'input type=text'
    var allInputs = document.getElementsByTagName('input');
    var freeTags = { keys: {}, values: {} };

    console.log(allInputs);

    for (var i = 0; i < allInputs.length; i++) {
      var element = allInputs[i];
      if (!element.type === 'text') {
        continue;
      }
      if (element.value && element.id) {
        console.log(element.id + ': ' + element.value);
        if (/^_key_/.test(element.id)) {
          var key = element.id.replace(/^_key_/, '');
          data.properties[key] = element.value.trim();
          // element of 'free tags'
        } else if (/^key[0-9]+$/.test(element.id) && element.name === 'freetags') {
          var nr = element.id.replace(/^key/, '');
          freeTags.keys[nr] = element.value;
        } else if (/^value[0-9]+$/.test(element.id) && element.name === 'freetags') {
          var nr = element.id.replace(/^value/, '');
          freeTags.values[nr] = element.value;
        }
      }
    }
    console.log(freeTags);

    for (var keynr in freeTags.keys) {
      var key = freeTags.keys[keynr].trim();
      if (key && freeTags.values[keynr]) {
        // only take if key and value are not ""
        data.properties[key] = freeTags.values[keynr].trim();
      }
    }

    // drop-down
    var allSelects = document.getElementsByTagName('select');
    for (var i = 0; i < allSelects.length; i++) {
      var element = allSelects[i];
      if (/^_key_/.test(element.id) && element.value) {
        var key = element.id.replace(/^_key_/, '');

        for (var childCounter = 0; childCounter < element.children.length; childCounter++) {
          var child = element.children[childCounter];
          if (child.selected == true) {
            data.properties[key] = (data.properties[key] ? data.properties[key] + ';' : '') + child.value;
          }
        }
      }
    }

    // textarea
    var allTextareas = document.getElementsByTagName('textarea');
    for (var i = 0; i < allTextareas.length; i++) {
      var element = allTextareas[i];
      if (/^_key_/.test(element.id) && element.value) {
        var key = element.id.replace(/^_key_/, '');
        data.properties[key] = element.value.trim();
      }
    }

    console.log(data);

    var uuid = document.getElementById('_id').value;
    var sendData = JSON.stringify(data);
    console.log(sendData);

    // PUT is for UPDATE, POST is for CREATE
    var xhr = createCORSRequest(uuid ? 'PUT' : 'POST', endpoint + uuid);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(sendData);
    console.log(xhr);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var retJson = JSON.parse(xhr.responseText);
          console.log(retJson);
          document.getElementById('_id').value = retJson.id;
        } else {
          console.error(xhr);
        }
      }
    };
    document.getElementById('deleted').style.display = "none";
  }
  document.getElementById('save').onclick = clickSubmit;

  function clickDelete() {
    var uuid = document.getElementById('_id').value;
    if (!uuid) {
      alert('nothing to delete');
      return;
    }
    var xhr = createCORSRequest('DELETE', endpoint + uuid);
    xhr.send();
    console.log(xhr);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var retJson = JSON.parse(xhr.responseText);
          console.log(retJson);
        } else {
          console.error(xhr);
        }
      }
    };
    document.getElementById('deleted').style.display = "block";
  }
  document.getElementById('delete').onclick = clickDelete;
  document.getElementById('plus').onclick = addFreeTagsRow;

  console.log('editor initialize end');
};
});

;require.register("lib/getUrlVars.js", function(exports, require, module) {
'use strict';

/*
 * This library provides a simple function to parse URL parameters
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL
 *
 * returns object with key:value pairs

 This program is free software. It comes without any warranty, to
     * the extent permitted by applicable law. You can redistribute it
     * and/or modify it under the terms of the Do What The Fuck You Want
     * To Public License, Version 2, as published by Sam Hocevar. See
     * http://www.wtfpl.net/ for more details. */

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value.replace(/#.*$/, '');
  });
  return vars;
}

module.exports = getUrlVars;
});

;require.register("lib/map.js", function(exports, require, module) {
'use strict';

var L = require('leaflet');
var L_Hash = require('leaflet-hash');
var L_Draw = require('leaflet-draw');
var getUrlVars = require('./getUrlVars.js');

var editableLayers;
var drawControl;
var placeMarker;

function getDrawControl(allowNewMarker) {
  var markerValue = allowNewMarker ? { icon: new placeMarker() } : false;
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
  };
  return new L.Control.Draw(options);
}

function initMap() {
  console.log('initMap start');
  var map;

  var attrOsm = 'Map data by <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, under <a href="https://www.openstreetmap.org/copyright">ODbL</a>. ';
  var attrPois = 'POIs by <a href="http://solidariteconomy.eu">SUSY</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC-0</a>. ';
  var leafletBgMaps;
  var zoom;
  var defaultlayer;
  var center;
  var baseMaps = {};

  baseMaps['mapnik'] = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: attrOsm + attrPois,
    maxZoom: 19,
    noWrap: true
  });
  baseMaps['stamen_terrain'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' + 'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' + attrOsm + attrPois,
    maxZoom: 18,
    noWrap: true
  });
  baseMaps['stamen_terrain_bg'] = new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' + 'under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' + attrOsm + attrPois,
    maxZoom: 18,
    noWrap: true
  });
  baseMaps['hot'] = new L.tileLayer('http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>. ' + attrOsm + attrPois,
    maxZoom: 20,
    noWrap: true
  });

  if (!leafletBgMaps) {
    leafletBgMaps = {
      'Stamen - Terrain': baseMaps['stamen_terrain'],
      'Stamen - Terrain Background': baseMaps['stamen_terrain_bg'],
      'OpenStreetMap - Mapnik': baseMaps['mapnik'],
      'Humanitarian OpenStreetMap ': baseMaps['hot']
    };
  }
  if (!defaultlayer) {
    defaultlayer = baseMaps['mapnik'];
  }

  map = L.map('map', {
    zoomControl: true,
    center: center ? center : new L.LatLng(51.1657, 10.4515),
    zoom: zoom ? zoom : 15,
    layers: defaultlayer
  });

  var ctrl = new L.Control.Layers(leafletBgMaps);
  map.addControl(ctrl);
  var hash = new L.Hash(map); // Leaflet persistent Url Hash function

  // leaflet draw
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
    var type = e.layerType;
    var layer = e.layer;

    if (type === 'marker') {
      layer.bindPopup('A popup!');
    }

    editableLayers.addLayer(layer);
    map.my_current_marker = layer;
    document.getElementById('_geometry_lon').value = layer._latlng.lng.toFixed(6);
    document.getElementById('_geometry_lat').value = layer._latlng.lat.toFixed(6);

    map.removeControl(map.my_drawControl);
    map.my_drawControl = getDrawControl(false); // deactivate "add marker" after the 1st one
    map.addControl(map.my_drawControl);
    // fixme instantly enable 'edit' mode of layer
  });

  map.on('draw:editmove', function (e) {
    console.log('editmove');
    console.log(e);
    document.getElementById('_geometry_lon').value = e.layer._latlng.lng.toFixed(6);
    document.getElementById('_geometry_lat').value = e.layer._latlng.lat.toFixed(6);
  });

  map.my_editableLayers = editableLayers;
  map.my_drawControl = drawControl;
  map.my_placeMarker = placeMarker;
  map.getDrawControl = getDrawControl;

  map.updateMarkerFromForm = function () {
    var lat = document.getElementById('_geometry_lat').value;
    var lon = document.getElementById('_geometry_lon').value;
    console.log('new lat: ' + lat + ' lon: ' + lon);

    if (lat && lon) {
      var coords = L.latLng(lat, lon);
      map.my_current_marker.setLatLng(coords);
      map.panTo(coords);
    }
  };
  document.getElementById('_geometry_lat').onblur = map.updateMarkerFromForm;
  document.getElementById('_geometry_lon').onblur = map.updateMarkerFromForm;

  // console.log(map)

  console.log('initMap end');
  return map;
}

module.exports = initMap;
});

;require.register("lib/red_fetch.js", function(exports, require, module) {
'use strict';

/*
 * This library provides a 'fetch', where you can use fallback URIs, to build on redundant servers.
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL
 *
 * Give it an array of resources, that can be fetched from different urls.
 * Will try to fetch them in the provided order.
 * Execute success_function on the first successful fetch, and error_function only if all resources fail to fetch.
 */

/* This program is free software. It comes without any warranty, to
     * the extent permitted by applicable law. You can redistribute it
     * and/or modify it under the terms of the Do What The Fuck You Want
     * To Public License, Version 2, as published by Sam Hocevar. See
     * http://www.wtfpl.net/ for more details. */

/* new version of getting map data with promises

  taken from https://blog.hospodarets.com/fetch_in_action
*/

var processStatus = function processStatus(response) {
  // status "0" to handle local files fetching (e.g. Cordova/Phonegap etc.)
  if (response.status === 200 || response.status === 0) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

var parseJson = function parseJson(response) {
  return response.json();
};

/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
// It goes against Promise concept to not have external access to .resolve/.reject methods, but provides more flexibility
var getWrappedPromise = function getWrappedPromise() {
  var wrappedPromise = {};
  var promise = new Promise(function (resolve, reject) {
    wrappedPromise.resolve = resolve;
    wrappedPromise.reject = reject;
  });
  wrappedPromise.then = promise.then.bind(promise);
  wrappedPromise.catch = promise.catch.bind(promise);
  wrappedPromise.promise = promise; // e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods
  return wrappedPromise;
};

/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
var getWrappedFetch = function getWrappedFetch() {
  var wrappedPromise = getWrappedPromise();
  var args = Array.prototype.slice.call(arguments); // arguments to Array

  window.fetch.apply(null, args) // calling original fetch() method
  .then(function (response) {
    wrappedPromise.resolve(response);
  }, function (error) {
    wrappedPromise.reject(error);
  }).catch(function (error) {
    wrappedPromise.catch(error);
  });
  return wrappedPromise;
};

/**
 * Fetch JSON by url
 * @param { {
 *  url: {String},
 *  [cacheBusting]: {Boolean}
 * } } params
 * @returns {Promise}
*/var MAX_WAITING_TIME = 5000; // in ms

var getJSON = function getJSON(params) {
  var wrappedFetch = getWrappedFetch(params.cacheBusting ? params.url + '?' + new Date().getTime() : params.url, {
    method: 'get', // optional, "GET" is default value
    headers: {
      'Accept': 'application/json'
    }
  });

  var timeoutId = setTimeout(function () {
    wrappedFetch.reject(new Error('Load timeout for resource: ' + params.url)); // reject on timeout
  }, MAX_WAITING_TIME);

  return wrappedFetch.promise // getting clear promise from wrapped
  .then(function (response) {
    clearTimeout(timeoutId);
    return response;
  }).then(processStatus).then(parseJson);
};

function myGetJSON(url, successFunction, errorFunction) {
  var getJSONparams = { url: url, cacheBusting: true };

  getJSON(getJSONparams).then(function (data) {
    successFunction(data);
  }, function (error) {
    errorFunction(error);
  });
}

function redundantFetch(dataUrlArray, successFunction, errorFunction) {
  if (!(!!dataUrlArray && Array === dataUrlArray.constructor)) {
    console.error('redundantFetch: argument is no array');
    console.error(dataUrlArray);
    return false;
  }
  var currentUrl = dataUrlArray[0];
  if (typeof currentUrl !== 'string') {
    console.error('redundantFetch: url is no string');
    return false;
  }

  console.log('redundantFetch called, urls:');
  console.log(dataUrlArray);

  dataUrlArray.shift();

  var localErrorFunction;
  var localSuccessFunction;
  if (dataUrlArray.length == 0) {
    // last iteration
    localSuccessFunction = successFunction;
    localErrorFunction = errorFunction;
  } else {
    localSuccessFunction = successFunction;
    localErrorFunction = function localErrorFunction(error) {
      redundantFetch(dataUrlArray, successFunction, errorFunction);
    };
  }

  var getJSONparams = { url: currentUrl, cacheBusting: true };
  getJSON(getJSONparams).then(function (data) {
    localSuccessFunction(data);console.log('rfetch: success on ');console.log(data);
  }, function (error) {
    localErrorFunction(error);console.log('rfetch: fail on ');console.log(error);
  });
}

module.exports = redundantFetch;
});

;require.register("lib/taxonomy.js", function(exports, require, module) {
'use strict';

/*
 * This library handles taxonomy related stuff for the transformap editor
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

function getLangTaxURL(lang) {
  if (!lang) {
    console.error("setFilterLang: no lang given");
    return false;
  }

  var tax_query = 'prefix bd: <http://www.bigdata.com/rdf#> ' + 'prefix wikibase: <http://wikiba.se/ontology#> ' + 'prefix wdt: <http://base.transformap.co/prop/direct/>' + 'prefix wd: <http://base.transformap.co/entity/>' + 'SELECT ?item ?itemLabel ?instance_of ?subclass_of ?type_of_initiative_tag ?wikipedia ?description ' + 'WHERE {' + '?item wdt:P8* wd:Q8 .' + '?item wdt:P8 ?subclass_of .' + 'OPTIONAL { ?item wdt:P4 ?instance_of . }' + 'OPTIONAL { ?item wdt:P15 ?type_of_initiative_tag }' + 'OPTIONAL { ?item schema:description ?description FILTER(LANG(?description) = "' + lang + '") }' + 'OPTIONAL { ?wikipedia schema:about ?item . ?wikipedia schema:inLanguage "en"}' + 'SERVICE wikibase:label {bd:serviceParam wikibase:language "' + lang + '" }' + '}';

  return 'https://query.base.transformap.co/bigdata/namespace/transformap/sparql?query=' + encodeURIComponent(tax_query) + "&format=json";
}

module.exports = {
  getLangTaxURL: getLangTaxURL
};
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map