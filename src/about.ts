const { permissions } = globalThis.chrome ?? browser

const statusText = document.getElementById('status') as HTMLParagraphElement
const requestBut = document.getElementById('request') as HTMLButtonElement

const update = (): void => {
  void permissions.contains({ origins: __REQUIRED_HOSTS__ })
    .then((hasPermissions: boolean) => {
      if (hasPermissions) {
        statusText.innerText = '✅ Permissions granted — you can close this page'
        requestBut.style.visibility = 'hidden'
      } else {
        statusText.innerText = '❌ Permissions required'
        requestBut.style.visibility = 'visible'
      }
    })
}

requestBut.addEventListener('click', () => {
  void permissions.request({ origins: __REQUIRED_HOSTS__ }).then(update)
})

update()
