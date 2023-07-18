export default function processDomainList (list?: string): string[] | undefined {
  list ??= ''
  if (list === '') return

  return list
    .split(',')
    .map((domain) => (domain.startsWith('*') ? '' : '*.') + domain)
    .map((domain) => `*://${domain}/*`)
}
