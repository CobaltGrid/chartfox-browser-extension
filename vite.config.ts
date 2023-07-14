import { version } from './package.json'
import manifest from './src/manifest.json'
import rule from './src/rule.json'

import processDomainList from './helper/process-domain'

import fs from 'fs'
import { resolve } from 'path'

import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  // Load environment variables, set defaults
  const env = loadEnv(mode, process.cwd(), '')
  env.VITE_INITIATOR_DOMAINS ??= isProduction ? 'chartfox.org' : 'localhost'
  env.VITE_REQUEST_DOMAINS ??= '*'

  const initiators = processDomainList(env.VITE_INITIATOR_DOMAINS) as string[]
  const requests = processDomainList(env.VITE_REQUEST_DOMAINS)

  return {
    build: {
      lib: {
        entry: fs.readdirSync('src')
          .filter((name) => /^\w+\.ts$/.test(name))
          .map((path) => resolve(__dirname, 'src', path)),
        formats: ['es']
      }
    },
    plugins: [{
      name: 'manifest-json-generation',
      resolveId (id) {
        return id === 'config' ? '.json?config' : null
      },
      load (id) {
        return id === '.json?config'
          ? JSON.stringify({ initiators, requests })
          : null
      },
      async renderStart (outputOptions) {
        const resolveTs = (paths: string[]): string[] =>
          paths.map((file) => file.replace('.ts', '.js'))

        manifest.version = version
        manifest.background.scripts = resolveTs(manifest.background.scripts)
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
