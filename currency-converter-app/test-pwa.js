// Simple PWA functionality test
// This script verifies basic PWA setup

console.log("Testing PWA functionality...");

// Test 1: Service Worker Support
if ("serviceWorker" in navigator) {
    console.log("✓ Service Worker supported");
    
    // Test 2: Service Worker Registration
    navigator.serviceWorker.register("/service-worker.js")
        .then(function(registration) {
            console.log("✓ Service Worker registered successfully:", registration.scope);
        })
        .catch(function(error) {
            console.log("✗ Service Worker registration failed:", error);
        });
} else {
    console.log("✗ Service Worker not supported");
}

// Test 3: Manifest Support
if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    console.log("✓ Service Worker active");
} else {
    console.log("ℹ Service Worker not yet active (normal for first load)");
}

// Test 4: Check if running in standalone mode (when installed as PWA)
if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    console.log("✓ Running in standalone mode (PWA installed)");
} else {
    console.log("ℹ Running in browser mode (not installed as PWA yet)");
}

console.log("PWA test complete. Check console for results.");