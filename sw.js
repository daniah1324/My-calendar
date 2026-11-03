const V='juc-v2',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=V).map(k=>caches.delete(k)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url),mine=u.origin==location.origin;
 if(r.method!='GET')return;
 if(!(mine||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)))return;
 e.respondWith(caches.open(V).then(async c=>{
  const hit=await c.match(r);
  const net=fetch(r,mine?{cache:'no-cache'}:undefined).then(res=>{if(res&&(res.ok||res.type=='opaque'))c.put(r,res.clone());return res}).catch(()=>hit||c.match('./index.html'));
  return mine?net:(hit||net);
 }));
});
