import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
const [owner, repository] = (process.env.GITHUB_REPOSITORY || '').split('/');
const site = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'https://example.com');
const base = process.env.BASE_PATH || (process.env.SITE_URL ? '/' : repository && repository.toLowerCase() !== `${owner}.github.io`.toLowerCase() ? `/${repository}` : '/');
// CMS Markdown uses root-relative media URLs. Prefix them for repository hosting.
function rebaseMarkdown() {
  return (tree) => {
    function visit(node) {
      if (node.properties) for (const key of ['href', 'src', 'poster']) {
        const value = node.properties[key];
        const prefix = base.replace(/\/$/, '');
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && prefix && value !== prefix && !value.startsWith(prefix + '/')) node.properties[key] = prefix + value;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
export default defineConfig({site, base, output:'static', trailingSlash:'always', markdown:{processor:unified({rehypePlugins:[rebaseMarkdown]})}, devToolbar:{enabled:false}});
