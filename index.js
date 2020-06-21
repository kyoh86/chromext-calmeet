window.onload = async function() {
  let authStatus = document.querySelector('.authorize-status');
  let authButton = document.querySelector('.authorize-button');

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
  authButton.addEventListener('click', async function() {
    await authorize(true);
    authStatus.innerText = 'OK';
    authButton.style.display = 'none';
  });
};
