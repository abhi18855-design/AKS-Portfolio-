import {base} from './config.js';
import {mountProjects} from './projects-view.js';
try{
 const response=await fetch(base+'catalog.json',{cache:'no-store'});if(!response.ok)throw Error('Could not load all projects.');
 mountProjects(await response.json());
}catch(error){const more=document.querySelector('#load-more');if(more){more.hidden=false;more.textContent='Retry loading projects';more.addEventListener('click',()=>location.reload());}console.error(error);}
