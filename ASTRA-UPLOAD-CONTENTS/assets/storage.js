const name='astra-editor:'+new URL('../',import.meta.url).pathname;
let dbPromise;
export function db(){return dbPromise ||= new Promise((resolve,reject)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>{r.result.createObjectStore('state');r.result.createObjectStore('media');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function read(store,key){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(store).objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function write(store,key,value){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).put(value,key);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Storage transaction aborted'));});}
export async function remove(store,key){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).delete(key);t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
export async function keys(store){const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(store).objectStore(store).getAllKeys();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function persist(){return navigator.storage?.persist?await navigator.storage.persist():false;}
