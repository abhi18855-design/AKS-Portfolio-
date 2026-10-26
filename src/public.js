import {card} from './templates.js';
const base='/portfolio/',data=await fetch(base+'catalog.json').then(r=>r.json());let count=12;
const select=document.querySelector('#category'),grid=document.querySelector('#projects'),more=document.querySelector('#load-more');
function render(){const all=data.projects.filter(p=>!select.value||p.category===select.value);grid.innerHTML=all.slice(0,count).map((p,i)=>card(p,base,i)).join('')||'<p>No projects in this discipline yet.</p>';document.querySelector('#result-count').textContent=all.length+' projects';more.hidden=count>=all.length;}
select.addEventListener('change',()=>{count=12;render();});more.addEventListener('click',()=>{count+=12;render();});
