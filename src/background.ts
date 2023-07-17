import browserApi from '../helper/browser-api'

// On install, check if the extension has permissions required
browserApi.runtime.onInstalled.addListener(() => {
  void checkPermissionsOrRequest(true)
})

// On startup, check if the extension has permissions required
browserApi.runtime.onStartup.addListener(() => {
  void checkPermissionsOrRequest(true)
})

// If the content script requests a check, check perissions, request if able, and then reply
browserApi.runtime.onMessage.addListener((message, _sender, reply: (value: boolean) => void) => {
  if (message !== 'checkPermissions') return false

  void checkPermissionsOrRequest().then(reply)
  return true
})

// Returns a promise that indicates if all of the required permissions have been granted for the app
async function checkHasPermissions (): Promise<boolean> {
  return await browserApi.permissions.contains({ origins: __REQUIRED_HOSTS__ })
}

// Returns a promise that checks, and if not granted, requests, the required permissions for extension use
async function checkPermissionsOrRequest (openAsTab: boolean = false): Promise<boolean> {
  const result = await checkHasPermissions()

  if (!result) {
    if (openAsTab) openOptionsPageAsTab()
    else void browserApi.runtime.openOptionsPage()
  }
  return result
}

function openOptionsPageAsTab (): void {
  void browserApi.tabs.create({ url: browserApi.runtime.getURL('about.html') })
}
