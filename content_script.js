function attending() {
  return new Promise((resolve, _) => {
    const timer = setInterval(async function() {
      let inr = await inRoom();
      if (!inr) {
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
    const repeat = async function() {
      let inr = await inRoom();
      if (!inr) {
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
        setTimeout(repeat, 60000); // 1 minute
      });
    };
    repeat();
  });
}

async function ping(email, calendarId = 'primary') {
  const token = await getAuthToken();
  const meetId = await getMeetId();
  const event = await getMeetEvent(token, meetId);
  const now = new Date();

  let init = {
    method: 'PATCH',
    async: true,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json; charset=utf-8'
    },
    'contentType': 'json',
    body: JSON.stringify({
      'extendedProperties': {
        'shared': buildPingObject(email, now)
      }
    }),
  };

  let url = 'https://www.googleapis.com/calendar/v3/calendars/'
          + calendarId
          + '/events/'
          + event.id;

  await fetch(url, init);
}

function buildPingObject(email, now) {
  let myObj = {};
  myObj[email] = now.getTime();
  return myObj;
}

window.onload = async function() {
  let email = await getEmail();
  while (true) {
    await attending();
    await pinging(email);
  }
};
