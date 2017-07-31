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

const utils = require('./utils.js')

const endpoint = ''

/* returns the API's endpoint */
function getAuthEndpoint () {
  return endpoint
}

/*
 * Retrieves the auth token from the RP
 * Params:
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function retrieveAuthToken (callback) {

}

/*
 * Decouples the auth token from the current session
 * Params:
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function logout (callback) {

}

module.exports = {
  getAuthEndpoint: getAuthEndpoint,
  retrieveAuthToken: retrieveAuthToken,
  logout: logout
}
