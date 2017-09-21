var currentBlob

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

function getUrlVars () {
  var vars = {}
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value.replace(/#.*$/, '')
  })
  return vars
}

function getUrlPath(url){
  var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
  return reg.exec(url)[1]
}

function generateUUID() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0
        d = Math.floor(d/16)
        return (c=='x' ? r : (r&0x3|0x8)).toString(16)
    })
    return uuid
}

function handleFileSelect(evt,callback) {
  var files = evt.target.files
  var reader = new FileReader()

  reader.onload = function(event) {
    var contents = event.target.result
    currentBlob = contents
    $('#mediaFileDialogContent').find('img').attr('src', contents)
    $('#mediaFileDialogContent').find('img').show()
    $('#mediaThumbUpload').hide()
  }

  reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code)
    ui.currentBlob = undefined
  }

  var accept = {
    binary : ["image/png", "image/jpeg"]
  }

  var file

  for (var i = 0; i < files.length; i++) {
    file = files[i]

    if (file !== null) {
      if (accept.binary.indexOf(file.type) > -1) {
        reader.readAsDataURL(file)
      }
    }
  }
}

function getCurrentBlob(){
  return currentBlob
}

function resetCurrentBlob(){
  currentBlob = undefined
}

module.exports = {
  createCORSRequest: createCORSRequest,
  getUrlVars: getUrlVars,
  getUrlPath: getUrlPath,
  generateUUID: generateUUID,
  handleFileSelect: handleFileSelect,
  getCurrentBlob: getCurrentBlob,
  resetCurrentBlob: resetCurrentBlob
}
