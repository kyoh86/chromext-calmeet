// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: 'index.html'});
});

chrome.identity.getProfileUserInfo(profile => {
  if (profile.email) {
    chrome.storage.sync.set(profile);
  }
});

let authToken = null;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.method) {
    case methodStoreAuthToken:
      authToken = message.payload.authToken;
    case methodGetAuthToken:
      if (authToken) {
        sendResponse({authToken: authToken});
        return true;
      } else {
        authorize()
        .catch(err => {
          console.debug(err);
        })
        .then(token => {
          if (token) {
            authToken = token;
          }
          sendResponse({authToken: authToken});
        });
        return true;
      }
  }
  return false;
});
