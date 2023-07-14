import manifest from './src/manifest.json'
import rule from './src/rule.json'

import fs from 'fs'
import { resolve } from 'path'

import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  // Load environment variables, set defaults
  const env = loadEnv(mode, process.cwd(), '')
  env.VITE_INITIATOR_DOMAINS ??= isProduction
    ? 'chartfox.org,beta.chartfox.org'
    : 'localhost'
  env.VITE_REQUEST_DOMAINS ??= '*'

  const processDomainList = (list?: string): string[] | undefined => {
    list ??= ''
    if (list === '') return

    return list.split(',').map((domain) => `*://${domain}/*`)
  }

  const initiators = processDomainList(env.VITE_INITIATOR_DOMAINS) as string[]
  const requests = processDomainList(env.VITE_REQUEST_DOMAINS)

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/indicator.ts'),
        formats: ['es'],
        fileName: 'indicator'
      }
    },
    plugins: [{
      name: 'manifest-json-generation',
      async renderStart (outputOptions) {
        const resolveTs = (paths: string[]): string[] =>
          paths.map((file) => file.replace('.ts', '.js'))

        manifest.content_scripts[0].js = resolveTs(manifest.content_scripts[0].js)
        manifest.content_scripts[0].matches = initiators
        manifest.host_permissions = initiators.concat(requests ?? [])
        rule[0].condition.initiatorDomains = env.VITE_INITIATOR_DOMAINS.split(',')

        const out = outputOptions.dir ?? 'dist'
        fs.writeFileSync(resolve(out, 'manifest.json'), JSON.stringify(manifest))
        fs.writeFileSync(resolve(out, 'rule.json'), JSON.stringify(rule))
      }
    }]
  }
})
