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

    // Modal and Notification Center listeners
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
    if (!trailerUrl || trailerUrl.includes('null')) {
        return alert('Trailer not available.');
    }
    alert(`Showing trailer: ${trailerUrl}`);
    // You can implement a more sophisticated trailer modal here
}