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

const utils = require('./utils.js');

const endpoint = utils.baseUrl + '/users/';

/* returns the API's endpoint */
function getUserEndpoint () {
  return endpoint;
}

/*
 * Gets the metadata of a certain user
 * Params:
 *  - userId: the id of the user to pull data from
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function getUser (userId,callback) {
  if (!userId){
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
function updateUser (userId,data,callback) {
  if (!userId){
    console.log('updateUser: no userId given');
    return false;
  }

  if (!data){
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
