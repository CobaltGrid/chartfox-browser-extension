import { defineConfig, loadEnv } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import makeRulesJson from './src/buildHelpers/makeRulesJson'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const makeRuleFile = (): void => {
    fs.writeFileSync('src/rule.json', JSON.stringify(makeRulesJson(env)))
  }

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
