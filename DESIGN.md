# Design

Calmeet uses Google Calendar API to get who attends to the meeting and communicate each other members.

`Events` in the Google Caldndar API has `extendedProperties.shared` property to share informations.
Ref: https://developers.google.com/calendar/v3/reference/events

Calmeet uses key `calmeet.kyoh86.dev` to store any data.
The data can be accessed like below.

```javascript
event.extendedProperties.shared['calmeet.kyoh86.dev']
```

## Attendees

Calmeet will put up a signal into the data as a attendee.

- Value: `{ 'ping': new Date().toISOString() }`
- Key: user's email address.
- Timing: every 1 minute.

## Owners

Calmeet will get informations from event and the data.

- Expected members from `event.attendees`.
- Actual members from Calmeet data.
- Timing: every 10 seconds.
