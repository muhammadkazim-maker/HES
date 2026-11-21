/**
 * School Discipline Tracker - Firebase Configuration & Real-Time Connector
 * 
 * Instructions:
 * 1. Create a free project at https://console.firebase.google.com/
 * 2. Enable "Authentication" (Email/Password or Anonymous)
 * 3. Enable "Cloud Firestore" in test mode or production
 * 4. Paste your web app configuration below in `window.FIREBASE_CONFIG`.
 * 
 * If no configuration is provided, the app automatically runs in
 * "Local Real-Time Multi-Client Mode" using BroadcastChannel and IndexedDB,
 * allowing instant multi-tab, multi-device, and multi-user testing without setup!
 */

window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Check if user has entered their custom Firebase keys
window.isFirebaseConfigured = function() {
  const cfg = window.FIREBASE_CONFIG;
  return Boolean(cfg && cfg.apiKey && cfg.projectId && cfg.apiKey.length > 5);
};

// Allow loading saved Firebase configuration from LocalStorage
try {
  const savedConfig = localStorage.getItem('hes_custom_firebase_config');
  if (savedConfig) {
    const parsed = JSON.parse(savedConfig);
    if (parsed && parsed.apiKey) {
      window.FIREBASE_CONFIG = parsed;
    }
  }
} catch (e) {
  console.warn('Could not load custom Firebase config:', e);
}
