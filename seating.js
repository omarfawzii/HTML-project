// State
const state = {
    selectedSeats: [],
    currentMovie: null,
    currentShowtime: null,
    currentAuditorium: null,
    availableShowtimes: [],
    availableAuditoriums: [],
    seatAvailability: [],
    seatPrices: {
        standard: 12,
        vip: 18,
        wheelchair: 10,
        premium: 15,
        love_seat: 25
    },
    loveSeatPairs: {},
    seatMap: null
};

// DOM Elements
const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    errorContainer: document.getElementById('errorContainer'),
    seatingMap: document.getElementById('seatingMap'),
    backButton: document.getElementById('backButton'),
    proceedButton: document.getElementById('proceedButton'),
    showtimeSelector: document.getElementById('showtimeSelector'),
    auditoriumSelector: document.getElementById('auditoriumSelector'),
    screen3d: document.getElementById('screen3d'),
    moviePoster: document.getElementById('movie-poster'),
    movieTitle: document.getElementById('movie-title'),
    movieRating: document.getElementById('movie-rating'),
    movieDuration: document.getElementById('movie-duration'),
    movieGenre: document.getElementById('movie-genre'),
    selectedMovie: document.getElementById('selected-movie'),
    selectedShowtime: document.getElementById('selected-showtime'),
    selectedAuditorium: document.getElementById('selected-auditorium'),
    selectedSeats: document.getElementById('selected-seats'),
    standardCount: document.getElementById('standard-count'),
    standardPrice: document.getElementById('standard-price'),
    vipCount: document.getElementById('vip-count'),
    vipPrice: document.getElementById('vip-price'),
    wheelchairCount: document.getElementById('wheelchair-count'),
    wheelchairPrice: document.getElementById('wheelchair-price'),
    loveSeatCount: document.getElementById('love-seat-count'),
    loveSeatPrice: document.getElementById('love-seat-price'),
    totalPrice: document.getElementById('total-price')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoading();
        
        // Check authentication
        if (!localStorage.getItem('isLoggedIn')) {
            throw new Error('Please login to book tickets');
        }

        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('movie');
        
        if (!movieId) {
            throw new Error('Invalid movie selection');
        }

        // Load initial data
        await loadMovieData(movieId);
        await loadShowtimesForMovie(movieId);
        
        // If URL has showtime parameter, load it
        const showtimeId = urlParams.get('showtime');
        if (showtimeId) {
            await loadShowtimeData(showtimeId);
            await loadAuditoriumData();
            await loadSeatAvailability(showtimeId);
        }

        updateUI();
        setupEventListeners();

    } catch (error) {
        console.error('Initialization error:', error);
        showError(error.message);
        setTimeout(() => window.location.href = 'main.html', 3000);
    } finally {
        hideLoading();
    }
});

// Data loading functions
async function loadMovieData(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}`);
        if (!response.ok) throw new Error('Failed to load movie data');
        
        const movieData = await response.json();
        
        // Enhanced movie object with all database fields
        state.currentMovie = {
            id: movieData.id,
            title: movieData.title,
            description: movieData.description || 'No description available',
            poster_url: movieData.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster',
            backdrop_url: movieData.backdrop_url || 'https://via.placeholder.com/1200x400?text=No+Backdrop',
            rating: movieData.rating || 'N/A',
            duration: movieData.duration || 'N/A',
            genres: movieData.genres || ['General'],
            release_date: movieData.release_date,
            director: movieData.director || 'Unknown',
            cast: movieData.cast || [],
            trailer_url: movieData.trailer_url,
            is_featured: movieData.is_featured || false
        };
        
    } catch (error) {
        console.error('Error loading movie:', error);
        throw error;
    }
}

async function loadShowtimesForMovie(movieId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/showtimes?movie_id=${movieId}`);
        if (!response.ok) throw new Error('Failed to load showtimes');
        
        state.availableShowtimes = await response.json();
        renderShowtimeSelector();
        
        // If we have showtimes but none selected, select the first one
        if (state.availableShowtimes.length > 0 && !state.currentShowtime) {
            await selectShowtime(state.availableShowtimes[0].id);
        }
    } catch (error) {
        console.error('Error loading showtimes:', error);
        throw error;
    }
}

