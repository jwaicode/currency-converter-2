self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      console.error("Fetch failed for:", event.request.url);
      return new Response(
        "Offline. Unable to fetch the requested resource.",
        { status: 503, statusText: "Service Unavailable" }
      );
    })
  );
});