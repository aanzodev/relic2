// Daily Game Feature
(function() {
  'use strict';

  // Get daily game based on date
  function getDailyGame() {
    if (typeof games === 'undefined' || !games || games.length === 0) {
      console.warn('Games array not available for daily game');
      return null;
    }

    // Use current date as seed for consistent daily selection
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Simple hash function to convert date to index
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash = hash & hash;
    }
    
    const index = Math.abs(hash) % games.length;
    return games[index];
  }

  // Get countdown to next day
  function getCountdownToNextDay() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Format date for display
  function formatDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const date = today.getDate();
    
    return `${dayName}, ${monthName} ${date}`;
  }

  // Create and render daily game card
  function renderDailyGame() {
    const dailyGame = getDailyGame();
    
    if (!dailyGame) {
      console.warn('Could not get daily game');
      return;
    }

    // Check if card already exists
    let card = document.getElementById('daily-game-card');
    
    if (!card) {
      card = document.createElement('div');
      card.id = 'daily-game-card';
      card.className = 'daily-game-card';
      document.body.appendChild(card);
    }

    // Build card HTML
    card.innerHTML = `
      <div class="daily-game-header">
        <svg class="daily-game-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <div>
          <h3 class="daily-game-title">Daily Game</h3>
          <div class="daily-game-date">${formatDate()}</div>
        </div>
      </div>
      
      <img src="${dailyGame.image}" alt="${dailyGame.name}" class="daily-game-image" />
      
      <h4 class="daily-game-name">${dailyGame.name}</h4>
      <p class="daily-game-description">${dailyGame.description || 'Play this featured game of the day!'}</p>
      
      <button class="daily-game-play-btn" data-game-id="${dailyGame.id}">
        Play Now
      </button>
      
      <div class="daily-game-countdown">
        <span class="countdown-label">Next in:</span>
        <span class="countdown-time" id="daily-countdown">${getCountdownToNextDay()}</span>
      </div>
    `;

    // Add click handler for play button
    const playBtn = card.querySelector('.daily-game-play-btn');
    playBtn.addEventListener('click', function() {
      if (typeof playGame === 'function') {
        playGame(dailyGame);
      } else {
        console.warn('playGame function not available');
      }
    });

    // Update countdown every second
    updateCountdown();
  }

  // Update countdown timer
  function updateCountdown() {
    const countdownEl = document.getElementById('daily-countdown');
    
    if (countdownEl) {
      countdownEl.textContent = getCountdownToNextDay();
    }
    
    setTimeout(updateCountdown, 1000);
  }

  // Initialize when DOM is ready
  function init() {
    // Wait a bit to ensure games array is loaded
    if (typeof games === 'undefined' || !games || games.length === 0) {
      console.log('Waiting for games to load...');
      setTimeout(init, 500);
      return;
    }
    
    renderDailyGame();
    console.log('Daily game feature initialized');
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Refresh daily game at midnight
  function checkForNewDay() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      renderDailyGame();
    }
  }

  setInterval(checkForNewDay, 60000); // Check every minute

})();