async function selectShowtime(showtimeId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/api/showtimes/${showtimeId}`);
        if (!response.ok) throw new Error('Failed to load showtime data');
        
        state.currentShowtime = await response.json();
        await loadAuditoriumsForShowtime(showtimeId);
        updateUI();
    } catch (error) {
        console.error('Error selecting showtime:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadAuditoriumsForShowtime(showtimeId) {
    try {
        // First get the auditorium for this showtime
        const showtimeResponse = await fetch(`${API_BASE_URL}/api/showtimes/${showtimeId}`);
        if (!showtimeResponse.ok) throw new Error('Failed to load showtime data');
        
        const showtime = await showtimeResponse.json();
        
        // Then get all auditoriums for the cinema
        const response = await fetch(`${API_BASE_URL}/api/auditoriums`);
        if (!response.ok) throw new Error('Failed to load auditoriums');
        
        const allAuditoriums = await response.json();
        
        // Find the current auditorium and others of the same type
        const currentAuditorium = allAuditoriums.find(a => a.id === showtime.auditorium_id);
        state.availableAuditoriums = allAuditoriums.filter(a => a.type === currentAuditorium.type);
        
        // Set current auditorium
        state.currentAuditorium = currentAuditorium;
        
        renderAuditoriumSelector();
        await loadSeatAvailability(showtimeId);
    } catch (error) {
        console.error('Error loading auditoriums:', error);
        throw error;
    }
}

async function selectAuditorium(auditoriumId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/api/auditoriums/${auditoriumId}`);
        if (!response.ok) throw new Error('Failed to load auditorium data');
        
        const auditoriumData = await response.json();
        
        // Enhanced auditorium object with all database fields
        state.currentAuditorium = {
            id: auditoriumData.id,
            name: auditoriumData.name,
            type: auditoriumData.type,
            capacity: auditoriumData.capacity,
            rows: auditoriumData.rows,
            seats_per_row: auditoriumData.seats_per_row,
            vip_rows: auditoriumData.vip_rows,
            wheelchair_seats: auditoriumData.wheelchair_seats,
            has_3d: auditoriumData.has_3d,
            has_dolby: auditoriumData.has_dolby,
            seat_map: auditoriumData.seat_map,
            features: auditoriumData.features || []
        };
        
        // Parse seat map if available
        if (state.currentAuditorium.seat_map) {
            try {
                state.seatMap = state.currentAuditorium.seat_map;
            } catch (e) {
                console.error('Error parsing seat map:', e);
                state.seatMap = null;
            }
        }
        
        await loadSeatAvailability(state.currentShowtime.id);
        updateUI();
    } catch (error) {
        console.error('Error selecting auditorium:', error);
        throw error;
    } finally {
        hideLoading();
    }
}

async function loadSeatAvailability(showtimeId) {
    try {
        if (!state.currentAuditorium) return;
        
        const response = await fetch(
            `${API_BASE_URL}/api/seat_availability?showtime_id=${showtimeId}&auditorium_id=${state.currentAuditorium.id}`
        );
        
        if (!response.ok) throw new Error('Failed to load seat availability');
        
        const availabilityData = await response.json();
        
        // Process seat availability data
        state.seatAvailability = availabilityData.map(seat => ({
            id: seat.id,
            showtime_id: seat.showtime_id,
            auditorium_id: seat.auditorium_id,
            seat_number: seat.seat_number,
            status: seat.status,
            booking_id: seat.booking_id,
            reserved_until: seat.reserved_until
        }));
        
        // Check bookings to mark occupied seats
        await checkBookingsForOccupiedSeats(showtimeId);
        
        identifyLoveSeatPairs();
        generateSeatMap();
        
    } catch (error) {
        console.error('Error loading seat availability:', error);
        throw error;
    }
}

