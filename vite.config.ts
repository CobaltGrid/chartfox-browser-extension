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
  env.VITE_TARGET ??= 'chrome'

  const initiators = processDomainList(env.VITE_INITIATOR_DOMAINS) as string[]
  const requests = processDomainList(env.VITE_REQUEST_DOMAINS)

  const isFirefox = env.VITE_TARGET === 'firefox'

  if (isFirefox || env.VITE_TARGET === 'chrome') {
    console.log(`chartfox: building for ${env.VITE_TARGET}`)
  } else {
    console.log(`chartfox: building for chrome (unknown target ${env.VITE_TARGET})`)
    env.VITE_TARGET = 'chrome'
  }

  const outDir = 'dist/' + env.VITE_TARGET

  return {
    define: {
      __API__: isFirefox ? 'browser' : 'chrome',
      __REQUIRED_HOSTS__: initiators.concat(requests ?? []),
      __VERSION__: JSON.stringify(version)
    },
    build: {
      lib: {
        entry: fs.readdirSync('src')
          .filter((name) => /^\w+\.(ts|html)$/.test(name))
          .map((name) => resolve(__dirname, 'src', name)),
        formats: ['es']
      },
      outDir
    },
    plugins: [{
      name: 'manifest-json-generation',
      renderStart (outputOptions) {
        const resolveTs = (file: string): string => file.replace('.ts', '.js')

        manifest.version = version

        if (isFirefox) {
          manifest.background.scripts = manifest.background.scripts.map(resolveTs)
          // @ts-expect-error Chromium-specific manifest key
          delete manifest.background.service_worker
        } else {
          manifest.background.service_worker = resolveTs(manifest.background.service_worker)
          // @ts-expect-error Firefox-specific manifest key
          delete manifest.background.scripts
        }

        manifest.content_scripts[0].js = manifest.content_scripts[0].js.map(resolveTs)
        manifest.content_scripts[0].matches = initiators

        // @ts-expect-error Manifest key is not allowed for chromium
        if (!isFirefox) delete manifest.browser_specific_settings

        manifest.host_permissions = initiators.concat(requests ?? [])

        rule[0].condition.initiatorDomains = env.VITE_INITIATOR_DOMAINS.split(',')

        const out = outputOptions.dir ?? outDir
        fs.writeFileSync(resolve(out, 'manifest.json'), JSON.stringify(manifest))
        fs.writeFileSync(resolve(out, 'rule.json'), JSON.stringify(rule))
      },
      writeBundle (outputOptions, bundle) {
        const out = outputOptions.dir ?? outDir

        // I can't believe it's come to this -- testament to the futility of
        // ill-conceived nonsense as is Vite/Rollup
        Object.keys(bundle)
          .filter((path) => path.endsWith('.html'))
          .forEach((name) => {
            fs.renameSync(
              resolve(out, name),
              resolve(out, basename(name))
            )
          })
        fs.rmdirSync(resolve(out, 'src'))
      }
    }]
  }
})
