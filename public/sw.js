self.addEventListener('install', (event) => {
  console.log('Service Worker instalado.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado.');
});

self.addEventListener('fetch', (event) => {
  // Estratégia simples de Network-First ou bypass para manter funcionamento online
  event.respondWith(fetch(event.request).catch(() => new Response('Você está offline.')));
});
