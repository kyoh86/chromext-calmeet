'use strict';

async function fetchEvents(token, now, calendarId = 'primary') {
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

  let max = new Date(now);
  max.setHours(max.getHours() + 1);
  query.append('timeMax', max.toISOString());

  let min = new Date(now);
  min.setHours(min.getHours() - 1);
  query.append('timeMin', min.toISOString());

  console.debug(`get events from ${min.toLocaleString()} to ${max.toLocaleString()}`);

  let url = 'https://www.googleapis.com/calendar/v3/calendars/'
          + calendarId
          + '/events'
          + '?' + query.toString();

  let res = await fetch(url, init).then(res => res.json());
  return res.items;
}
