import { version } from './package.json'
import manifest from './src/manifest.json'
import rule from './src/rule.json'

import processDomainList from './helper/process-domain'

import fs from 'fs'
import { resolve, basename } from 'path'

import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  // Load environment variables, set defaults
  const env = loadEnv(mode, process.cwd(), '')
  env.VITE_INITIATOR_DOMAINS ??= isProduction ? 'chartfox.org' : 'localhost'
  env.VITE_REQUEST_DOMAINS ??= '*'

  const initiators = processDomainList(env.VITE_INITIATOR_DOMAINS) as string[]
  const requests = processDomainList(env.VITE_REQUEST_DOMAINS)

  const isFirefox = env.VITE_TARGET === 'firefox'

  return {
    define: {
      __REQUIRED_HOSTS__: initiators.concat(requests ?? []),
      __VERSION__: JSON.stringify(version)
    },
    build: {
      lib: {
        entry: fs.readdirSync('src')
          .filter((name) => /^\w+\.(ts|html)$/.test(name))
          .map((name) => resolve(__dirname, 'src', name)),
        formats: ['es']
      }
    },
    plugins: [{
      name: 'manifest-json-generation',
      renderStart (outputOptions) {
        const resolveTs = (file: string): string => file.replace('.ts', '.js')

        manifest.version = version

        manifest.background.scripts = isFirefox
          ? manifest.background.scripts.map(resolveTs)
          : undefined as unknown as string[]
        manifest.background.service_worker = isFirefox
          ? undefined as unknown as string
          : resolveTs(manifest.background.service_worker)

        manifest.content_scripts[0].js = manifest.content_scripts[0].js.map(resolveTs)
        manifest.content_scripts[0].matches = initiators

        // @ts-expect-error Manifest key is not allowed for chromium
        if (!isFirefox) delete manifest.browser_specific_settings

        manifest.host_permissions = initiators.concat(requests ?? [])

        rule[0].condition.initiatorDomains = env.VITE_INITIATOR_DOMAINS.split(',')

        const out = outputOptions.dir ?? 'dist'
        fs.writeFileSync(resolve(out, 'manifest.json'), JSON.stringify(manifest))
        fs.writeFileSync(resolve(out, 'rule.json'), JSON.stringify(rule))
      },
      writeBundle (_outputOptions, bundle) {
        // I can't believe it's come to this -- testament to the futility of
        // ill-conceived nonsense as is Vite/Rollup
        Object.keys(bundle)
          .filter((path) => path.endsWith('.html'))
          .forEach((name) => {
            fs.renameSync(
              resolve(__dirname, 'dist', name),
              resolve(__dirname, 'dist', basename(name))
            )
          })
        fs.rmdirSync('dist/src')
      }
    }]
  }
})
