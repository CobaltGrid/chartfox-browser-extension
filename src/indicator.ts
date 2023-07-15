postMessage({
  type: 'chartfox_extension_enabled',
  version: __VERSION__
}, '*')

const checkPermissions = (origin: string = '*'): void => {
  void (globalThis.chrome ?? browser).runtime.sendMessage(null)
    .then((hasPermissions: boolean) => {
      postMessage({
        type: 'chartfox_extension_permissions_checked',
        hasPermissions
      }, origin)
    })
}

addEventListener('message', (event) => {
  if (event.data?.type === 'chartfox_extension_permissions_check') {
    checkPermissions(event.origin)
  }
})

checkPermissions()
