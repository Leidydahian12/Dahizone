'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "c7aab44a8c53c6f1633763f00fcb6f1f",
"assets/AssetManifest.json": "f3e7b393292fd8ff00c6904b9cad82ab",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "a77d311a5e91bd34d7610d3b565835bc",
"assets/lib/Assets/images/Accesorios%2520para%2520fumar.jpg": "4937d67ab3a24d18ad13eb1ae0889334",
"assets/lib/Assets/images/Adidas.png": "a54422b57afd2e88d8d2fb37e24a8af6",
"assets/lib/Assets/images/Alien.png": "ba454ca48bd65f59c1d49faf5bc3647e",
"assets/lib/Assets/images/Boxes.png": "81b744dd33dc0cffefac53451466bd71",
"assets/lib/Assets/images/Cuadro%2520hucha.jpg": "943fb660e4db581618e37e75d0ddeddf",
"assets/lib/Assets/images/Cuadros.png": "5664f6ddab88d7a2da826b18ead33399",
"assets/lib/Assets/images/emot.png": "86e6417dc3c0c0cf02e3a8c49c9c9276",
"assets/lib/Assets/images/Favorite.png": "009cd2c60d1f4ad650e4f36c22aac104",
"assets/lib/Assets/images/Filtros.png": "1708911d92424426cdae26394e9d5f62",
"assets/lib/Assets/images/Jum2.png": "475418aad3ba427959dcbb1c2c20cfec",
"assets/lib/Assets/images/Lamparas%2520led.jpg": "67a76331109134c6f269c4645428db8b",
"assets/lib/Assets/images/llaveross.png": "c88fc53f5e0e788a5c1d8847f9e148a2",
"assets/lib/Assets/images/Logo%2520ne%25C3%25B3n.jpg": "e594455a3ba92e6b2a93a2575a518b49",
"assets/lib/Assets/images/Logo.jpg": "886425df6453041b83d9c87b22c60239",
"assets/lib/Assets/images/Logouuu.png": "c305a40ac177bec56b0a0854ccbedb70",
"assets/lib/Assets/images/Loogoo.jpg": "886425df6453041b83d9c87b22c60239",
"assets/lib/Assets/images/Macetas.jpg": "7a6f3f5e3b0dcacde02e3ad365bd8ab8",
"assets/lib/Assets/images/Moldes.png": "91d35a806ed3ccb5e6505246f0d017d0",
"assets/lib/Assets/images/Nike.png": "a6e07dcb8087c4fbd11cf68c035fb024",
"assets/lib/Assets/images/Ropa.png": "030f33b21315e1907862a30b630faf88",
"assets/lib/Assets/images/Stickers.jpg": "b0b650d2e54c58491959f49c6031f727",
"assets/lib/Assets/images/Toad.png": "fad01ac1e3c61155b985619f3bd87e17",
"assets/lib/Assets/images/Todos%2520los%2520productoss.png": "a7e23c77b7371ebe97da6fc196cbab33",
"assets/NOTICES": "eaae609bd0c74fc30111f64f8ae4e285",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
"canvaskit/canvaskit.wasm": "d9f69e0f428f695dc3d66b3a83a4aa8e",
"canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
"canvaskit/chromium/canvaskit.wasm": "393ec8fb05d94036734f8104fa550a67",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "443bb0381b9c3e915c0f55c05cc1915f",
"/": "443bb0381b9c3e915c0f55c05cc1915f",
"main.dart.js": "472c8182cedfeffef40946f9ff599042",
"manifest.json": "d6bba8307511f87b62c4285558727c25",
"version.json": "7511c518fb7cda15b19ed57747d701e7"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