async function checkBookingsForOccupiedSeats(showtimeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/bookings?showtime_id=${showtimeId}`);
        if (!response.ok) return;
        
        const bookings = await response.json();
        
        // Mark seats as occupied from confirmed bookings
        bookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const seats = booking.seats.split(',');
                seats.forEach(seatNumber => {
                    const seat = state.seatAvailability.find(s => s.seat_number === seatNumber);
                    if (seat) {
                        seat.status = 'occupied';
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('Error checking bookings:', error);
    }
}

function identifyLoveSeatPairs() {
    state.loveSeatPairs = {};
    
    // Check if auditorium has love seats in features
    if (state.currentAuditorium.features && state.currentAuditorium.features.love_seats) {
        state.currentAuditorium.features.love_seats.forEach(pair => {
            const [seat1, seat2] = pair.split(',');
            state.loveSeatPairs[seat1] = seat2;
            state.loveSeatPairs[seat2] = seat1;
        });
        return;
    }
    
    // Fallback: Group seats by number (ignoring row letter)
    const seatsByNumber = {};
    
    state.seatAvailability.forEach(seat => {
        const seatNumber = seat.seat_number.substring(1); // Get number part
        if (!seatsByNumber[seatNumber]) {
            seatsByNumber[seatNumber] = [];
        }
        seatsByNumber[seatNumber].push(seat.seat_number);
    });
    
    // Find pairs (where two seats share the same number)
    for (const [number, seats] of Object.entries(seatsByNumber)) {
        if (seats.length === 2) {
            state.loveSeatPairs[seats[0]] = seats[1];
            state.loveSeatPairs[seats[1]] = seats[0];
        }
    }
}

// UI Rendering functions
function renderShowtimeSelector() {
    if (!state.availableShowtimes || state.availableShowtimes.length === 0) {
        elements.showtimeSelector.innerHTML = '<div class="error-message">No showtimes available</div>';
        return;
    }
    
    elements.showtimeSelector.innerHTML = state.availableShowtimes.map(showtime => `
        <div class="showtime-option ${state.currentShowtime?.id === showtime.id ? 'active' : ''}" 
             data-id="${showtime.id}">
            <div class="showtime-time">${formatTime(showtime.time)}</div>
            <div class="showtime-date">${formatDate(showtime.date)}</div>
            <div class="showtime-auditorium">${showtime.auditorium_name}</div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.showtime-option').forEach(option => {
        option.addEventListener('click', async () => {
            if (option.classList.contains('active')) return;
            
            const showtimeId = option.dataset.id;
            await selectShowtime(showtimeId);
        });
    });
}

function renderAuditoriumSelector() {
    if (!state.availableAuditoriums || state.availableAuditoriums.length === 0) {
        elements.auditoriumSelector.innerHTML = '<div class="error-message">No auditoriums available</div>';
        return;
    }
    
    elements.auditoriumSelector.innerHTML = state.availableAuditoriums.map(auditorium => `
        <div class="auditorium-option ${state.currentAuditorium?.id === auditorium.id ? 'active' : ''}" 
             data-id="${auditorium.id}">
            <div class="auditorium-name">${auditorium.name}</div>
            <div class="auditorium-features">
                ${auditorium.type === 'vip' ? '<span class="feature-tag">VIP</span>' : ''}
                ${auditorium.has_3d ? '<span class="feature-tag">3D</span>' : ''}
                ${auditorium.has_dolby ? '<span class="feature-tag">Dolby</span>' : ''}
                ${auditorium.wheelchair_accessible ? '<span class="feature-tag">♿</span>' : ''}
            </div>
            <div class="auditorium-capacity">${auditorium.capacity} seats</div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.auditorium-option').forEach(option => {
        option.addEventListener('click', async () => {
            if (option.classList.contains('active')) return;
            
            const auditoriumId = option.dataset.id;
            await selectAuditorium(auditoriumId);
        });
    });
}

function generateSeatMap() {
    elements.seatingMap.innerHTML = '';
    
    if (!state.currentAuditorium) {
        showError('No auditorium data available');
        return;
    }
    
    // Add screen element
    const screen = document.createElement('div');
    screen.className = 'screen';
    screen.textContent = 'SCREEN';
    elements.seatingMap.appendChild(screen);
    
    // Use seat map from auditorium if available
    if (state.seatMap) {
        generateSeatMapFromConfig();
    } else {
        generateDefaultSeatMap();
    }
}

function generateSeatMapFromConfig() {
    state.seatMap.rows.forEach(rowConfig => {
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        
        // Add row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = rowConfig.label;
        seatRow.appendChild(rowLabel);
        
        // Generate seats according to configuration
        rowConfig.seats.forEach(seatConfig => {
            if (seatConfig.type === 'empty') {
                // Add empty space
                const emptySpace = document.createElement('div');
                emptySpace.className = 'seat-empty';
                emptySpace.style.width = `${seatConfig.width || 30}px`;
                seatRow.appendChild(emptySpace);
                return;
            }
            
            const seatId = `${rowConfig.label}${seatConfig.number}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.id = seatId;
            
            // Add seat type class
            seat.classList.add(seatConfig.type);
            
            // Check if this is a love seat
            if (state.loveSeatPairs[seatId]) {
                seat.classList.add('love-seat');
            }
            
            // Check seat availability
            const seatData = state.seatAvailability.find(s => s.seat_number === seatId);
            if (seatData) {
                if (seatData.status === 'occupied') {
                    seat.classList.add('occupied');
                } else if (seatData.status === 'reserved') {
                    seat.classList.add('reserved');
                } else {
                    seat.addEventListener('click', () => toggleSeatSelection(seatId));
                }
            }
            
            // Add seat number if configured to show
            if (seatConfig.show_number) {
                const seatLabel = document.createElement('div');
                seatLabel.className = 'seat-label';
                seatLabel.textContent = seatConfig.number;
                seat.appendChild(seatLabel);
            }
            
            seatRow.appendChild(seat);
        });
        
        elements.seatingMap.appendChild(seatRow);
    });
}

