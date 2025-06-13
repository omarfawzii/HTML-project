document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let currentReminders = [];

    // --- DOM ELEMENTS ---
    const reminderBell = document.getElementById('fabRemind');
    const notificationCenter = document.getElementById('notificationCenter');
    const reminderCount = document.getElementById('reminderCount');
    const notificationList = document.getElementById('notificationList');
    const movieModal = document.getElementById('movieModal');

    // --- INITIALIZATION ---
    function initialize() {
        checkLoginStatus();
        attachEventListeners();
        updateCountdown();
        setInterval(updateCountdown, 1000);
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loadReminders();
        }
    }

    // --- EVENT LISTENERS ---
    function attachEventListeners() {
        // Use event delegation for movie cards
        const moviesGrid = document.querySelector('.movies-grid');
        moviesGrid?.addEventListener('click', handleMovieCardClick);

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', handleCategoryFilter);
        });

        // Modals and notifications
        reminderBell?.addEventListener('click', toggleNotificationCenter);
        notificationCenter?.querySelector('.close-notifications')?.addEventListener('click', toggleNotificationCenter);
        movieModal?.querySelector('.close-modal')?.addEventListener('click', () => movieModal.classList.remove('active'));
        
        // Featured movie buttons
        const featuredRemindBtn = document.getElementById('featured-remind-btn');
        const featuredDetailsBtn = document.getElementById('featured-details-btn');
        const featuredTrailerBtn = document.querySelector('.featured-actions .btn-outline[onclick]');

        featuredRemindBtn?.addEventListener('click', () => setReminder(featuredRemindBtn.dataset.movieId));
        featuredDetailsBtn?.addEventListener('click', () => showMovieDetails(featuredDetailsBtn.dataset.movieId));
        if (featuredTrailerBtn) {
            const trailerUrl = featuredTrailerBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
            featuredTrailerBtn.addEventListener('click', () => showTrailer(trailerUrl));
        }
    }

    // --- EVENT HANDLERS ---
    function handleMovieCardClick(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const movieId = button.dataset.movieId;
        if (button.textContent.includes('Remind')) {
            setReminder(movieId, button);
        } else if (button.textContent.includes('Details')) {
            showMovieDetails(movieId);
        }
    }
    
    function handleCategoryFilter(e) {
        const selectedCategory = e.currentTarget.dataset.filter;
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        e.currentTarget.classList.add('active');
        document.querySelectorAll('.movie-card').forEach(card => {
            const genres = card.dataset.genres || '';
            card.style.display = (selectedCategory === 'all' || genres.includes(selectedCategory)) ? 'block' : 'none';
        });
    }

    function checkLoginStatus() { /* ... same as before ... */ }

    // --- MOVIE DETAILS MODAL ---
    async function showMovieDetails(movieId) {
        if (!movieId) return;
        movieModal.classList.add('active');
        movieModal.querySelector('#modalTitle').textContent = 'Loading...';

        try {
            const response = await fetch(`/api/movies/${movieId}`);
            if (!response.ok) throw new Error('Movie details not found.');
            const movie = await response.json();

            movieModal.querySelector('#modalTitle').textContent = movie.title;
            movieModal.querySelector('#modalPoster').src = movie.poster_url;
            movieModal.querySelector('#modalDescription').textContent = movie.description;
            // ... populate other fields like rating, duration, genres ...

        } catch (error) {
            movieModal.querySelector('#modalTitle').textContent = 'Error';
            movieModal.querySelector('#modalDescription').textContent = error.message;
        }
    }

    // --- TRAILER MODAL ---
    function showTrailer(trailerUrl) { /* ... same as before ... */ }

    // --- REMINDER SYSTEM ---
    async function loadReminders() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch('/api/reminders', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Could not fetch reminders.');
            currentReminders = await response.json();
            updateReminderUI();
        } catch (error) {
            console.error(error);
        }
    }

    async function setReminder(movieId, button) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to set reminders.');
            return;
        }
        
        // Prevent multiple clicks
        if(button) button.disabled = true;

        try {
            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ movie_id: movieId })
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error);
            
            alert('Reminder set successfully!');
            loadReminders(); // Refresh the reminder list

        } catch (error) {
            alert(error.message);
        } finally {
            if(button) button.disabled = false;
        }
    }
    
    async function removeReminder(reminderId) {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`/api/reminders/${reminderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not remove reminder.');
            
            alert('Reminder removed.');
            loadReminders(); // Refresh list

        } catch (error) {
            alert(error.message);
        }
    }

    function updateReminderUI() {
        reminderCount.textContent = currentReminders.length;
        reminderCount.style.display = currentReminders.length > 0 ? 'flex' : 'none';
        
        if (currentReminders.length === 0) {
            notificationList.innerHTML = `<div class="notification-item"><p>No reminders set.</p></div>`;
            return;
        }

        notificationList.innerHTML = currentReminders.map(reminder => `
            <div class="notification-item">
                <img src="${reminder.poster_url}" class="notification-poster" alt="">
                <div class="notification-content">
                    <h4>${reminder.title}</h4>
                    <p>Releasing on: ${new Date(reminder.release_date).toLocaleDateString()}</p>
                    <button class="btn btn-danger btn-sm" data-reminder-id="${reminder.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for new remove buttons
        notificationList.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => removeReminder(btn.dataset.reminderId));
        });
    }

    function toggleNotificationCenter() {
        notificationCenter.classList.toggle('active');
    }

async function updateCountdown() {
    const countdownContainer = document.getElementById('countdown');
    if (!countdownContainer) return;

    try {
        // This API call gets all upcoming movies to find the next release.
        const response = await fetch('/api/movies/upcoming');
        if (!response.ok) return;

        const { data: movies } = await response.json();
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
        document.querySelector('.countdown-title').innerHTML = `Next Release: <strong>${movies[0].title}</strong>`;

    } catch (error) {
        console.error('Failed to update countdown:', error);
    }
}

function showTrailer(trailerUrl) {
    if (!trailerUrl || trailerUrl.includes('null')) {
        alert('Trailer not available.');
        return;
    }

    // Correctly extract YouTube video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trailerUrl.match(youtubeRegex);
    const videoId = match ? match[1] : null;

    if (!videoId) {
        alert('Invalid trailer link.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'trailer-modal';
    modal.innerHTML = `
        <div class="trailer-content">
             <span class="close-trailer">&times;</span>
             <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>`;
    
    document.body.appendChild(modal);

    modal.querySelector('.close-trailer').addEventListener('click', () => {
        modal.remove();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    // End of showTrailer
}

// End of DOMContentLoaded event listener
});