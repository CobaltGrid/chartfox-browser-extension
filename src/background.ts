const origins = __REQUIRED_HOSTS__
const api = (window.chrome ?? browser)

api.runtime.onMessage.addListener((_m, _s, reply: (value: boolean) => void) => {
  void api.permissions.contains({ origins }).then((result) => { reply(result) })
  return true
})
