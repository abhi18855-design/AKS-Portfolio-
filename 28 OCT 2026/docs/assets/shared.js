import {base as siteBase} from './config.js';
export const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'project';
export const bytes = n => n < 1024*1024 ? `${Math.round(n/1024)} KB` : `${(n/1024/1024).toFixed(1)} MB`;
export const move = (a,from,to) => {if(from<0||to<0||from>=a.length||to>=a.length)return; a.splice(to,0,a.splice(from,1)[0]);};
export function mediaURL(path,base=siteBase) {if(/^https:\/\//.test(path))return path;if(!/^(?:media|images|videos)\/[a-zA-Z0-9_./-]+$/.test(path)||path.includes('..'))throw Error('Invalid media path');return base+path;}
export function validate(c) {
 if(c?.version!==1||!c.site||!Array.isArray(c.projects))throw Error('Unsupported content format');
 for(const key of ['name','role','headline','intro','about','email','contactUrl','contactTitle','contactText','description'])if(typeof c.site[key]!=='string')throw Error(`Missing site field: ${key}`);
 if(c.site.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.site.email))throw Error('Enter a valid contact email');
 if(c.site.contactUrl&&!/^https:\/\/[^\s]+$/.test(c.site.contactUrl))throw Error('Contact link must start with https://');
 if(c.site.phone&&!/^[+()0-9 .-]{5,25}$/.test(c.site.phone))throw Error('Enter a valid phone number');
 for(const link of c.site.socials||[])if(!link.label?.trim()||!/^https:\/\/[^\s]+$/.test(link.url))throw Error('Social links need a name and a full https:// URL');
 const ids=new Set(),slugs=new Set();
 for(const p of c.projects){
 if(!p.id||ids.has(p.id))throw Error('Duplicate project ID'); ids.add(p.id);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||slugs.has(p.slug))throw Error('Each project needs a unique URL slug'); slugs.add(p.slug);
 if(!p.title?.trim())throw Error('Every project needs a title');
 if(!['draft','published'].includes(p.status))throw Error('Invalid publishing status');
 if(!Array.isArray(p.gallery))throw Error('Missing gallery');
 const mids=new Set();for(const m of p.gallery){if(!m.id||mids.has(m.id))throw Error('Duplicate gallery image');mids.add(m.id);mediaURL(m.src);mediaURL(m.thumb);if((m.bytes||0)>3*1024*1024)throw Error('An image exceeds the 3 MB optimized limit');}
 if(p.status==='published'&&p.gallery.length&&!p.gallery.some(m=>m.id===p.cover))throw Error(`Choose a cover image for “${p.title}”`);
 }
 return c;
}
export const publicProjects = c => c.projects.filter(p=>p.status==='published');
export function cover(p){return p.gallery.find(m=>m.id===p.cover)||p.gallery[0];}
export function uniqueSlug(title,projects){let s=slugify(title),i=2,candidate=s;while(projects.some(p=>p.slug===candidate))candidate=`${s}-${i++}`;return candidate;}
