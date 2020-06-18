// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const meetID = 'eag-qzsw-xem';
window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, async function(token) {
      const pre = document.getElementById('events-tryout');
      let events = await fetchEvents(token);
      if (!events) {
        return;
      }

      let attendee = events
        .filter(e => !!e.hangoutLink && e.hangoutLink.endsWith('/' + meetID))
        .flatMap(e => e.attendees.map(a => a.email));
      pre.innerText = attendee.join("\n");
    });
  });
};

async function fetchEvents(token) {
  const calendarId = 'primary';
  let init = {
    method: 'GET',
    async: true,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    'contentType': 'json'
  };

  let query = new URLSearchParams();
  let now = new Date();

  let max = new Date(now);
  max.setHours(max.getHours() + 1); // an hour later
  query.append('timeMax', max.toISOString());

  let min = new Date(now);
  min.setHours(min.getHours() - 1); // an hour before
  query.append('timeMin', min.toISOString());

  console.debug(`get events from ${min.toLocaleString()} to ${max.toLocaleString()}`);

  let url = 'https://www.googleapis.com/calendar/v3/calendars/'
          + calendarId
          + '/events'
          + '?' + query.toString();

  let res = await fetch(url, init).then(res => res.json());
  return res.items;
}