function generateDefaultSeatMap() {
    // Fallback to default seat map generation if no config available
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, state.currentAuditorium.rows);
    
    rowLetters.forEach(row => {
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        
        // Add row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        seatRow.appendChild(rowLabel);
        
        // Generate seats
        for (let i = 1; i <= state.currentAuditorium.seats_per_row; i++) {
            const seatId = `${row}${i}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.id = seatId;
            
            // Check seat availability and type
            const seatData = state.seatAvailability.find(s => s.seat_number === seatId);
            const isVip = state.currentAuditorium.vip_rows && 
                         state.currentAuditorium.vip_rows.split(',').includes(row);
            const isWheelchair = state.currentAuditorium.wheelchair_seats && 
                               state.currentAuditorium.wheelchair_seats.split(',').includes(seatId);
            const isLoveSeat = state.loveSeatPairs[seatId];
            
            // Set seat status and type
            if (seatData) {
                if (seatData.status === 'occupied') {
                    seat.classList.add('occupied');
                } else if (seatData.status === 'reserved') {
                    seat.classList.add('reserved');
                } else {
                    if (isVip) seat.classList.add('vip');
                    if (isWheelchair) seat.classList.add('wheelchair');
                    if (isLoveSeat) seat.classList.add('love-seat');
                    seat.addEventListener('click', () => toggleSeatSelection(seatId));
                }
            }
            
            // Add seat label for first and last seats
            if (i === 1 || i === state.currentAuditorium.seats_per_row) {
                const seatLabel = document.createElement('div');
                seatLabel.className = 'seat-label';
                seatLabel.textContent = i;
                seat.appendChild(seatLabel);
            }
            
            seatRow.appendChild(seat);
        }
        
        elements.seatingMap.appendChild(seatRow);
    });
}

function toggleSeatSelection(seatId) {
    const seat = document.getElementById(seatId);
    const index = state.selectedSeats.indexOf(seatId);
    
    if (index === -1) {
        // Select seat
        state.selectedSeats.push(seatId);
        seat.classList.add('selected');
        
        // If this is a love seat, select its pair automatically
        if (state.loveSeatPairs[seatId]) {
            const pairSeatId = state.loveSeatPairs[seatId];
            if (!state.selectedSeats.includes(pairSeatId)) {
                state.selectedSeats.push(pairSeatId);
                document.getElementById(pairSeatId).classList.add('selected');
            }
        }
    } else {
        // Deselect seat
        state.selectedSeats.splice(index, 1);
        seat.classList.remove('selected');
        
        // If this is a love seat, deselect its pair automatically
        if (state.loveSeatPairs[seatId]) {
            const pairIndex = state.selectedSeats.indexOf(state.loveSeatPairs[seatId]);
            if (pairIndex !== -1) {
                state.selectedSeats.splice(pairIndex, 1);
                document.getElementById(state.loveSeatPairs[seatId]).classList.remove('selected');
            }
        }
    }
    
    updateBookingSummary();
}

function updateBookingSummary() {
    const standardSeats = state.selectedSeats.filter(id => {
        const seat = document.getElementById(id);
        return !seat.classList.contains('vip') && 
               !seat.classList.contains('wheelchair') && 
               !seat.classList.contains('love-seat');
    });
    
    const vipSeats = state.selectedSeats.filter(id => 
        document.getElementById(id).classList.contains('vip') && 
        !document.getElementById(id).classList.contains('love-seat')
    );
    
    const wheelchairSeats = state.selectedSeats.filter(id => 
        document.getElementById(id).classList.contains('wheelchair')
    );
    
    const loveSeats = state.selectedSeats.filter(id => 
        document.getElementById(id).classList.contains('love-seat')
    );
    
    const standardTotal = standardSeats.length * state.seatPrices.standard;
    const vipTotal = vipSeats.length * state.seatPrices.vip;
    const wheelchairTotal = wheelchairSeats.length * state.seatPrices.wheelchair;
    const loveSeatTotal = (loveSeats.length / 2) * state.seatPrices.love_seat; // Divide by 2 since they're pairs
    const total = standardTotal + vipTotal + wheelchairTotal + loveSeatTotal;
    
    // Update UI
    elements.selectedMovie.textContent = state.currentMovie?.title || 'None';
    elements.selectedShowtime.textContent = state.currentShowtime ? 
        `${formatDate(state.currentShowtime.date)} at ${formatTime(state.currentShowtime.time)}` : 'None';
    elements.selectedAuditorium.textContent = state.currentAuditorium?.name || 'None';
    elements.selectedSeats.textContent = state.selectedSeats.join(', ') || 'None';
    elements.standardCount.textContent = standardSeats.length;
    elements.standardPrice.textContent = standardTotal.toFixed(2);
    elements.vipCount.textContent = vipSeats.length;
    elements.vipPrice.textContent = vipTotal.toFixed(2);
    elements.wheelchairCount.textContent = wheelchairSeats.length;
    elements.wheelchairPrice.textContent = wheelchairTotal.toFixed(2);
    elements.loveSeatCount.textContent = (loveSeats.length / 2);
    elements.loveSeatPrice.textContent = loveSeatTotal.toFixed(2);
    elements.totalPrice.textContent = total.toFixed(2);
    
    // Enable/disable proceed button
    elements.proceedButton.disabled = state.selectedSeats.length === 0;
}

function updateUI() {
    // Update movie info
    if (state.currentMovie) {
        elements.movieTitle.textContent = state.currentMovie.title;
        elements.moviePoster.src = state.currentMovie.poster_url || 'https://via.placeholder.com/180x270?text=No+Poster';
        elements.movieRating.innerHTML = `<i class="fas fa-star"></i> ${state.currentMovie.rating || 'N/A'}`;
        elements.movieDuration.innerHTML = `<i class="far fa-clock"></i> ${state.currentMovie.duration || 'N/A'}`;
        elements.movieGenre.textContent = state.currentMovie.genres ? state.currentMovie.genres.join(', ') : 'N/A';
    }

    // Update screen display based on auditorium features
    if (state.currentAuditorium) {
        let screenText = 'SCREEN';
        if (state.currentAuditorium.has_3d) screenText += ' | 3D';
        if (state.currentAuditorium.has_dolby) screenText += ' | DOLBY';
        elements.screen3d.textContent = screenText;
    }

    // Update selectors
    renderShowtimeSelector();
    renderAuditoriumSelector();
}

// Event handlers
function setupEventListeners() {
    elements.backButton.addEventListener('click', () => {
        window.history.back();
    });

    elements.proceedButton.addEventListener('click', processBooking);
}

async function processBooking() {
    const buttonText = elements.proceedButton.innerHTML;
    
    try {
        showLoading();
        elements.proceedButton.disabled = true;
        elements.proceedButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Create booking payload
        const bookingData = {
            movie_id: state.currentMovie.id,
            showtime_id: state.currentShowtime.id,
            auditorium_id: state.currentAuditorium.id,
            seats: state.selectedSeats,
            total: parseFloat(elements.totalPrice.textContent)
        };
        
        // Send booking to server
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create booking');
        }
        
        const bookingResult = await response.json();
        
        // Save booking reference for confirmation page
        localStorage.setItem('currentBooking', JSON.stringify({
            ...bookingData,
            booking_reference: bookingResult.bookingReference,
            movie_title: state.currentMovie.title,
            poster_url: state.currentMovie.poster_url,
            showtime: `${state.currentShowtime.date} ${state.currentShowtime.time}`,
            auditorium: state.currentAuditorium.name,
            seat_details: state.selectedSeats.map(seatId => ({
                seat_number: seatId,
                type: getSeatType(seatId),
                price: getSeatPrice(seatId)
            }))
        }));
        
        // Redirect to confirmation
        window.location.href = 'confirmation.html';
        
    } catch (error) {
        console.error('Booking error:', error);
        showError('Booking failed. Please try again.');
    } finally {
        hideLoading();
        elements.proceedButton.disabled = false;
        elements.proceedButton.innerHTML = buttonText;
    }
}

function getSeatType(seatId) {
    const seat = document.getElementById(seatId);
    if (seat.classList.contains('vip')) return 'vip';
    if (seat.classList.contains('wheelchair')) return 'wheelchair';
    if (seat.classList.contains('love-seat')) return 'love_seat';
    return 'standard';
}

function getSeatPrice(seatId) {
    const type = getSeatType(seatId);
    return state.seatPrices[type] || state.seatPrices.standard;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showError(message) {
    elements.errorContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
    `;
    elements.errorContainer.style.display = 'block';
}

const API_BASE_URL = 'http://localhost:3000';