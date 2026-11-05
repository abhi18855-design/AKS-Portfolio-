import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'yaml';
// Explicit source allowlist: never package Git metadata, credentials or local backups.
const state={version:2,revision:'',files:{},docs:{},media:{}};
function walk(p){for(const e of readdirSync(p,{withFileTypes:true})){const f=join(p,e.name).replaceAll('\\','/');if(e.name==='.DS_Store'||e.name==='editor-source.json')continue;if(e.isDirectory())walk(f);else add(f)}}
function add(p){const b=readFileSync(p);if(p.startsWith('public/media/')){state.media[p]={size:b.length,hash:createHash('sha256').update(b).digest('hex')};return}if(p.startsWith('src/content/projects/')&&p.endsWith('.md')){const s=b.toString(),m=s.match(/^---\s*\n([\s\S]*?)\n---(?:\r?\n|$)([\s\S]*)$/);if(!m)throw Error('Invalid project frontmatter: '+p);state.docs[p]={meta:parse(m[1]),body:m[2]};}else if((p.startsWith('src/data/')||p.startsWith('src/content/categories/'))&&p.endsWith('.json'))state.docs[p]=JSON.parse(b);else state.files[p]=b.toString('base64');}
for(const p of ['src','public','scripts','tests','.github'])if(existsSync(p))walk(p);
for(const p of ['package.json','pnpm-lock.yaml','astro.config.mjs','tsconfig.json','.pages.yml','.gitignore','README.md','EDITOR-GUIDE.md'])if(existsSync(p))add(p);
state.revision=createHash('sha256').update(JSON.stringify(state)).digest('hex').slice(0,16);
writeFileSync('public/editor-source.json',JSON.stringify(state));
console.log('Prepared editor content and source export.');
