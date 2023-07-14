import { initiators, requests } from 'config'

const origins = initiators.concat(requests ?? [])
const api = (window.chrome ?? browser)

api.runtime.onMessage.addListener((_m, _s, reply: (value: boolean) => void) => {
  void api.permissions.contains({ origins }).then((result) => { reply(result) })
  return true
})
