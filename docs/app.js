(() => {
  const install = document.getElementById('installApp');
  const help = document.getElementById('installHelp');
  const connection = document.getElementById('connectionNotice');
  let deferredPrompt = null;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function updateInstallation() {
    install.hidden = standalone();
    if (standalone()) help.open = false;
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    updateInstallation();
  });
  install.addEventListener('click', async () => {
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      deferredPrompt = null;
      try {
        await prompt.prompt();
        await prompt.userChoice;
      } catch (error) {
        help.open = true;
      }
    } else {
      help.open = !help.open;
    }
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    install.hidden = true;
    help.open = false;
  });
  function updateConnection() {
    connection.hidden = navigator.onLine;
    if (!navigator.onLine) {
      const water = document.getElementById('waterStatus');
      water.textContent = 'Okänt – offline';
      water.className = 'value warn';
    }
  }
  window.addEventListener('offline', updateConnection);
  window.addEventListener('online', () => {
    updateConnection();
    loadAllData(false);
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateConnection();
      loadAllData(false);
    }
  });
  updateInstallation();
  updateConnection();
})();
