const CACHE='ap-shell',SHELL=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const build=t=>Number((/name="app-build" content="(\d+)"/.exec(t)||[])[1]||0);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.match('index.html').then(hit=>hit?null:c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
async function refreshShell(c){try{const r=await fetch('index.html',{cache:'no-cache'});if(!r.ok)return;const t=await r.clone().text(),hit=await c.match('index.html'),old=hit?build(await hit.text()):0;
 if(build(t)>old){await c.put('index.html',r);(await self.clients.matchAll()).forEach(x=>x.postMessage('app-updated'));}}catch(_e){}}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(c=>c.match('index.html').then(hit=>{if(hit){e.waitUntil(refreshShell(c));return hit;}return fetch(e.request).then(r=>{if(r.ok)c.put('index.html',r.clone());return r;});})));return;}
 e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r;}))));});
self.addEventListener('message',e=>{if(e.data==='check')e.waitUntil(caches.open(CACHE).then(refreshShell));});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{};}catch(_e){d={body:e.data&&e.data.text()};}
 e.waitUntil(self.registration.showNotification(d.title||'언제나 음악학원',{body:d.body||'',tag:d.tag||undefined,icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'./'}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>'focus'in x);if(c)return c.focus();return self.clients.openWindow(e.notification.data&&e.notification.data.url||'./');}));});
