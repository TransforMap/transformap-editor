const L = require('leaflet')
const L_Hash = require('leaflet-hash')
const L_Draw = require('leaflet-draw')
const redFetch = require('./red_fetch.js')

var map,
    editableLayers,
    drawControl,
    placeMarker;

module.exports = function () {
  console.log("called initialize, didn't reply")

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

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value.replace(/#.*$/,'');
    });
    return vars;
  }

  function initMap () {
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

    var urlparams = getUrlVars();

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
        document.getElementById("_geometry_lon").value = layer._latlng.lng.toFixed(6)
        document.getElementById("_geometry_lat").value = layer._latlng.lat.toFixed(6)

        map.removeControl(drawControl) 
        drawControl = getDrawControl(false) //deactivate "add marker" after the 1st one
        map.addControl(drawControl)
        //fixme instantly enable 'edit' mode of layer
    });


    map.on('draw:editmove', function(e) {
      console.log("editmove");
      console.log(e);
      document.getElementById("_geometry_lon").value = e.layer._latlng.lng.toFixed(6)
      document.getElementById("_geometry_lat").value = e.layer._latlng.lat.toFixed(6)

    })
  
  }
  initMap()

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

      editableLayers.addLayer(new L.marker([lat,lon], { icon: new placeMarker() }))

      drawControl = getDrawControl(false)
      map.addControl(drawControl)

      map.panTo(new L.LatLng(lat,lon))

    }
    else { //allow adding a marker
      drawControl = getDrawControl(true)
      map.addControl(drawControl)
    }

  }

  redFetch(data_urls,fillForm,console.error)

  console.log("'initialize' called")
}
