const api = globalThis.chrome ?? browser

api.runtime.onMessage.addListener((_m, _s, reply: (value: boolean) => void) => {
  void api.permissions.contains({ origins: __REQUIRED_HOSTS__ })
    .then((result) => {
      reply(result)

      if (!result) void api.runtime.openOptionsPage()
    })
  return true
})
