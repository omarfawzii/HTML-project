// public/js/seating.js
document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const state = {
        selectedSeats: [],
        seatAvailability: initialState.seatAvailability || [],
        isProcessing: false,
    };

    // --- DOM ELEMENTS ---
    const seatingMap = document.getElementById('seatingMap');
    const proceedButton = document.getElementById('proceedButton');

    // --- INITIALIZATION ---
    function initialize() {
        if (!initialState.currentShowtime || !initialState.currentShowtime.auditorium) {
            seatingMap.innerHTML = '<div class="error-message">Could not load auditorium data.</div>';
            return;
        }
        generateSeatMap();
        updateBookingSummary();
        proceedButton.addEventListener('click', processBooking);
    }

    // --- SEAT MAP GENERATION ---
    function generateSeatMap() {
        const auditorium = initialState.currentShowtime.auditorium;
        seatingMap.innerHTML = ''; // Clear previous map

        if (!auditorium || !auditorium.seat_map || !Array.isArray(auditorium.seat_map.rows)) {
            seatingMap.innerHTML = '<div class="error-message">No seat map available for this auditorium.</div>';
            return;
        }

        auditorium.seat_map.rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            const rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = row.label;
            rowDiv.appendChild(rowLabel);

            row.seats.forEach(seatInfo => {
                const seatId = `${row.label}${seatInfo.number}`;
                const seatDiv = document.createElement('div');
                seatDiv.className = `seat ${seatInfo.type}`;
                seatDiv.id = seatId;

                const availability = state.seatAvailability.find(s => s.seat_number === seatId);
                if (availability && availability.status !== 'available') {
                    seatDiv.classList.add(availability.status);
                } else {
                    seatDiv.addEventListener('click', () => toggleSeatSelection(seatId));
                }
                rowDiv.appendChild(seatDiv);
            });
            seatingMap.appendChild(rowDiv);
        });
    }

    // --- SEAT SELECTION & SUMMARY ---
    function toggleSeatSelection(seatId) {
        const seatDiv = document.getElementById(seatId);
        const index = state.selectedSeats.indexOf(seatId);

        if (index > -1) {
            state.selectedSeats.splice(index, 1);
            seatDiv.classList.remove('selected');
        } else {
            state.selectedSeats.push(seatId);
            seatDiv.classList.add('selected');
        }
        updateBookingSummary();
    }

    function updateBookingSummary() {
        document.getElementById('selected-seats').textContent = state.selectedSeats.join(', ') || 'None';
        let total = 0;
        state.selectedSeats.forEach(seatId => {
            // This is a simplified price calculation. You can enhance it with seat types.
            total += initialState.seatPrices.standard;
        });
        document.getElementById('total-price').textContent = total.toFixed(2);
        proceedButton.disabled = state.selectedSeats.length === 0;
    }

    // --- BOOKING PROCESSING ---
    async function processBooking() {
        if (state.isProcessing || state.selectedSeats.length === 0) return;
        state.isProcessing = true;
        proceedButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
        proceedButton.disabled = true;

        try {
            const response = await fetch('/seating/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    movieId: initialState.movie._id,
                    showtimeId: initialState.currentShowtime._id,
                    seats: state.selectedSeats,
                    total: parseFloat(document.getElementById('total-price').textContent)
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Booking failed.');
            
            // Redirect to the confirmation page with the booking reference
            window.location.href = `/confirmation?ref=${result.bookingReference}`;

        } catch (error) {
            alert(`Error: ${error.message}`);
            state.isProcessing = false;
            proceedButton.innerHTML = `Secure Checkout`;
            proceedButton.disabled = state.selectedSeats.length === 0;
        }
    }

    initialize();
});