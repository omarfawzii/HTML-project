const seats = document.querySelectorAll('.seat.available');
const selectedSeats = document.getElementById('selected-seats');
const totalPrice = document.getElementById('total-price');
const ticketPrice = 100; // Price per seat in EGP

seats.forEach(seat => {
    seat.addEventListener('click', () => {
        if (!seat.classList.contains('booked')) {
            seat.classList.toggle('selected');
            updateSelection();
        }
    });
});

function updateSelection() {
    const selected = document.querySelectorAll('.seat.selected');
    const selectedSeatCount = selected.length;
    const total = selectedSeatCount * ticketPrice;

    selectedSeats.textContent = selectedSeatCount;
    totalPrice.textContent = total;
}