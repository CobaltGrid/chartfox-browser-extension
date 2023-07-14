postMessage({ type: 'chartfox_extension_enabled' }, '*')

addEventListener('message', (event) => {
  if (event.data?.type !== 'chartfox_extension_permissions_check') return

  void (window.chrome ?? browser).runtime.sendMessage(null)
    .then((hasPermissions: boolean) => {
      postMessage({
        type: 'chartfox_extension_permissions_checked',
        hasPermissions
      }, event.origin)
    })
})
