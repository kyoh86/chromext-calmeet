window.onload = function() {

let authStatus = document.querySelector('.authorize-status');
let authButton = document.querySelector('.authorize-button');
let takeButton = document.querySelector('.take-attendance-button');

authButton.addEventListener('click', async function() {
  await authorize(true);
  authStatus.innerText = 'OK';
  authButton.style.display = 'none';
});

takeButton.addEventListener('click', async function() {
  await takeAttendance();
});

getAuthToken()
.then(() => {
  authStatus.innerText = 'OK';
  authButton.style.display = 'none';
})
.catch(err => {
  authStatus.innerText = err;
  authButton.style.display = 'inner-block';
  console.debug(err);
});

};

async function takeAttendance() {
  let min = new Date();
  min.setMinutes(min.getMinutes()-5);

  try {
    let token = await getAuthToken();
    let meetId = await getMeetId();
    let event = await getMeetEvent(token, meetId);

    console.debug(event);
    let members = (event.extendedProperties || {shared: {}}).shared;
    let unknown = [];
    let living = [];
    (event.attendees || []).forEach(at => {
      let ping = members[at.email];
      if (ping > min.getTime()) {
        living.push(at.email);
      } else {
        unknown.push(at.email);
      }
    });
    unknown.sort();
    living.sort();

    let unknownList = document.querySelector('.unknown-members');
    updateList(unknownList, unknown);
    let livingList = document.querySelector('.living-members');
    updateList(livingList, living);
  } catch (err) {
    console.error(err);
  }
}

function updateList(list, items) {
  list.childNodes.forEach(item => list.removeChild(item));
  items.forEach(m => {
    let item = document.createElement('li');
    item.appendChild(document.createTextNode(m))
    list.appendChild(item);
  });
}
