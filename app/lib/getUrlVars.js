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

function getUrlVars () {
  var vars = {}
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value.replace(/#.*$/, '')
  })
  return vars
}

module.exports = getUrlVars
