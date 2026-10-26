import {bytes} from './shared.js';
export async function optimize(file,quality=.82,maxEdge=1920){
 if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type))throw Error(`${file.name}: use JPEG, PNG, WebP or AVIF. SVG, GIF and HEIC are not supported.`);
 if(!file.size||file.size>40*1024*1024)throw Error(`${file.name}: maximum original size is 40 MB`);
 let bitmap;try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});}catch{throw Error(`${file.name}: image cannot be decoded`);}
 try{if(bitmap.width*bitmap.height>60_000_000)throw Error(`${file.name}: image exceeds 60 megapixels`);
 async function encode(edge,q){const scale=Math.min(1,edge/Math.max(bitmap.width,bitmap.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(bitmap.width*scale));c.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=c.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,c.width,c.height);const blob=await new Promise(r=>c.toBlob(r,'image/webp',q));if(!blob||blob.type!=='image/webp')throw Error('This browser cannot encode WebP. Use a current Chrome, Safari or Firefox.');return {blob,width:c.width,height:c.height};}
 let large=await encode(maxEdge,quality);if(large.blob.size>3*1024*1024)large=await encode(1600,Math.min(quality,.72));
 if(large.blob.size>3*1024*1024)throw Error(`${file.name}: still ${bytes(large.blob.size)} after optimization; choose a smaller image`);
 const thumb=await encode(560,Math.min(quality,.8));return {large:large.blob,thumb:thumb.blob,width:large.width,height:large.height,originalBytes:file.size};
 }finally{bitmap.close();}
}
