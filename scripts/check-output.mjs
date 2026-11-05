import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {parse} from 'yaml';
const root=resolve('dist');
const errors=[];
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const htmlFiles=files(root).filter(f=>f.endsWith('.html') && f!==join(root,'editor.html')); // Editor has its own relative assets and browser-only controls.
const home=readFileSync(join(root,'index.html'),'utf8');
const canonical=home.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
if(!canonical)throw new Error('Missing homepage canonical');
const site=new URL(canonical);const base=site.pathname.replace(/\/$/,'');
for(const file of htmlFiles){
  const html=readFileSync(file,'utf8');
  for(const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)){
    const value=match[1].replace(/&amp;/g,'&');
    if(!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/.test(value))continue;
    const local=new URL(value,site).pathname;
    if(base && local!==base && !local.startsWith(base+'/')){errors.push(`${file}: missing deployment prefix: ${value}`);continue;}
    let target=join(root,decodeURIComponent(local.slice(base.length)));
    if(existsSync(target)&&statSync(target).isDirectory())target=join(target,'index.html');
    if(!existsSync(target))errors.push(`${file}: missing local link or asset ${value}`);
  }
  if(!html.includes('<meta name="description"'))errors.push(`${file}: missing description`);
  if(/<iframe/.test(html))errors.push(`${file}: eager iframe found`);
}
for(const file of files('src/content/projects').filter(x=>x.endsWith('.md'))){
  const source=readFileSync(file,'utf8');
  const data=parse(source.split('---')[1]);
  const generated=existsSync(join(root,'projects',data.slug,'index.html'));
  if(Boolean(data.published&&!data.deleted)!==generated)errors.push(`${file}: published/draft route mismatch`);
}
const cms=parse(readFileSync('.pages.yml','utf8'));
for(const section of cms.content){if(!existsSync(section.path))errors.push(`CMS path missing: ${section.path}`);}
for(const entry of cms.media){if(!existsSync(entry.input))errors.push(`CMS media directory missing: ${entry.input}`);}
if(!existsSync(join(root,'sitemap.xml'))||!existsSync(join(root,'robots.txt')))errors.push('Missing discovery files');
if(errors.length)throw new Error(errors.join('\n'));
console.log(`Verified ${htmlFiles.length} HTML pages: local links, media, metadata, draft routes, deferred video, and CMS paths. Base: ${base||'/'}`);
