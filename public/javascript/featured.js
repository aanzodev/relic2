(function() {
  'use strict';


  function toggleFeaturedVideo(page) {
    const featured = document.querySelector('.featured');
    if (!featured) return;
    
    if (page === 'home') {
      featured.style.display = 'block';
    } else {
      featured.style.display = 'none';
    }
  }


  function initFeaturedController() {

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        toggleFeaturedVideo(page);
      });
    });


    const backButtons = [
      document.getElementById('backToHomeApps'),
      document.getElementById('backToHomeGame'),
      document.getElementById('backToHomeWebsites')
    ];

    backButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', function() {
          toggleFeaturedVideo('home');
        });
      }
    });
  }


  document.addEventListener('DOMContentLoaded', function() {
    toggleFeaturedVideo('home');
    

    initFeaturedController();
  });


  window.toggleFeaturedVideo = toggleFeaturedVideo;
})();