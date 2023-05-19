import makeConfig from './config'
export default function (env: Record<string, string>): chrome.declarativeNetRequest.Rule[] {
  const config = makeConfig(env)
  return [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          {
            header: 'Access-Control-Allow-Origin',
            operation: 'set',
            value: '*'
          }
        ]
      },
      condition: {
        resourceTypes: [
          'xmlhttprequest'
        ],
        initiatorDomains: config.appDomains
      }
    }
  ]
}
