const CACHE_NAME = 'pypocket-v2';
const urlsToCache = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,600;1,400&family=Outfit:wght@400;600;700;900&display=swap',
  // Pyodide 로딩에 필요한 핵심 리소스들을 명시적으로 캐싱 (오프라인 실행 지원)
  'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.asm.js',
  'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/python_stdlib.zip'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // 이전 버전의 캐시가 있다면 제거하여 최신 파일을 유지
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시를 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      })
  );
});