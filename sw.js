/* RISE 서비스 워커: 화면 파일(같은 주소의 GET)만 기기에 담아 두고 바로 연다. 서버(앱스 스크립트)로 가는 요청은 건드리지 않는다.
   화면은 담아 둔 것을 먼저 보여 주고, 뒤에서 새 판을 받아 둔다(다음에 열 때 새 판). */
const V='rise-shell-8f0ae81057';
const SHELL=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.indexOf('rise-shell-')===0&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  e.respondWith(caches.open(V).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  })));
});
