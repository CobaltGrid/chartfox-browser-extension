import { defineConfig, loadEnv } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import makeRulesJson from './src/buildHelpers/makeRulesJson'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  // Load environment variables, set defaults
  const env = loadEnv(mode, process.cwd(), '')
  if (env.VITE_DOMAINS === undefined) env.VITE_DOMAINS = (isProduction ? 'chartfox.org' : 'localhost')

  // Define function to generate the rule.json file required
  const makeRuleFile = (): void => {
    fs.writeFileSync('src/rule.json', JSON.stringify(makeRulesJson(env)))
  }

  // Modify the manifest based on the environment
  manifest.content_scripts[0].matches = env.VITE_DOMAINS.split(',').map(domain => `*://*.${domain}/*`)

  return {
    plugins: [
      crx({ manifest }),
      {
        name: 'generate-rule-json',
        load (): void {
          makeRuleFile()
        },
        generateBundle () {
          makeRuleFile()
        }
      }
    ],
    server: {
      port: 5174,
      strictPort: true,
      hmr: {
        port: 5174
      }
    }
  }
})
