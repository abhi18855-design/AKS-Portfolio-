import {base} from './config.js';import {fromLegacy} from './legacy-adapter.js';import {renderSite} from './render-site.js';
try{
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('portfolio-editor:'+base,1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
 const draft=await new Promise((resolve,reject)=>{const r=db.transaction('drafts').objectStore('drafts').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();
 if(!draft)throw Error('Save changes in the editor before opening a preview.');
 const files=await renderSite(fromLegacy(draft.content));const route=new URL(location.href).searchParams.get('route')||'index.html';if(!files[route])throw Error('This preview page is not available.');
 const html=new DOMParser().parseFromString(files[route],'text/html');document.body.innerHTML=html.body.innerHTML;document.querySelectorAll('script').forEach(s=>s.remove());
 const banner=document.createElement('div');banner.className='preview-banner';const back=document.createElement('a');back.href=base+'editor/#/editor';back.textContent='DRAFT PREVIEW · Not published · Return to editor ↗';banner.append(back);document.body.prepend(banner);
 for(const a of document.querySelectorAll('a[href]')){const href=a.getAttribute('href');if(a!==back&&href.startsWith(base)&&!href.includes('editor/')){const path=href.slice(base.length).split('#')[0];const file=path.endsWith('/')?path+'index.html':path||'index.html';if(files[file])a.href=base+'preview/?route='+encodeURIComponent(file);}}
 const urls={};for(const [path,blob]of Object.entries(draft.assets))urls[base+path]=URL.createObjectURL(blob);
 document.querySelectorAll('img,video,audio,source').forEach(el=>{if(urls[el.getAttribute('src')]){el.src=urls[el.getAttribute('src')];el.removeAttribute('srcset');}});
 const select=document.querySelector('#category'),more=document.querySelector('#load-more');if(select){select.disabled=true;select.title='Filters are available on the published site.';}if(more)more.hidden=true;
}catch(err){document.querySelector('#preview').textContent=err.message;}
