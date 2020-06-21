'use strict';

async function getMeetEvent(token, meetId) {
  let now = new Date();
  let events = await fetchEvents(token, now);
  if (!events) {
    throw 'Failed to get events';
  }

  events = events.filter(e => !!e.hangoutLink && e.hangoutLink.endsWith('/' + meetId))

  switch (events.length) {
    case 0:
      throw "There's no event";
    case 1:
      return events[1];
    default:
      return events.map(ev => {
        let start = new Date(ev.start.dateTime);
        let end = new Date(ev.end.dateTime);
        if (now < start) {
          return {diff: start.getTime() - now.getTime(), event: ev}
        } else if (end < now) {
          return {diff: now.getTime() - end.getTime(), event: ev}
        } else {
          return {diff: 0, event: ev}
        }
      }).sort((ev1, ev2) => {
        return ev2.diff - ev1.diff
      })[0].event;
  }
}

function getMeetId() {
  return location.pathname.substring(1, 13);
}

function inRoom() {
  const meetId = getMeetId();
  return /^[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{3}$/.test(meetId);
}

function isAttending() {
  let selfScreen = document.querySelector('*[data-initial-participant-id]');
  return selfScreen !== null;
}

