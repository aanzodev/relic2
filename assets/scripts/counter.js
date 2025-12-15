// Live User Counter Implementation
(function() {
  console.log('User counter workionh ok');

  // Generate a unique session ID for this user
  function generateSessionId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID
  let sessionId = sessionStorage.getItem('relicSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('relicSessionId', sessionId);
    console.log('New session created:', sessionId);
  }

  let activeUserCount = 0;

  function updateUserCount() {
    // Simulate online users (between 18-40)
    // Replace this with actual Firebase implementation for real-time tracking
    const baseCount = 25;
    const variance = Math.floor(Math.random() * 15) - 7;
    activeUserCount = Math.max(1, baseCount + variance);
    
    const userCountElement = document.getElementById('activeUsers');
    if (userCountElement) {
      // Animate the number change
      const currentCount = parseInt(userCountElement.textContent) || 0;
      animateCount(userCountElement, currentCount, activeUserCount);
    }
  }

  function animateCount(element, start, end) {
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

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateUserCount();
    });
  } else {
    updateUserCount();
  }

  // Update every 10 seconds
  setInterval(updateUserCount, 10000);

  // Update when page becomes visible
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      updateUserCount();
    }
  });

  // Optional: Heartbeat to maintain session
  setInterval(function() {
    console.log('Session active:', sessionId);
  }, 30000); // Every 30 seconds

})();
