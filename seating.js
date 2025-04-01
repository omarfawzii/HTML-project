const seats = document.querySelectorAll('.seat.available');
const selectedSeats = document.getElementById('selected-seats');
const totalPrice = document.getElementById('total-price');

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
    let total = 0;

    selected.forEach(seat => {
        total += parseInt(seat.getAttribute('data-price'));
    });

    selectedSeats.textContent = selectedSeatCount;
    totalPrice.textContent = total;
}