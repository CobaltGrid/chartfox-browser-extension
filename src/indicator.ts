const browserApi = globalThis.chrome ?? browser

// On page load, check with the background script if the required permissions have been granted
void browserApi.runtime.sendMessage('checkPermissions')
  .then((hasPermissions: boolean) => {
    // TODO: In the future, display a popup on the site to notify the user that the extension is disabled, and prompt to request permissions. However, this typically won't work as it is likely that this script is not even being run!
    if (!hasPermissions) return

    // If the permissions have been granted, we can notify the frontend that the extension is enabled
    postMessage({
      type: 'chartfox_extension_enabled',
      version: __VERSION__
    }, '*')
  })
