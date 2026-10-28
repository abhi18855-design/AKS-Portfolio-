import {base} from './config.js';import {fromLegacy} from './legacy-adapter.js';import {renderSite} from './render-site.js';import {mountProjects} from './projects-view.js';
const objectURLs=[];
try{
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('portfolio-editor:'+base,1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 const draft=await new Promise((resolve,reject)=>{const r=db.transaction('drafts').objectStore('drafts').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();
 if(!draft)throw Error('Save changes in the editor before opening a preview.');
 const data=fromLegacy(draft.content);data.projects.forEach(p=>p.status='published');
 const files=await renderSite(data),route=new URL(location.href).searchParams.get('route')||'index.html';if(!files[route])throw Error('This preview page is not available.');
 const html=new DOMParser().parseFromString(files[route],'text/html');document.title='Draft preview — '+html.title;document.body.innerHTML=html.body.innerHTML;document.querySelectorAll('script').forEach(s=>s.remove());
 const theme=new CSSStyleSheet();theme.replaceSync(files['assets/theme.css']);document.adoptedStyleSheets=[...document.adoptedStyleSheets,theme];
 const banner=document.createElement('div');banner.className='preview-banner';const back=document.createElement('a');back.href=base+'editor/#/editor';back.textContent='DRAFT PREVIEW · Includes unpublished projects · Return to editor ↗';banner.append(back);document.body.prepend(banner);
 const urls={};for(const [path,blob]of Object.entries(draft.assets)){urls[base+path]=URL.createObjectURL(blob);objectURLs.push(urls[base+path]);}
 function resolvePreview(){
  for(const a of document.querySelectorAll('a[href]')){const href=a.getAttribute('href');if(a!==back&&href.startsWith(base)&&!href.includes('editor/')&&!href.includes('preview/')){const [path,hash]=href.slice(base.length).split('#');const file=path.endsWith('/')?path+'index.html':path||'index.html';if(files[file])a.href=base+'preview/?route='+encodeURIComponent(file)+(hash?'#'+hash:'');}}
  document.querySelectorAll('img,video,audio,source,track').forEach(el=>{if(urls[el.getAttribute('src')]){el.src=urls[el.getAttribute('src')];el.removeAttribute('srcset');}});
 }
 resolvePreview();mountProjects(data,resolvePreview);
}catch(err){const target=document.querySelector('#preview')||document.querySelector('main');if(target)target.textContent=err.message;}
window.addEventListener('pagehide',()=>objectURLs.forEach(URL.revokeObjectURL));
