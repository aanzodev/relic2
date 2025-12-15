  const firebaseConfig = {
    apiKey: "AIzaSyC7zhMX7XGduwwtV7aH_ehON2eHI5jUenk",
    authDomain: "relic-ultimate.firebaseapp.com",
    databaseURL: "https://relic-ultimate-default-rtdb.firebaseio.com",
    projectId: "relic-ultimate",
    storageBucket: "relic-ultimate.firebasestorage.app",
    messagingSenderId: "1047341587934",
    appId: "1:1047341587934:web:0f40ca1d7a4ca72715114f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get database reference
const database = firebase.database();

console.log('Firebase initialized successfully');

(function() {
  console.log('Firebase real-time user counter initialized');

  // Check if Firebase is available
  if (typeof firebase === 'undefined' || !firebase.database) {
    console.error('Firebase not loaded! Using fallback counter.');
    useFallbackCounter();
    return;
  }

  const db = firebase.database();
  let sessionId = null;
  let userRef = null;
  let isOnline = true;

  // Generate unique session ID
  function generateSessionId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID
  sessionId = sessionStorage.getItem('relicSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('relicSessionId', sessionId);
    console.log('New session created:', sessionId);
  }

  // Reference to this user's presence in Firebase
  userRef = db.ref('online_users/' + sessionId);

  // Reference to count all online users
  const usersRef = db.ref('online_users');

  // Set up presence system
  function setupPresence() {
    // When user connects
    const connectedRef = db.ref('.info/connected');
    
    connectedRef.on('value', function(snapshot) {
      if (snapshot.val() === true) {
        console.log('Connected to Firebase');
        

        userRef.onDisconnect().remove();
        

        userRef.set({
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          sessionId: sessionId
        });

        isOnline = true;
      } else {
        console.log('Disconnected from Firebase');
        isOnline = false;
      }
    });
  }


  function trackUserCount() {
    usersRef.on('value', function(snapshot) {
      const count = snapshot.numChildren();
      updateUserDisplay(count);
      console.log('Current online users:', count);
    });
  }


  function cleanupStaleUsers() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    usersRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const userData = childSnapshot.val();
        if (userData.timestamp < fiveMinutesAgo) {
          childSnapshot.ref.remove();
          console.log('Removed stale user:', childSnapshot.key);
        }
      });
    });
  }

  // Update the display with animation
  function updateUserDisplay(count) {
    const userCountElement = document.getElementById('activeUsers');
    if (!userCountElement) return;

    const currentCount = parseInt(userCountElement.textContent) || 0;
    animateCount(userCountElement, currentCount, count);
  }

  // Animate number changes
  function animateCount(element, start, end) {
    if (start === end) return;

    const duration = 500;
    const startTime = Date.now();
    
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    update();
  }

  // Heartbeat - update timestamp every 30 seconds
  function startHeartbeat() {
    setInterval(function() {
      if (isOnline && userRef) {
        userRef.update({
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        console.log('Heartbeat sent');
      }
    }, 30000); // Every 30 seconds
  }

  // Cleanup stale users every 2 minutes
  setInterval(cleanupStaleUsers, 2 * 60 * 1000);

  // Handle page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      console.log('Page hidden - user still counted as online');
    } else {
      console.log('Page visible - refreshing presence');
      if (userRef) {
        userRef.update({
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    }
  });

  // Handle page unload (try to cleanup, but not guaranteed)
  window.addEventListener('beforeunload', function() {
    if (userRef) {
      // This might not complete before page closes, but Firebase's onDisconnect will handle it
      userRef.remove();
    }
  });

  // Initialize everything
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setupPresence();
        trackUserCount();
        startHeartbeat();
        cleanupStaleUsers();
      });
    } else {
      setupPresence();
      trackUserCount();
      startHeartbeat();
      cleanupStaleUsers();
    }
  }

  init();

  // Fallback counter if Firebase fails
  function useFallbackCounter() {
    let count = 0;
    
    function updateFallback() {
      const baseCount = 25;
      const variance = Math.floor(Math.random() * 15) - 7;
      count = Math.max(1, baseCount + variance);
      
      const el = document.getElementById('activeUsers');
      if (el) {
        const current = parseInt(el.textContent) || 0;
        animateCount(el, current, count);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateFallback);
    } else {
      updateFallback();
    }

    setInterval(updateFallback, 10000);
  }

})();
