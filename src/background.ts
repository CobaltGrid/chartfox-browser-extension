// On install, check if the extension has permissions required
__API__.runtime.onInstalled.addListener(() => {
  void checkPermissionsOrRequest(true)
})

// On startup, check if the extension has permissions required
__API__.runtime.onStartup.addListener(() => {
  void checkPermissionsOrRequest(true)
})

// If the content script requests a check, check perissions, request if able, and then reply
__API__.runtime.onMessage.addListener((message, _sender, reply: (value: boolean) => void) => {
  if (message !== 'checkPermissions') return false

  void checkPermissionsOrRequest().then(reply)
  return true
})

// Returns a promise that indicates if all of the required permissions have been granted for the app
async function checkHasPermissions (): Promise<boolean> {
  return await __API__.permissions.contains({ origins: __REQUIRED_HOSTS__ })
}

// Returns a promise that checks, and if not granted, requests, the required permissions for extension use
async function checkPermissionsOrRequest (openAsTab: boolean = false): Promise<boolean> {
  const result = await checkHasPermissions()

  if (!result) {
    if (openAsTab) openOptionsPageAsTab()
    else void __API__.runtime.openOptionsPage()
  }
  return result
}

function openOptionsPageAsTab (): void {
  void __API__.tabs.create({ url: __API__.runtime.getURL('about.html') })
}
