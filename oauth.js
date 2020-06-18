// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      const calendarId = 'primary';
      const pre = document.getElementById('events-tryout');
      let init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };
      fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
          init)
          .then((response) => response.json())
          .then(function(data) {
            pre.innerText = JSON.stringify(data, null, 2);
          });
    });
  });
};
