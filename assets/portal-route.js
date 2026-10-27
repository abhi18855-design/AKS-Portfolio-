import {base} from './config.js';
function route(){if(location.hash==='#/editor'||location.hash==='#/editor/')location.replace(base+'editor/#/editor');}
route();addEventListener('hashchange',route);
