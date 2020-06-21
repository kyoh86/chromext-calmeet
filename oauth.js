'use strict';

function authorize(interactive = false) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: interactive}, function(token) {
      if (!token) {
        reject('unauthorized');
        return
      }
      chrome.runtime.sendMessage({method: methodStoreAuthToken, payload: {authToken: token}});
      resolve(token);
    });
  });
}

function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({method: methodGetAuthToken}, data => {
      if (!data.authToken) {
        reject('unauthorized');
        return;
      }
      resolve(data.authToken);
    });
  });
}

function getEmail() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['email'], profile => {
      if (!profile.email) {
        reject('cannot get profile');
        return;
      }
      resolve(profile.email);
    });
  });
}
