(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

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
    var hot = hmr && hmr.createHot(name);
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
    if (bundle && typeof bundle === 'object') {
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
var global = typeof window === 'undefined' ? this : window;
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
require.register("fixtures/fixtures.js", function(exports, require, module) {
"use strict";

module.exports = {
  listOfMediaFilesForPOI: [{
    "id": "d07d6ab3-4e3f-44ce-accc-b3efc96b3f04",
    "ipfs": "QmVXmy59f5QqKDGyhpHbRiGnba5SfHaooDPCWhd8Xtgwz2",
    "url": "https://ipfs.io/images/ipfs-illustration-history.svg",
    "mimetype": "image/jpeg",
    "name": "Chaotic connectome replacement image for the large image on the main screen",
    "description": "some description",
    "version_date": "2017-07-30T16:01:34+00:00"
  }, {
    "id": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
    "mimetype": "image/png",
    "name": "Transformap Base",
    "url": "https://base.transformap.co/images/transformap.png",
    "version_date": "2017-07-30T16:01:34+00:00"
  }],
  mediaFileMetadataBasic: {
    "name": "some title",
    "description": "some description",
    "mimetype": "image/png",
    "url": "https://base.transformap.co/images/transformap.png"
  },
  mediaFileMetadataComplete: {
    "id": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
    "name": "some title",
    "description": "some description",
    "mimetype": "image/png",
    "url": "https://base.transformap.co/images/transformap.png",
    "version_date": "2017-07-30T16:01:34+00:00"
  },
  mediaFileMetadataCompleteDeleted: {
    "id": "0a6afb5c-70b1-40f7-8f46-8dd7e0d94060",
    "name": "some title",
    "deleted": true,
    "description": "some description",
    "mimetype": "image/png",
    "url": "https://base.transformap.co/images/transformap.png",
    "version_date": "2017-07-30T16:01:34+00:00"
  },
  placeMetadata: {
    "type": "Feature",
    "properties": {
      "name": "Bulgarian Food Bank",
      "addr:country": "BG",
      "addr:street": "бул. Васил Левски",
      "addr:housenumber": "106",
      "addr:postcode": "1000",
      "addr:city": "София",
      "POI_TYPE": "food bank",
      "amenity": "social_facility",
      "description:bg": "Организацията работи като свързващо звено между хранителната индустрия и социалните организации, за да увеличи многократно достъпа до хранително подпомагане в България. Тя създава системи за сигурност и контрол на храните, които постъпват като дарения.",
      "website": "http://bgfoodbank.org",
      "contact:email": "contact@bgfoodbank.org",
      "organic": "no",
      "fair-trade": "no",
      "regional": "yes",
      "free_keywords": "food bank;food waste",
      "SSEDAS_PARTNER": "BILS",
      "description": "The organisation acts as an interface between the food industry and social welfare organisations to increase access to food aid in Bulgaria. It sets up routines for guaranteeing that donated food is safe and properly managed.",
      "type_of_initiative": "foodbank; recycling_foodwaste",
      "contact:phone": "+3592 953 4100",
      "social_facility": "food_bank",
      "media_files": ["6abf3336-4441-458f-a24f-ed76f7f53533"]
    },
    "geometry": {
      "type": "Point",
      "coordinates": [23.33513259888, 42.69809702239]
    },
    "_id": "2c10b95ea433712f0b06a3f7d310e7d5"
  },
  listOfMediaFileVersions: [{
    "id": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "other version of the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "active": true,
    "url": "https://base.transformap.co/images/transformap.png",
    "author": "alex"
  }, {
    "id": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another version",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png",
    "author": "jenny"
  }],
  listOfMediaFileVersionsUpdate: [{
    "name": "other version of the same file",
    "description": "a new description for the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }, {
    "id": "497123c0-f9d8-4e6c-acff-76ec9efcb265",
    "name": "a previous version of the same file",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }, {
    "id": "c29c8d11-ec27-4fe1-9a23-dd10a3b37e11",
    "name": "yet another previous version",
    "version_date": "2017-07-30T16:01:34+00:00",
    "mimetype": "image.png",
    "url": "https://base.transformap.co/images/transformap.png"
  }],
  user: {
    "name": "Joe",
    "email": "joe@domain.com"
  }
};
});

require.register("fixtures/intercept_ajax.js", function(exports, require, module) {
"use strict";

var fixtures = require('./fixtures.js');

xhook.after(function (request, response) {

  if (request.method === "GET") {

    // /place/{uuid}
    if (request.url.match(".*?/place/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.placeMetadata);
    }

    // /place/{uuid}/media
    if (request.url.match(".*?/place/(.*)/media")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.listOfMediaFilesForPOI);
    }

    // /media/{uuid}
    if (request.url.match(".*?/media/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /media/{uuid}/versions
    if (request.url.match(".*?/media/(.*)/versions")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.listOfMediaFileVersions);
    }

    // /auth/
    if (request.url.match(".*?/auth/")) {
      response.status = 200;
      utils.setCookie("connect.sid", "123456789");
    }

    // /users/{userId}
    if (request.url.match(".*?/users/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.user);
    }
  } else if (request.method === "POST") {

    // /media
    if (request.url.match(".*?/media/")) {
      response.status = 201;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /media
    if (request.url.match(".*?/media/(.*)/versions")) {
      response.status = 201;
      response.text = JSON.stringify(fixtures.listOfMediaFileVersionsUpdate);
    }

    // /place
    if (request.url.match(".*?/place/")) {
      //TBD
    }
  } else if (request.method === "PUT") {

    // /media/{uuid}
    if (request.url.match(".*?/media/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.mediaFileMetadataComplete);
    }

    // /place/{uuid}
    if (request.url.match(".*?/place/(.*)")) {
      response.status = 200;
      //TBD
    }

    // /users/{userId}
    if (request.url.match(".*?/users/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.user);
    }
  } else if (request.method === "DELETE") {

    // /place/{uuid}
    if (request.url.match(".*?/place/(.*)")) {
      response.status = 200;
      //TBD
    }

    // /media/{uuid}
    if (request.url.match(".*?/place/(.*)/media/(.*)")) {
      response.status = 200;
      response.text = JSON.stringify(fixtures.placeMetadata);
    }

    // /auth/{token}
    if (request.url.match(".*?/auth/(.*)")) {
      response.status = 200;
    }
  }
});
});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var editor = require('lib/editor');

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  editor();
  console.log('Initialized app');
});
});

;require.register("lib/auth_api.js", function(exports, require, module) {
'use strict';

/*
 * This library handles calls to the authorization RP api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

var Cookies = require("js-cookie");

var utils = require('./utils.js');

var endpoint = utils.baseUrl;

/* returns the API's endpoint */
function getAuthEndpoint() {
  return endpoint + '/auth/';
}

function getLogoutEndpoint() {
  return endpoint + '/logout/';
}

/* taken "a bit" of inspiration from https://github.com/hackmdio/hackmd/blob/master/public/js/lib/common/login.js#L47 */

var checkAuth = false;
var profile = null;
var lastLoginState = getLoginState();
var lastUserId = getUserId();
var loginStateChangeEvent = null;

function setloginStateChangeEvent(func) {
  loginStateChangeEvent = func;
}

function resetCheckAuth() {
  checkAuth = false;
}

function setLoginState(bool, id) {
  Cookies.set('loginstate', bool, {
    expires: 365
  });
  if (id) {
    Cookies.set('userid', id, {
      expires: 365
    });
  } else {
    Cookies.remove('userid');
  }
  lastLoginState = bool;
  lastUserId = id;
  checkLoginStateChanged();
}

function checkLoginStateChanged() {
  if (getLoginState() !== lastLoginState || getUserId() !== lastUserId) {
    if (loginStateChangeEvent) setTimeout(loginStateChangeEvent, 100);
    return true;
  } else {
    return false;
  }
}

function getLoginState() {
  var state = Cookies.get('loginstate');
  return state === 'true' || state === true;
}

function getUserId() {
  return Cookies.get('userid');
}

function clearLoginState() {
  Cookies.remove('loginstate');
}

function checkIfAuth(yesCallback, noCallback) {
  var cookieLoginState = getLoginState();
  if (checkLoginStateChanged()) checkAuth = false;
  if (!checkAuth || typeof cookieLoginState === 'undefined') {
    $.get({
      url: utils.baseUrl + '/user',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function (data) {
      if (data && typeof data._id !== 'undefined') {
        profile = data;
        yesCallback(profile);
        setLoginState(true, data._id);
      } else {
        noCallback();
        setLoginState(false);
      }
    }).fail(function () {
      noCallback();
    }).always(function () {
      checkAuth = true;
    });
  } else if (cookieLoginState) {
    yesCallback(profile);
  } else {
    noCallback();
  }
}

/*
 * Decouples the auth token from the current session
 * Params:
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function logout(authToken, callback) {
  if (!authToken) {
    console.log('logout: no authToken given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', endpoint);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  checkIfAuth: checkIfAuth,
  clearLoginState: clearLoginState,
  getUserId: getUserId,
  getLoginState: getLoginState,
  checkLoginStateChanged: checkLoginStateChanged,
  setLoginState: setLoginState,
  resetCheckAuth: resetCheckAuth,
  setloginStateChangeEvent: setloginStateChangeEvent,
  getAuthEndpoint: getAuthEndpoint,
  getLogoutEndpoint: getLogoutEndpoint,
  logout: logout
};
});

require.register("lib/data_api.js", function(exports, require, module) {
'use strict';

/*
 * This library handles calls to the transformap data api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

var utils = require('./utils.js');

var endpoint = utils.baseUrl + '/place/';

/* returns the API's endpoint */
function getDataEndpoint() {
  return endpoint;
}

/*
 * Creates (if uuid is not set) or updates (if it is) a POI with the data passed as parameter
 * Params:
 *  - uuid: POI's uuid, null if does not exist
 *  - data: to create or update POI
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function createOrUpdatePOI(uuid, data, callback) {
  if (!data) {
    console.error('updateOrCreatePOI: no data given');
    return false;
  }

  var xhr = utils.createCORSRequest(uuid ? 'PUT' : 'POST', endpoint + uuid);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var retJson = JSON.parse(xhr.responseText);
        console.log(retJson);
        if (retJson.id) {
          callback(retJson.id);
          alert('Save successful');
        } else {
          alert('Error: something wrent wrong on saving: ' + JSON.stringify(retJson));
        }
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Gets the metadata of a certain POI
 * Params:
 *  - uuid: POI's uuid
 *  - data: to create or update POI
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function getPOI(uuid, callback) {
  if (!uuid) {
    console.error('getPOI: no uuid given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getDataEndpoint() + uuid);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Deletes the POI corresponding to the uuid passed as parameter
 * Params:
 *  - uuid: POI's uuid, null if does not exist
 *  - callback: function to be called upon success. Receives the uuid of the POI
 * Returns: false if invalid call
*/
function deletePOI(uuid, callback) {
  if (!uuid) {
    console.error('deletePOI: no uuid given');
    return false;
  }

  var xhr = utils.createCORSRequest('DELETE', endpoint + uuid);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(uuid);
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  getDataEndpoint: getDataEndpoint,
  createOrUpdatePOI: createOrUpdatePOI,
  getPOI: getPOI,
  deletePOI: deletePOI
};
});

require.register("lib/editor.js", function(exports, require, module) {
'use strict';

/* global alert, L, XMLHttpRequest, XDomainRequest */ // used by standardjs (linter)

var utils = require('./utils.js');
var redFetch = require('./red_fetch.js');
var translations = require('./translations.js');
var dataApi = require('./data_api.js');
var authApi = require('./auth_api.js');
var userApi = require('./user_api.js');
var ui = require('./ui.js');
var map = require('./map.js');

window.translations = translations;
var taxonomyTranslationsUrls = ['https://base.transformap.co/wiki/Special:EntityData/Q5.json', 'https://raw.githubusercontent.com/TransforMap/transformap-viewer/Q5-fallback.json'];

if ('false' === "true") {
  console.log("integrating xhook and mocking ajax calls");
  require('xhook');
  require('../fixtures/intercept_ajax.js');
}

module.exports = function () {
  console.log('editor initialize start');

  var place = utils.getUrlVars()['place'];

  var startLang = translations.selectAllowedLang(translations.current_lang);
  console.log('lang on start: ' + startLang);
  console.log(translations.supported_languages);

  document.getElementById('plus').onclick = ui.addFreeTagsRow;

  if (place) {
    dataApi.getPOI(place, ui.fillForm);
  }

  ui.addLanguageSwitcher();
  translations.fetchAndSetNewTranslation = translations.fetchAndSetNewTranslation;

  redFetch(taxonomyTranslationsUrls, translations.initializeTranslatedTOIs, function (error) {
    console.error('none of the lang init data urls available');
  });

  document.getElementById('save').onclick = ui.clickSubmit;
  document.getElementById('delete').onclick = ui.clickDelete;
  document.getElementById('coordsearch').onclick = ui.clickSearch;
  document.getElementById('newmedia').onclick = ui.clickNewMedia;
  document.getElementById('loginbutton').onclick = ui.toggleLoginButton;
  document.onkeypress = ui.stopRKey;
  document.getElementById('mediacancel').onclick = ui.clickMediaCancel;
  document.getElementById('mediasave').onclick = ui.clickMediaSave;

  ui.toggleLoginButton();

  map.initMap();

  console.log('editor initialize end');
};
});

require.register("lib/map.js", function(exports, require, module) {
'use strict';

var L = require('leaflet');
var L_Hash = require('leaflet-hash');
var L_Draw = require('leaflet-draw');

var map;

var editableLayers;
var drawControl;
var placeMarker;
var popupText = 'Press the edit button to move me. <img style="width:30px;height:30px;background-position:-150px -1px;background-image:url(\'images/spritesheet.svg\');background-size: 270px 30px;"> <br><br> Find it on the bottom left corner of the map.';
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

function getMap() {
  return map;
}

function initMap() {
  console.log('initMap start');

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
    center: center || new L.LatLng(28.6, 9),
    zoom: zoom || 2,
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
      layer.bindPopup(popupText);
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

  map.on('moveend', function (e) {
    var centre = map.getCenter();
    var targetlocation = '#' + map.getZoom() + '/' + centre.lat + '/' + centre.lng;

    var maplink = document.getElementById('gotomap');
    var href = maplink.getAttribute('href');
    var splitstr = href.split('#');
    href = maplink.getAttribute('href').split('#')[0] + targetlocation;
    maplink.setAttribute('href', href);

    var newlink = document.getElementById('newbutton');
    newlink.setAttribute('href', './' + targetlocation);
  });

  map.my_editableLayers = editableLayers;
  // map.my_drawControl = drawControl
  map.my_placeMarker = placeMarker;
  map.getDrawControl = getDrawControl;

  map.updateMarkerFromForm = function () {
    var lat = document.getElementById('_geometry_lat').value;
    var lon = document.getElementById('_geometry_lon').value;
    console.log('new lat: ' + lat + ' lon: ' + lon);

    if (lat && lon) {
      var coords = L.latLng(lat, lon);
      if (map.my_current_marker) {
        map.my_current_marker.setLatLng(coords);
      } else {
        map.my_current_marker = new L.marker([lat, lon], { icon: new map.my_placeMarker() });
        map.my_current_marker.bindPopup(popupText);
        map.my_editableLayers.addLayer(map.my_current_marker);
        map.removeControl(map.my_drawControl);
        map.my_drawControl = getDrawControl(false);
        map.addControl(map.my_drawControl);
      }

      map.panTo(coords);
    } else {
      // delete marker
      console.log('no coords, remove marker');
      map.my_current_marker.remove();
      delete map.my_current_marker;
      map.removeControl(map.my_drawControl);
      map.my_drawControl = getDrawControl(true); // allow "add marker" again
      map.addControl(map.my_drawControl);
    }
  };
  document.getElementById('_geometry_lat').onblur = map.updateMarkerFromForm;
  document.getElementById('_geometry_lon').onblur = map.updateMarkerFromForm;

  // console.log(map)

  console.log('initMap end');
  return map;
}

module.exports = {
  getMap: getMap,
  initMap: initMap
};
});

require.register("lib/mms_api.js", function(exports, require, module) {
'use strict';

/*
 * This library handles calls to the transformap MMS api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

var utils = require('./utils.js');
var RequestBody = require('maltypart').RequestBody;
var endpoint = utils.baseUrl + '/media/';

/* returns the API's endpoint */
function getMMSEndpoint() {
  return endpoint;
}

/*
 * Creates a new media file for a certain POI
 * Params:
 *  - data: the metadata to create the media file with
 *  - blob: the blob to upload along the metadata
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function createNewMediaFile(data, blob, callback) {

  if (!data) {
    console.error('createNewMediaFile: no data given');
    return false;
  }

  if (!blob) {
    console.error('createNewMediaFile: no blob given');
    return false;
  }

  var request = new RequestBody();

  if (data) {
    request.append(data);
  }

  if (blob) {
    request.append(blob.name, {
      contentType: blob.type,
      data: blob.contents
    });
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint());
  xhr.setRequestHeader('Content-Type', request.getContentType());
  xhr.withCredentials = true;
  xhr.send(request.getData());

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Retrieves the metadata of a particular media file
 * Params:
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMetadataForMediaFile(mediaId, callback) {
  if (!mediaId) {
    console.error('retrieveMetadataForMediaFile: no mediaId given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getMMSEndpoint() + mediaId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Creates a new media file for a certain POI
 * Params:
 *  - data: the metadata to create the media file with
 *  - blob: the blob to upload along the metadata
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function updateMediaFile(data, blob, callback) {

  if (!data) {
    console.error('updateMediaFile: no data given');
    return false;
  }

  var request = new RequestBody();

  if (data) {
    request.append(data);
  }

  if (blob) {
    request.append(blob.name, {
      contentType: blob.type,
      data: blob.content
    });
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint());
  xhr.setRequestHeader('Content-Type', request.getContentType());
  xhr.withCredentials = true;
  xhr.send(request.getData());

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Returns an array with all the versions of a certain media file
 * Params:
 *  - mediaId: Media file's uuid
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveMediaFileVersions(mediaId, callback) {
  if (!mediaId) {
    console.error('retrieveMediaFileVersions: no mediaId given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', getMMSEndpoint() + mediaId + '/versions');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Sets a version as currently active
 * Params:
 *  - mediaId: Media file's uuid
 *  - versionId: The uuid of the version to set as currently active
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function setActiveMediaFileVersion(mediaId, versionId, callback) {
  if (!mediaId) {
    console.error('setActiveMediaFileVersion: no mediaId given');
    return false;
  }
  if (!versionId) {
    console.error('setActiveMediaFileVersion: no versionId given');
    return false;
  }

  var xhr = utils.createCORSRequest('POST', getMMSEndpoint() + mediaId + '/versions/' + versionId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  getMMSEndpoint: getMMSEndpoint,
  createNewMediaFile: createNewMediaFile,
  updateMediaFile: updateMediaFile,
  retrieveMetadataForMediaFile: retrieveMetadataForMediaFile,
  retrieveMediaFileVersions: retrieveMediaFileVersions,
  setActiveMediaFileVersion: setActiveMediaFileVersion
};
});

require.register("lib/red_fetch.js", function(exports, require, module) {
'use strict';

/*
 * This library provides a 'fetch', where you can use fallback URIs, to build on redundant servers.
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL
 *
 * Give it an array of resources, that can be fetched from different urls.
 * Will try to fetch them in the provided order.
 * Execute successFunction on the first successful fetch, and errorFunction only if all resources fail to fetch.
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
  // status '0' to handle local files fetching (e.g. Cordova/Phonegap etc.)
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
    method: 'get', // optional, 'GET' is default value
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
  var getJSONparams = {
    url: url, cacheBusting: true
  };

  getJSON(getJSONparams).then(function (data) {
    successFunction(data);
  }, function (error) {
    errorFunction(error);
  });
}

function redundantFetch(dataUrlArray, successFunction, errorFunction, params) {
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
      redundantFetch(dataUrlArray, successFunction, errorFunction, params);
    };
  }

  var getJSONparams = {
    url: currentUrl,
    cacheBusting: !(params && params.cacheBusting === false)
  };
  getJSON(getJSONparams).then(function (data) {
    localSuccessFunction(data);console.log('rfetch: success on ');console.log(data);
  }, function (error) {
    localErrorFunction(error);console.log('rfetch: fail on ');console.log(error);
  });
}

module.exports = redundantFetch;
});

require.register("lib/taxonomy.js", function(exports, require, module) {
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

/* takes the language (string:"iso"), and the wished taxonomy (string: "Qnn") */
function getLangTaxURL(lang, taxonomy) {
  if (!lang) {
    console.error('setFilterLang: no lang given');
    return false;
  }

  if (!taxonomy) {
    taxonomy = 'Q8';
  }

  var tax_query = 'prefix bd: <http://www.bigdata.com/rdf#> ' + 'prefix wikibase: <http://wikiba.se/ontology#> ' + 'prefix wdt: <https://base.transformap.co/prop/direct/>' + 'prefix wd: <https://base.transformap.co/entity/>' + 'SELECT ?item ?itemLabel ?instance_of ?subclass_of ?type_of_initiative_tag ?interaction_tag ?needs_tag ?identity_tag ?wikipedia ?description ' + 'WHERE {' + '?item wdt:P8* wd:' + taxonomy + ' .' + '?item wdt:P8 ?subclass_of .' + 'OPTIONAL { ?item wdt:P4 ?instance_of . }' + 'OPTIONAL { ?item wdt:P15 ?type_of_initiative_tag }' + 'OPTIONAL { ?item wdt:P16 ?interaction_tag }' + 'OPTIONAL { ?item wdt:P17 ?needs_tag }' + 'OPTIONAL { ?item wdt:P18 ?identity_tag }' + 'OPTIONAL { ?item schema:description ?description FILTER(LANG(?description) = "' + lang + '") }' + 'OPTIONAL { ?wikipedia schema:about ?item . ?wikipedia schema:inLanguage "en"}' + 'SERVICE wikibase:label {bd:serviceParam wikibase:language "' + lang + '" }' + '}';

  return 'https://query.base.transformap.co/bigdata/namespace/transformap/sparql?query=' + encodeURIComponent(tax_query) + '&format=json';
}

module.exports = {
  getLangTaxURL: getLangTaxURL
};
});

require.register("lib/translations.js", function(exports, require, module) {
'use strict';

var redFetch = require('./red_fetch.js');
var taxonomy = require('./taxonomy.js');
var ui = require('./ui.js');

// mostly taken from https://github.com/TransforMap/transformap-viewer/blob/gh-pages/scripts/map.js

function getLangs() {
  var language = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language || window.navigator.userLanguage;

  if (typeof language === 'string') {
    language = [language];
  }

  // we need to have the following languages:
  // browserlang
  // a short one (de instead of de-AT) if not present
  // en as fallback if not present

  for (var i = 0; i < language.length; i++) {
    if (language[i].match(/-/)) {
      var short_lang = language[i].match(/^([a-zA-Z]*)-/)[1];
      if (language.indexOf(short_lang) == -1) {
        language.push(short_lang);
        continue;
      }
    }
  }

  if (language.indexOf('en') == -1) {
    language.push('en');
  };

  console.log(language);
  return language;
}

function setFallbackLangs() {
  fallback_langs = [];
  if (current_lang != 'en') {
    for (var i = 0; i < browser_languages.length; i++) {
      var abbr = browser_languages[i];
      if (current_lang != abbr) {
        fallback_langs.push(abbr);
      }
    }
  }
  console.log('new fallback langs: ' + fallback_langs.join(',') + '.');
}

function resetLang() {
  current_lang = 'en';
  for (var i = 0; i < browser_languages.length; i++) {
    var abbr = browser_languages[i];
    if (abbr_langnames[abbr]) {
      current_lang = abbr;
      break;
    }
  }
  switchToLang(current_lang);
}

/* get languages for UI from our Wikibase, and pick languages that are translated there */

var supported_languages = [],
    langnames = [],
    abbr_langnames = {},
    langnames_abbr = {};

function initializeLanguageSwitcher(returned_data) {
  var lang;
  for (lang in returned_data.entities.Q5.labels) {
    // Q5 is arbitrary. Choose one that gets translated for sure.
    supported_languages.push(lang);
  }
  var langstr = supported_languages.join('|');

  var langstr_query = 'SELECT ?lang ?langLabel ?abbr ' + 'WHERE' + '{' + '?lang wdt:P218 ?abbr;' + 'FILTER regex (?abbr, "^(' + langstr + ')$").' + 'SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' + '}';

  langstr_query = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=' + encodeURIComponent(langstr_query) + '&format=json';
  $.getJSON(langstr_query, function (langstrings) {
    langstrings.results.bindings.forEach(function (item) {
      abbr_langnames[item.abbr.value] = item.langLabel.value;
      langnames_abbr[item.langLabel.value] = item.abbr.value;
      langnames.push(item.langLabel.value);
    });
    langnames.sort();

    resetLang();
    setFallbackLangs();

    langnames.forEach(function (item) {
      var langcode = langnames_abbr[item];
      var is_default = langcode == current_lang ? ' class=default' : '';
      console.log("adding lang '" + langcode + "' (" + item + ')');
      $('#languageSelector ul').append('<li targetlang=' + langcode + is_default + " onClick='window.translations.switchToLang(\"" + langcode + "\");'>" + item + '</li>');
    });
  });
}

function fetchAndSetNewTranslation(lang) {
  redFetch([taxonomy.getLangTaxURL(lang, 'Q8'), 'https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/taxonomy-backup/susy/taxonomy.' + lang + '.json'], ui.fillTOIs, function (error) {
    console.error('none of the taxonomy data urls available');
  }, { cacheBusting: false });
  redFetch([taxonomy.getLangTaxURL(lang, 'Q4'), 'https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/taxonomy-backup/susy/taxonomy.' + lang + '.json'], ui.fillTransforMapTax, function (error) {
    console.error('none of the taxonomy data urls available');
  }, { cacheBusting: false });
}

function initializeTranslatedTOIs(Q5data) {
  translations.initializeLanguageSwitcher(Q5data);

  var nowPossibleLang = translations.selectAllowedLang(translations.current_lang);
  translations.current_lang = nowPossibleLang;
  fetchAndSetNewTranslation(nowPossibleLang);
}

function switchToLang(lang) {
  $('#languageSelector li.default').removeClass('default');
  $('#languageSelector li[targetlang=' + lang + ']').addClass('default');
  current_lang = lang;
  window.translations.current_lang = lang;
  window.translations.fetchAndSetNewTranslation(lang);
  setFallbackLangs();
  /*
    //updateTranslatedTexts();
  
    if(! dictionary[lang]) {
      var dict_uri = "https://raw.githubusercontent.com/TransforMap/transformap-viewer-translations/master/json/"+lang+".json";
  
      $.ajax({
        url: dict_uri,
        context: { lang: current_lang },
        success: function(returned_data) {
          var trans_jsonobj = JSON.parse(returned_data);
  
          if(! dictionary[this.lang])
            dictionary[this.lang] = {};
          for (item in trans_jsonobj) {
            var index = reverse_dic[item];
            dictionary[this.lang][index] = trans_jsonobj[item];
          }
  
          console.log("successfully fetched " + this.lang);
          //updateTranslatedTexts();
  
        }
      });
  
    }
  
    // As rebuilding the filters does not yet support advanced mode by default,
    // we switch to simple mode, as language switching is a very rare case.
    if(getFilterMode() == "advanced")
      toggleAdvancedFilterMode();
  
    resetFilter();
    setFilterLang(lang);
  */
  console.log('new lang:' + lang);
}

// if wishedLang is in supported, OK
// shorten wishedLang and see if in supported
// take fallback
function selectAllowedLang(wishedLang) {
  console.log('selectAllowedLang(' + wishedLang + ') called');
  if (wishedLang) {
    if (supported_languages.indexOf(wishedLang) != -1) {
      current_lang = wishedLang;
      return current_lang;
    }
    console.log('not in supported, try shorten');
    var matches = wishedLang.match(/^([a-zA-Z]*)-/);
    if (matches && matches[1]) {
      var short_lang = matches[1];
      console.log('short: ' + short_lang);
      if (short_lang) {
        if (supported_languages.indexOf(short_lang) != -1) {
          current_lang = short_lang;
          console.log('current_lang set to ' + short_lang);
          return current_lang;
        }
      }
    }
  }
  setFallbackLangs();
  if (fallback_langs[0]) {
    if (supported_languages.indexOf(fallback_langs[0]) != -1) {
      current_lang = fallback_langs[0];
      return current_lang;
    }
  }
  current_lang = 'en';
  return current_lang;
}

var browser_languages = getLangs(),
    current_lang = browser_languages[0],
    fallback_langs = [];

module.exports = {
  getLangs: getLangs,
  initializeLanguageSwitcher: initializeLanguageSwitcher,
  initializeTranslatedTOIs: initializeTranslatedTOIs,
  supported_languages: supported_languages,
  browser_languages: browser_languages,
  current_lang: current_lang,
  switchToLang: switchToLang,
  selectAllowedLang: selectAllowedLang,
  fetchAndSetNewTranslation: fetchAndSetNewTranslation
};
});

require.register("lib/ui.js", function(exports, require, module) {
'use strict';

var dataApi = require('./data_api.js');
var mmsApi = require('./mms_api.js');
var authApi = require('./auth_api.js');
var userApi = require('./user_api.js');
var map = require('./map.js');
var utils = require('./utils.js');
var redFetch = require('./red_fetch.js');

var currentData = {};

function fillForm(placeData) {

  currentData = placeData;

  if (currentData._deleted) {
    document.getElementById('deleted').style.display = 'block';
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

  retrieveAndRenderMediaFilesForPOI(currentData);

  if (currentData.geometry && currentData.geometry.coordinates) {
    var lon = currentData.geometry.coordinates[0];
    var lat = currentData.geometry.coordinates[1];
    if (lat === undefined || lon === undefined) {
      console.error('lat or lon empty');
      return;
    }

    document.getElementById('_geometry_lon').value = lon;
    document.getElementById('_geometry_lat').value = lat;

    var mapInstance = map.getMap();
    mapInstance.my_current_marker = new L.marker([lat, lon], {
      icon: new mapInstance.my_placeMarker()
    });
    mapInstance.my_editableLayers.addLayer(mapInstance.my_current_marker);

    mapInstance.my_drawControl = mapInstance.getDrawControl(false);
    mapInstance.addControl(mapInstance.my_drawControl);

    mapInstance.panTo(new L.LatLng(lat, lon));
  } else {
    // allow adding a marker
    mapInstance.my_drawControl = mapInstance.getDrawControl(true);
    mapInstance.addControl(mapInstance.my_drawControl);
  }

  if (currentData.properties && currentData.properties._id) {
    document.getElementById('_id').value = currentData.properties._id;
    $('#transformapapilink').attr('href', dataApi.getDataEndpoint() + currentData.properties._id);
  } else if (currentData._id) {
    document.getElementById('_id').value = currentData._id;
    $('#transformapapilink').attr('href', dataApi.getDataEndpoint() + currentData._id);
  }

  if (currentData.properties.osm) {
    $('#osmlink').attr('href', currentData.properties.osm);
  }
}

function retrieveAndRenderMediaFilesForPOI(currentData) {
  $('#media').html("");
  if (currentData.properties.media_files) {
    var mediaFileIds = currentData.properties.media_files;
    $('.relatedMediaTitle').text('Related media files' + ' (' + mediaFileIds.length + ')');
    for (var i = 0; i < mediaFileIds.length; i++) {
      var mediaFileId = mediaFileIds[i];
      mmsApi.retrieveMetadataForMediaFile(mediaFileId, function (mediaFile) {

        var row = $('<div class="row mediaFile ' + mediaFile.mediaId + '"></div>');

        var info = $('<div class="row mediaInfo"></div>');
        if (mediaFile.name) {
          info.append("<b>" + mediaFile.name + "</b>");
        }
        if (mediaFile.description) {
          info.append("<p>" + mediaFile.description + "</p>");
        }

        var options = $('<div class="row"></div>');

        var removeButton = $('<a class="mediaOption remove">Remove</h4>');
        removeButton.on('click', { metadata: mediaFile, currentData: currentData }, function (evt) {
          var data = evt.data;
          console.log("removeButton clicked for mediaFile with id:" + data.metadata.mediaId);
          if (confirm("Are you sure you want to delete this media file?")) {
            dataAPI.removeMediaFileFromPOI(data.currentData._id, data.metadata.mediaId, function () {
              $('.' + data.metadata.mediaId).remove();
              retrieveAndRenderMediaFilesForPOI(currentData);
            });
          }
        });

        var editButton = $('<a class="mediaOption edit" data-toggle="modal" data-target="#mediaFileDialog" data-id="' + mediaFile.mediaId + '">Edit</h4>');
        editButton.on('click', { metadata: mediaFile, currentData: currentData }, function (evt) {
          var data = evt.data;

          utils.resetCurrentBlob();

          console.log("editButton clicked for mediaFile with id:" + data.metadata.id);
          $('#mediaFileDialogContent').find('.createOrUpdate').text("update");
          $('#mediaFileDialogContent').find('.mediaId').text(data.metadata.id);
          $('#mediaFileDialogContent').find('.name').val(data.metadata.name);
          $('#mediaFileDialogContent').find('.description').val(data.metadata.description);
          $('#mediaFileDialogContent').find('img').attr("src", data.metadata.url);
          $('#mediaFileDialogContent').find('img').show();
          $('#mediaFileDialogContent').find('.metadata').text(JSON.stringify(data.metadata));

          document.getElementById('mediaUpload').addEventListener('change', utils.handleFileSelect, false);

          mmsApi.retrieveMediaFileVersions(data.metadata.id, function (versionsArray) {
            if (versionsArray.length > 0) {
              var versionsList = $('<ul class="row"></ul>');
              for (var i = 0; i < versionsArray.length; i++) {
                var version = versionsArray[i];
                var versionInput = $('<li data-id="' + version.id + '" class="versionItem"><b>' + version.version_date + '</b> - ' + version.name + ' - ' + version.author + '</li></br>');
                if (version.active) {
                  versionInput.append(' ').append('<b>[Active]</b>');
                } else {
                  var activateLink = $('<a data-id="' + version.id + '" href="#">Activate</a>');
                  activateLink.on("click", { version: version }, function (evt) {
                    var versionData = evt.data;
                    mmsApi.setActiveMediaFileVersion(data.metadata.id, versionData.version.id, function () {
                      $('#mediaFileDialog').modal('toggle');
                    });
                  });
                  versionInput.append(' ').append(activateLink);
                }
                versionsList.append(versionInput);
              }
              $('.mediaVersions').html(versionsList);
            }
          });
        });

        options.append(removeButton);
        options.append(editButton);
        info.append(options);

        var imageUrl = 'https://s3.amazonaws.com/FringeBucket/image_placeholder.png';
        if (mediaFile.mimetype === "image/png" || mediaFile.mimetype === "image/jpeg") {
          imageUrl = mediaFile.url;
        }
        row.append('<img class="mediaThumb" src="' + imageUrl + '"/>');
        row.append(info);

        $('#media').append(row).append('<hr>');
      });
    }
  }
}

function addLanguageSwitcher() {
  // add languageswitcher
  $('#menu').append('<div id=languageSelector onClick="$(\'#languageSelector ul\').toggleClass(\'open\');">' + '<span lang=en>Choose Language:</span>' + '<ul></ul>' + '</div>');
}

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
  var bootstrapClass = document.createAttribute('class');
  bootstrapClass.value = 'form-control';
  newKey.setAttributeNode(bootstrapClass);
  var bootstrapClass = document.createAttribute('class');
  bootstrapClass.value = 'form-control';
  var newValue = document.createElement('input');
  newValue.setAttributeNode(bootstrapClass);
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

function createToiArray(toiString) {
  if (typeof toiString !== 'string') {
    return [];
  }
  var toiArray = toiString.split(';');
  for (var i = 0; i < toiArray.length; i++) {
    toiArray[i] = toiArray[i].trim();
  }
  return toiArray;
}

function fillTransforMapTax(data) {
  console.log('fillTransforMapTax called');

  var dataArray = data.results.bindings;
  var current_lang = dataArray[0].itemLabel['xml:lang'];

  var needs = [];
  var interactions = [];
  var identities = [];

  dataArray.forEach(function (entry) {
    if (!entry.subclass_of) {
      return;
    }
    var label = {};
    label[current_lang] = entry.itemLabel.value;
    var currentObject = {
      item: entry.item.value,
      label: label
    };
    if (entry.subclass_of.value == 'https://base.transformap.co/entity/Q146') {
      currentObject['needs_tag'] = entry.needs_tag.value;
      needs.push(currentObject);
    } else if (entry.subclass_of.value == 'https://base.transformap.co/entity/Q150') {
      currentObject['interaction_tag'] = entry.interaction_tag.value;
      interactions.push(currentObject);
    } else if (entry.subclass_of.value == 'https://base.transformap.co/entity/Q176') {
      currentObject['identity_tag'] = entry.identity_tag.value;
      identities.push(currentObject);
    }
  });

  // needs
  $('#_key_provides').empty();
  needs.forEach(function (entry) {
    var newOption = $('<option>');
    newOption.attr('value', entry.needs_tag);

    if (currentData.properties && currentData.properties.provides) {
      var needs_array = createToiArray(currentData.properties.provides);
      needs_array.forEach(function (need) {
        if (need === entry.needs_tag) {
          newOption.attr('selected', 'selected');
        }
      });
    }
    newOption.append(entry.label[current_lang]);
    $('#_key_provides').append(newOption);
    $('#_key_provides').selectpicker('refresh');
  });

  // interaction
  $('#_key_interaction').empty();
  interactions.forEach(function (entry) {
    var newOption = $('<option>');
    newOption.attr('value', entry.interaction_tag);

    if (currentData.properties && currentData.properties.interaction) {
      var interactions_array = createToiArray(currentData.properties.interaction);
      interactions_array.forEach(function (interact) {
        if (interact === entry.interaction_tag) {
          newOption.attr('selected', 'selected');
        }
      });
    }
    newOption.append(entry.label[current_lang]);
    $('#_key_interaction').append(newOption);
    $('#_key_interaction').selectpicker('refresh');
  });

  // identity
  $('#_key_identity').empty();
  identities.forEach(function (entry) {
    var newOption = $('<option>');
    newOption.attr('value', entry.identity_tag);

    if (currentData.properties && currentData.properties.identity) {
      var identity_array = createToiArray(currentData.properties.identity);
      identity_array.forEach(function (identity) {
        if (identity === entry.identity_tag) {
          newOption.attr('selected', 'selected');
        }
      });
    }
    newOption.append(entry.label[current_lang]);
    $('#_key_identity').append(newOption);
    $('#_key_identity').selectpicker('refresh');
  });
}

function fillTOIs(data) {
  $('#_key_type_of_initiative').empty();

  var typeOfInintiatives = [];
  var toiHashtable = {};

  var toiSelect = document.getElementById('_key_type_of_initiative');
  var dataArray = data.results.bindings;
  var current_lang = dataArray[0].itemLabel['xml:lang'];
  dataArray.forEach(function (entry) {
    if (!entry.type_of_initiative_tag) {
      return;
    }
    if (toiHashtable[entry.type_of_initiative_tag.value]) {
      // filter out duplicates
      return;
    }
    var label = {};
    label[current_lang] = entry.itemLabel.value;

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
    if (a.item === 'https://base.transformap.co/entity/Q20') return 1;
    if (b.item === 'https://base.transformap.co/entity/Q20') return -1;

    // in toi list, 'other*' should be last
    if (a.type_of_initiative_tag && a.type_of_initiative_tag.match(/^other_/)) return 1;
    if (b.type_of_initiative_tag && b.type_of_initiative_tag.match(/^other_/)) return -1;

    if (a.label[current_lang] < b.label[current_lang]) {
      return -1;
    } else {
      return 1;
    }
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
        if (toi === entry.type_of_initiative_tag) {
          var newSelected = document.createAttribute('selected');
          newOption.setAttributeNode(newSelected);
        }
      });
    }

    var label = document.createTextNode(entry.label[current_lang]); // FIXME fallback langs
    newOption.appendChild(label);

    toiSelect.appendChild(newOption);
    $('#_key_type_of_initiative').selectpicker('refresh');
  });
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
  var freeTags = {
    keys: {}, values: {}
  };

  console.log(allInputs);

  for (var i = 0; i < allInputs.length; i++) {
    var element = allInputs[i];
    if (element.type !== 'text') {
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
        if (child.selected === true) {
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

  dataApi.createOrUpdatePOI(uuid, sendData, clickSubmitSuccess);

  document.getElementById('deleted').style.display = 'none';
}

function clickSubmitSuccess(uuid) {
  document.getElementById('_id').value = uuid;
  $('#transformapapilink').attr('href', dataApi.getDataEndpoint() + uuid);
  $('#osmlink').attr('href', $('#_key_osm').attr('value'));
}

function clickDelete() {
  var uuid = document.getElementById('_id').value;

  dataApi.deletePOI(uuid, clickDeleteSuccess);

  document.getElementById('deleted').style.display = 'block';
}

function clickDeleteSuccess(uuid) {
  console.log('Successfully deleted POI: ' + uuid);
}

function clickSearch() {
  var country = document.getElementById('_key_addr:country').value;
  var city = document.getElementById('_key_addr:city').value;
  // const postcode = document.getElementById('_key_addr:postcode').value // postcode not used in nominatim, decreases result quality
  var street = document.getElementById('_key_addr:street').value;
  var housenumber = document.getElementById('_key_addr:housenumber').value;

  var querystring = 'q=';
  if (street) {
    if (housenumber) {
      querystring += housenumber + '+';
    }
    querystring += street + ',';
  }
  if (city) {
    querystring += city + ',';
  }
  querystring += country;

  var query = '//nominatim.openstreetmap.org/search?' + querystring + '&format=json&limit=1&email=mapping@transformap.co';
  console.log(query);

  redFetch([query], function (successData) {
    console.log(successData);
    if (successData.length !== 1) {
      console.error('error in Nominatim return data: length != 1');
      alert('Sorry, Nothing found');
      return;
    }
    var result = successData[0];
    if (result.class === 'building' || result.class === 'amenity' || result.class === 'shop' || result.class === 'place' && result.type === 'house') {
      console.log('address found exactly');
      document.getElementById('_geometry_lon').value = result.lon;
      document.getElementById('_geometry_lat').value = result.lat;

      // trigger update of place marker
      document.getElementById('_geometry_lat').focus();
      document.getElementById('_geometry_lon').focus();
      map.getMap().setView(new L.LatLng(result.lat, result.lon), 18);
    } else {
      map.getMap().setView(new L.LatLng(result.lat, result.lon), 18);
      console.log('address not found exactly');
      setTimeout(function () {
        // wait for map to pan to location
        alert('Attention: The address was not found exactly, please place the marker manually!');
        document.getElementById('_geometry_lon').value = '';
        document.getElementById('_geometry_lat').value = '';
        document.getElementById('_geometry_lon').focus();
        document.getElementById('_geometry_lat').focus();
      }, 400);
    }
  }, function (error) {
    console.log(error);
    alert('Sorry, Address search did not work');
  });
}

function stopRKey(evt) {
  var evt = evt || event || null;
  var node = evt.target ? evt.target : evt.srcElement ? evt.srcElement : null;
  if (evt.keyCode == 13 && node.type == 'text') {
    return false;
  }
}

function clickMediaSave() {
  var poi = JSON.parse($('#mediaFileDialogContent').find('.poi').text());
  var mediaId = $('#mediaFileDialogContent').find('.mediaId').text();

  if ($('#mediaFileDialogContent').find('.createOrUpdate').text() == "create") {
    var data = {
      name: $('#mediaFileDialogContent').find('.name').val(),
      description: $('#mediaFileDialogContent').find('.name').val(),
      versionDate: new Date().toISOString()
    };
    if (utils.getCurrentBlob()) {
      mmsApi.createNewMediaFile(data, utils.getCurrentBlob(), function () {
        $('#mediaFileDialog').modal('toggle');
      });
    } else {
      alert("Please add an asset");
    }
  } else if ($('#mediaFileDialogContent').find('.createOrUpdate').text() == "update") {
    var metadataChanged = false;
    var data = JSON.parse($('#mediaFileDialogContent').find('.metadata').text());
    var nameField = $('#mediaFileDialogContent').find('.name').val();
    if (data.name != nameField) {
      data.name = nameField;
    }
    var descriptionField = $('#mediaFileDialogContent').find('.description').val();
    if (data.description != descriptionField) {
      data.description = descriptionField;
    }
    mmsApi.updateMediaFile(mediaId, data, utils.getCurrentBlob(), function () {
      $('#mediaFileDialog').modal('toggle');
    });
  }
}

function clickMediaCancel() {
  $('#mediaFileDialog').modal('toggle');
}

function clickNewMedia() {

  utils.resetCurrentBlob();

  console.log("newMedia button clicked");
  $('#mediaFileDialogContent').find('.createOrUpdate').text("create");
  $('#mediaFileDialogContent').find('.poi').text(JSON.stringify(currentData));
  $('#mediaFileDialogContent').find('.name').val("");
  $('#mediaFileDialogContent').find('.description').val("");
  $('#mediaFileDialogContent').find('img').hide();
  $('#mediaFileDialogContent').find('.metadata').text("");
  $('#mediaFileDialogContent').find('.mediaVersions').html("");

  document.getElementById('mediaUpload').addEventListener('change', utils.handleFileSelect, false);
}

function toggleLoginButton() {
  authApi.checkIfAuth(function (data) {
    $('#loginbutton').text("Logout " + data.contact.name);
    $('#loginbutton').attr("href", authApi.getLogoutEndpoint());
    $('#save').removeAttr("disabled");
  }, function () {
    $('#loginbutton').text("Login");
    $('#loginbutton').attr("href", authApi.getAuthEndpoint());
    $('#save').attr("disabled", "disabled");
  });
}

module.exports = {
  fillForm: fillForm,
  addLanguageSwitcher: addLanguageSwitcher,
  addFreeTagsRow: addFreeTagsRow,
  fillTransforMapTax: fillTransforMapTax,
  fillTOIs: fillTOIs,
  map: map,
  clickSubmit: clickSubmit,
  clickDelete: clickDelete,
  clickSearch: clickSearch,
  stopRKey: stopRKey,
  clickMediaSave: clickMediaSave,
  clickMediaCancel: clickMediaCancel,
  clickNewMedia: clickNewMedia,
  toggleLoginButton: toggleLoginButton
};
});

require.register("lib/user_api.js", function(exports, require, module) {
'use strict';

/*
 * This library handles calls to user api for the transformap editor
 *
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL

 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

var utils = require('./utils.js');

var endpoint = utils.baseUrl + '/users/';

/* returns the API's endpoint */
function getUserEndpoint() {
  return endpoint;
}

/*
 * Gets the metadata of a certain user
 * Params:
 *  - userId: the id of the user to pull data from
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function getUser(userId, callback) {
  if (!userId) {
    console.log('getUser: no userId given');
    return false;
  }

  var xhr = utils.createCORSRequest('GET', endpoint + userId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

/*
 * Updates the metadata of a certain user
 * Params:
 *  - userId: the id of the user to update data from
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function updateUser(userId, data, callback) {
  if (!userId) {
    console.log('updateUser: no userId given');
    return false;
  }

  if (!data) {
    console.log('updateUser: no data given');
    return false;
  }

  var xhr = utils.createCORSRequest('PUT', endpoint + userId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.withCredentials = true;
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(xhr);
      }
    }
  };
}

module.exports = {
  getUserEndpoint: getUserEndpoint,
  getUser: getUser
};
});

require.register("lib/utils.js", function(exports, require, module) {
"use strict";

var currentBlob;

var baseUrl = 'https://transformap-data.apps.allmende.io' !== "//undefined" ? 'https://transformap-data.apps.allmende.io' : "";
/*
 * This library provide utility functions
 *
 * Mon  3 Oct 15:07:12 CEST 2016
 * Michael Maier (species@github), WTFPL
 * Fri  21 Jul 14:30:00 UTC+1 2017
 * Alex Corbi (alexcorbi@posteo.net), WTFPL
 *
 * returns object with key:value pairs

 This program is free software. It comes without any warranty, to
     * the extent permitted by applicable law. You can redistribute it
     * and/or modify it under the terms of the Do What The Fuck You Want
     * To Public License, Version 2, as published by Sam Hocevar. See
     * http://www.wtfpl.net/ for more details. */

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

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value.replace(/#.*$/, '');
  });
  return vars;
}

function getUrlPath(url) {
  var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
  return reg.exec(url)[1];
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

function handleFileSelect(evt, callback) {
  var files = evt.target.files;
  var reader = new FileReader();

  reader.onload = function (event) {
    var contents = event.target.result;
    currentBlob = {
      name: files[0].name,
      type: files[0].type,
      contents: contents
    };
    $('#mediaFileDialogContent').find('img').attr('src', contents);
    $('#mediaFileDialogContent').find('img').show();
  };

  reader.onerror = function (event) {
    console.error("File could not be read! Code " + event.target.error.code);
    ui.currentBlob = undefined;
  };

  var accept = {
    binary: ["image/png", "image/jpeg"]
  };

  var file;

  for (var i = 0; i < files.length; i++) {
    file = files[i];

    if (file !== null) {
      if (accept.binary.indexOf(file.type) > -1) {
        reader.readAsDataURL(file);
      }
    }
  }
}

function getCurrentBlob() {
  return currentBlob;
}

function resetCurrentBlob() {
  currentBlob = undefined;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

module.exports = {
  createCORSRequest: createCORSRequest,
  getUrlVars: getUrlVars,
  getUrlPath: getUrlPath,
  generateUUID: generateUUID,
  handleFileSelect: handleFileSelect,
  getCurrentBlob: getCurrentBlob,
  baseUrl: baseUrl,
  resetCurrentBlob: resetCurrentBlob,
  getCookie: getCookie,
  setCookie: setCookie
};
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map