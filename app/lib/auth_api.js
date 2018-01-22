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

const Cookies = require("js-cookie");

const utils = require('./utils.js');

const endpoint = utils.baseUrl;

/* returns the API's endpoint */
function getAuthEndpoint () {
  return endpoint + '/auth/';
}

function getLogoutEndpoint () {
  return endpoint + '/logout/';
}

/* taken "a bit" of inspiration from https://github.com/hackmdio/hackmd/blob/master/public/js/lib/common/login.js#L47 */

let checkAuth = false
let profile = null
let lastLoginState = getLoginState()
let lastUserId = getUserId()
var loginStateChangeEvent = null

function setloginStateChangeEvent (func) {
  loginStateChangeEvent = func
}

function resetCheckAuth () {
  checkAuth = false
}

function setLoginState (bool, id) {
  Cookies.set('loginstate', bool, {
    expires: 365
  })
  if (id) {
    Cookies.set('userid', id, {
      expires: 365
    })
  } else {
    Cookies.remove('userid')
  }
  lastLoginState = bool
  lastUserId = id
  checkLoginStateChanged()
}

function checkLoginStateChanged () {
  if (getLoginState() !== lastLoginState || getUserId() !== lastUserId) {
    if (loginStateChangeEvent) setTimeout(loginStateChangeEvent, 100)
    return true
  } else {
    return false
  }
}

function getLoginState () {
  const state = Cookies.get('loginstate')
  return state === 'true' || state === true
}

function getUserId () {
  return Cookies.get('userid')
}

function clearLoginState () {
  Cookies.remove('loginstate')
}

function checkIfAuth (yesCallback, noCallback) {
  const cookieLoginState = getLoginState()
  if (checkLoginStateChanged()) checkAuth = false
  if (!checkAuth || typeof cookieLoginState === 'undefined') {
    $.get({
      url: `${utils.baseUrl}/user`,
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    })
      .done(data => {
        if (data && typeof data._id !== 'undefined') {
          profile = data
          yesCallback(profile)
          setLoginState(true, data._id)
        } else {
          noCallback()
          setLoginState(false)
        }
      })
      .fail(() => {
        noCallback()
      })
      .always(() => {
        checkAuth = true
      })
  } else if (cookieLoginState) {
    yesCallback(profile)
  } else {
    noCallback()
  }
}

/*
 * Decouples the auth token from the current session
 * Params:
 *  - callback: function to be called upon success.
 * Returns: false if invalid call
*/
function logout (authToken,callback) {
  if (!authToken){
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
