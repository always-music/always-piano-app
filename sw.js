const CACHE='ap-202611101503',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
// 저장된 화면을 바로 띄우고(폰이 막 켜져 통신이 느려도 즉시), 새 버전은 뒤에서 받아 다음 실행 때 적용.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const key=e.request.mode==='navigate'?'index.html':e.request;
 e.respondWith(caches.open(CACHE).then(c=>c.match(key).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok)c.put(key,r.clone());return r;});if(hit){e.waitUntil(net.catch(()=>{}));return hit;}return net.catch(()=>c.match('index.html'));})));});
