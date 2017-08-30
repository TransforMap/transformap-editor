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

module.exports = {
  createCORSRequest: createCORSRequest,
  getUrlVars: getUrlVars,
  getUrlPath: getUrlPath
}
