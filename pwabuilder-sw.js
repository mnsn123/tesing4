const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
  'https://monsoonmalabar.com/tesing4/',
  'https://monsoonmalabar.com/tesing4/index.html',
  'https://monsoonmalabar.com/tesing4/css/main.css',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/css/mdb.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js',
  'https://monsoonmalabar.com/tesing4/js/jquery.shop.js',
  'https://monsoonmalabar.com/tesing4/logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/js/mdb.min.js',
  'https://monsoonmalabar.com/tesing4/js/style-picker.js',
  'https://monsoonmalabar.com/tesing4/js/s.min.js',
  'https://monsoonmalabar.com/tesing4/js/sw-reg.js',
  'https://monsoonmalabar.com/tesing4/js/infinite.js',
  'https://monsoonmalabar.com/tesing4/pages/fallback/index.html'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 2500);
          return fetchRes;
        })
      });
    }).catch(() => {
      return caches.match('https://monsoonmalabar.com/tesing4/pages/fallback/index.html');
    })
  );
});