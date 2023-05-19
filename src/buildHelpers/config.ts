export default function makeConfig (env: Record<string, string>): {
  appDomains: string[]
} {
  const appDomains = (env.VITE_DOMAINS ?? 'localhost').split(',')
  return { appDomains }
}
