document.addEventListener('DOMContentLoaded', () => {
    // This script now only adds interactivity to the server-rendered page.
    attachEventListeners();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

function attachEventListeners() {
    const page = document.querySelector('.upcoming');
    if (!page) return;

    // Use event delegation for all buttons
    page.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        // Handle different button types
        if (button.classList.contains('remind-btn')) {
            setReminder(button.dataset.movieId, button);
        }
        if (button.classList.contains('details-btn')) {
            showMovieDetails(button.dataset.movieId);
        }
        if (button.classList.contains('trailer-btn')) {
            showTrailer(button.dataset.trailerUrl);
        }
    });

    

    // Handle trailer buttons globally
    document.addEventListener('click', (e) => {
        const trailerBtn = e.target.closest('.trailer-btn, #modalTrailerBtn');
        if (trailerBtn) {
            e.preventDefault();
            const trailerUrl = trailerBtn.dataset.trailerUrl;
            showTrailer(trailerUrl);
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            e.currentTarget.classList.add('active');
            const filter = e.currentTarget.dataset.filter;
            
            document.querySelectorAll('.movie-card').forEach(card => {
                const genres = card.dataset.genres || '';
                card.style.display = (filter === 'all' || genres.includes(filter)) ? 'block' : 'none';
            });
        });
    });

    document.getElementById('fabRemind')?.addEventListener('click', toggleNotificationCenter);
    document.getElementById('closeNotifications')?.addEventListener('click', toggleNotificationCenter);
    document.querySelector('.movie-modal .close-modal')?.addEventListener('click', closeMovieDetails);
}

// --- MODAL, REMINDER, AND COUNTDOWN FUNCTIONS ---

async function showMovieDetails(movieId) {
    if (!movieId) return;
    const modal = document.getElementById('movieModal');
    modal.classList.add('active');
    modal.querySelector('#modalTitle').textContent = 'Loading...';

    try {
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) throw new Error('Details not found.');
        const movie = await response.json();

        modal.querySelector('#modalTitle').textContent = movie.title;
        modal.querySelector('#modalPoster').src = movie.poster_url;
        modal.querySelector('#modalDescription').textContent = movie.description;
        modal.querySelector('#modalReleaseDate').textContent = new Date(movie.release_date).toLocaleDateString();
        modal.querySelector('#modalDuration').textContent = movie.duration;
        modal.querySelector('#modalRating').textContent = movie.rating;
        
        const genresContainer = modal.querySelector('#modalGenres');
        genresContainer.innerHTML = '';
        movie.genres.forEach(g => {
            const tag = document.createElement('span');
            tag.className = 'genre-tag';
            tag.textContent = g;
            genresContainer.appendChild(tag);
        });

        // Wire up buttons inside the modal
        modal.querySelector('#modalRemindBtn').dataset.movieId = movie._id;
        modal.querySelector('#modalTrailerBtn').dataset.trailerUrl = movie.trailer_url;

    } catch (error) {
        modal.querySelector('#modalTitle').textContent = 'Error';
        modal.querySelector('#modalDescription').textContent = error.message;
    }
}

function closeMovieDetails() {
    document.getElementById('movieModal').classList.remove('active');
}

function toggleNotificationCenter() {
    document.getElementById('notificationCenter').classList.toggle('active');
}

async function setReminder(movieId, buttonEl) {
    if (buttonEl.disabled) return;
    buttonEl.disabled = true;
    buttonEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie_id: movieId })
        });
        
        if (response.status === 401) {
            alert('Please log in to set reminders.');
            buttonEl.disabled = false;
            buttonEl.innerHTML = '<i class="fas fa-bell"></i> Remind';
            return;
        }

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed.');
        
        buttonEl.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
        buttonEl.classList.add('active');
        alert('Reminder set successfully!');

    } catch (error) {
        alert(`Error: ${error.message}`);
        buttonEl.disabled = false;
        buttonEl.innerHTML = '<i class="fas fa-bell"></i> Remind';
    }
}

async function updateCountdown() {
    const countdownContainer = document.getElementById('countdown');
    if (!countdownContainer) return;
    try {
        const response = await fetch('/api/movies/upcoming');
        const moviesResponse = await response.json();
        const movies = moviesResponse.data;

        if (!movies || movies.length === 0) return;
        
        const nextReleaseDate = new Date(movies[0].release_date);
        const diff = nextReleaseDate - new Date();

        if (diff < 0) {
            countdownContainer.innerHTML = '<h4>The next release is here!</h4>';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = d.toString().padStart(2, '0');
        document.getElementById('hours').textContent = h.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
    } catch (error) {
        console.error('Failed to update countdown:', error);
    }
}
function showTrailer(trailerUrl) {
  if (!trailerUrl || trailerUrl === 'null' || trailerUrl === 'undefined') {
    showFloatingNotification('Trailer not available for this movie', 'warning');
    return;
  }

  const modal = document.getElementById('trailerModal');
  const container = document.getElementById('trailerContainer');
  const placeholder = container.querySelector('.trailer-placeholder');
  
  // Show loading state
  modal.classList.add('active');
  container.innerHTML = `
    <div class="trailer-placeholder">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading trailer...</p>
    </div>
  `;

  // Extract video ID based on URL type
  const videoId = extractVideoId(trailerUrl);
  
  if (!videoId) {
    container.innerHTML = `
      <div class="trailer-placeholder">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Trailer format not supported</p>
        <p>We only support YouTube trailers at this time</p>
      </div>
    `;
    return;
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  
  container.innerHTML = '';
  container.appendChild(iframe);
  
  setupTrailerControls(iframe);
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /^([^"&?\/\s]{11})$/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function setupTrailerControls(iframe) {
  const muteToggle = document.getElementById('muteToggle');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const closeBtn = document.querySelector('.close-trailer');
  const modal = document.getElementById('trailerModal');
  
  let isMuted = false;
  
  muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    const icon = muteToggle.querySelector('i');
    
    if (isMuted) {
      icon.classList.replace('fa-volume-up', 'fa-volume-mute');
      iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
    } else {
      icon.classList.replace('fa-volume-mute', 'fa-volume-up');
      iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
    }
  });
  
  fullscreenToggle.addEventListener('click', () => {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  });
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    // Pause video when closing
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    modal.classList.remove('active');
  });
  
  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      modal.classList.remove('active');
    }
  });
  
  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      modal.classList.remove('active');
    }
  });
}