// DOM Elements
const movieList = document.getElementById('movieList');
const foodHighlights = document.getElementById('foodHighlights');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const userAvatar = document.getElementById('userAvatar');
const userDropdown = document.querySelector('.user-dropdown');
const logoutBtn = document.getElementById('logoutBtn');
const trailerModal = document.getElementById('trailer-modal');
const trailerIframe = document.getElementById('trailer-iframe');
const closeModal = document.getElementById('closeModal');
const notificationBell = document.getElementById('notificationBell');
const notificationDropdown = document.getElementById('notificationDropdown');
const notificationItems = document.getElementById('notificationItems');
const notificationCount = document.getElementById('notificationCount');
const markAllReadBtn = document.getElementById('markAllRead');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadNotifications();
    setupEventListeners();
    setupScrollEffects();

    // --- Trailer Button Logic ---
    document.querySelectorAll('.trailer-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const trailerUrl = btn.getAttribute('data-trailer');
            if (!trailerUrl) {
                alert('Trailer not available.');
                return;
            }
            const trailerModal = document.getElementById('trailer-modal');
            const trailerIframe = document.getElementById('trailer-iframe');
            trailerIframe.src = trailerUrl;
            trailerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    // Close modal logic (already present, but ensure it works)
    if (closeModal && trailerModal && trailerIframe) {
        closeModal.addEventListener('click', () => {
            trailerIframe.src = '';
            trailerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        trailerModal.addEventListener('click', (e) => {
            if (e.target === trailerModal) {
                trailerIframe.src = '';
                trailerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Check user login status
function checkLoginStatus() {
    const isLoggedIn = document.body.dataset.loggedIn === 'true';
    
    if (isLoggedIn) {
        const userInitials = document.body.dataset.userInitials || 'US';
        const userName = document.body.dataset.userName || 'User';
        const userEmail = document.body.dataset.userEmail || '';
        
        document.getElementById('avatarInitials').textContent = userInitials;
        document.getElementById('userName').textContent = userName;
        document.getElementById('userEmail').textContent = userEmail;
    }
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch('/api/bookings/my-bookings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (response.status === 401) {
            // User is not logged in, show appropriate message
            if (notificationItems) {
                notificationItems.innerHTML = `
                    <div class="notification-item">
                        <p class="notification-message">Please log in to view your bookings</p>
                    </div>
                `;
            }
            if (notificationCount) {
                notificationCount.textContent = '0';
            }
            return;
        }
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const bookings = await response.json();
        updateNotifications(bookings);
    } catch (error) {
        console.error('Error loading notifications:', error);
        // Show a user-friendly message in the notifications dropdown
        if (notificationItems) {
            notificationItems.innerHTML = `
                <div class="notification-item">
                    <p class="notification-message">Unable to load notifications. Please try again later.</p>
                </div>
            `;
        }
        if (notificationCount) {
            notificationCount.textContent = '0';
        }
    }
}

// Update notifications based on bookings
function updateNotifications(bookings) {
    if (!bookings || bookings.length === 0) {
        notificationItems.innerHTML = `
            <div class="notification-item">
                <p class="notification-message">No notifications yet</p>
            </div>
        `;
        notificationCount.textContent = '0';
        return;
    }
    
    // Create notifications from recent bookings
    const recentBookings = bookings.slice(0, 3);
    notificationItems.innerHTML = recentBookings.map(booking => `
        <div class="notification-item unread">
            <div class="notification-item-header">
                <span class="notification-title">Booking Confirmed</span>
                <span class="notification-time">${formatTime(booking.booking_date)}</span>
            </div>
            <p class="notification-message">
                Your booking for "${booking.showtime.movie.title}" has been confirmed. 
                Showtime: ${new Date(booking.showtime.start_time).toLocaleTimeString()}
            </p>
        </div>
    `).join('');
    
    notificationCount.textContent = recentBookings.length.toString();
}

// Format time for notifications
function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // User dropdown toggle
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // Remove localStorage items
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            // Call backend to clear cookie
            await fetch('/logout', { method: 'POST', credentials: 'include' });
            // Redirect to login page
            window.location.href = '/';
        });
    }

    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Filter buttons
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMovies(btn.dataset.genre);
            });
        });
    }

    // Notification bell toggle
    if (notificationBell && notificationDropdown) {
        notificationBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
    }

    // Mark all notifications as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            if (notificationCount) {
                notificationCount.textContent = '0';
            }
        });
    }

    // Add food items to cart
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-small')) {
            const itemId = e.target.dataset.id;
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ itemId })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    alert(`Added ${data.item.name} to your cart`);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    });
}

// Perform search
function performSearch() {
    const query = searchInput.value.toLowerCase();
    const movies = Array.from(document.querySelectorAll('.movie'));
    
    movies.forEach(movie => {
        const title = movie.querySelector('h3').textContent.toLowerCase();
        const genres = movie.dataset.genres;
        
        if (title.includes(query) || genres.includes(query)) {
            movie.style.display = 'block';
        } else {
            movie.style.display = 'none';
        }
    });
}

// Filter movies by genre
function filterMovies(genre) {
    const movies = Array.from(document.querySelectorAll('.movie'));
    
    movies.forEach(movie => {
        if (genre === 'all' || movie.dataset.genres.includes(genre)) {
            movie.style.display = 'block';
        } else {
            movie.style.display = 'none';
        }
    });
}

// Setup scroll effects
function setupScrollEffects() {
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}