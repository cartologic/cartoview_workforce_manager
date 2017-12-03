
    console.log("in test")
console.log("chanhe")
self.addEventListener('install', function (event) {
  /*
   * Task 3b)
   *   Pre-cache known files
   */
  console.log("install")
  var CACHE_NAME = 'my-site-cache-v1';
          var urlsToCache = [
            'cach.html',
            'http://localhost/static/cartoview_workforce_manager/cach.html'
          ];

  
            // Perform install steps
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  console.log('Opened cache');
                  return cache.addAll(urlsToCache);
                })
            );
});
self.addEventListener('activate', function(event) {
  console.log("activa")
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
    console.log("fetch")
  event.respondWith(
    caches.open('my-site-cache-v1').then(function(cache) {
      console.log("cache opened in fetch")
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});