import {base} from './config.js';
function route(){if(location.hash==='#/editor'||location.hash==='#/editor/')location.replace(base+'editor/#/editor');}
route();addEventListener('hashchange',route);

// Bind by delegation so project cards loaded by filters also get video previews.
for(const event of ['pointerover','focusin'])document.addEventListener(event,e=>{const card=e.target.closest?.('.project-card'),video=card?.querySelector('video');if(video&&!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{});});
for(const event of ['pointerout','focusout'])document.addEventListener(event,e=>{const card=e.target.closest?.('.project-card');if(card&&!card.contains(e.relatedTarget)){const video=card.querySelector('video');if(video){video.pause();video.currentTime=0;}}});
