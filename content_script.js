function attending() {
  return new Promise((resolve, _) => {
    const timer = setInterval(() => {
      if (!inRoom()) {
        console.debug('not in a room');
        return;
      }
      if (!isAttending()) {
        console.debug('not attend in a meeting');
        return;
      }
      // attended.
      clearInterval(timer);
      resolve();
    }, 1000) // 1 second
  });
}

function pinging(email, calendarId = 'primary') {
  return new Promise(function (resolve, _) {
    if (!inRoom()) {
      console.debug('exited a room');
      resolve();
      return;
    }
    if (!isAttending()) {
      console.debug('leaved from a meeting');
      resolve();
      return;
    }

    // ping.
    ping(email, calendarId)
    .then(() => {
      console.log('ping!');
    })
    .catch(err => {
      console.error(err);
      // TODO: interactive button / notification?
    })
    .then(() => {
      setTimeout(this, 60000); // 1 minute
    });
  });
}

async function ping(email, calendarId = 'primary') {
  const token = await getAuthToken();
  const meetId = getMeetId();
  const event = getMeetEvent(token, meetId);
  const now = new Date();

  let init = {
    method: 'PATCH',
    async: true,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    'contentType': 'json',
    body: {
      'extendedProperties': {
        'shared': buildPingObject(now, email)
      }
    },
  };

  let url = 'https://www.googleapis.com/calendar/v3/calendars/'
          + calendarId
          + '/events/'
          + event.id;

  await fetch(url, init);
}

function buildPingObject(now, email) {
  let obj = {ping: now}
  let myObj = {};
  myObj[email] = obj;
  let pingObj = {};
  pingObj['calmeet.kyoh86.dev'] = myObj;
  return pingObj;
}

window.onload = async function() {
  let email = await getEmail();
  while (true) {
    await attending();
    await pinging(email);
  }
};
