export function withBase(path: string, base: string = '/') {
  if (/^(https?:|mailto:|tel:)/i.test(path) || path.startsWith('#')) return path;
  const prefix = '/' + base.replace(/^\/+|\/+$/g, '');
  const normalized = '/' + path.replace(/^\/+/, '');
  if (prefix === '/') return normalized;
  return normalized === prefix || normalized.startsWith(prefix + '/') ? normalized : prefix + normalized;
}
export function safeLink(value: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(value) || (/^\/(?!\/)/.test(value) && !value.includes('\\'));
}
