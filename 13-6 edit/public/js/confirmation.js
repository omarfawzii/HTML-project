document.addEventListener('DOMContentLoaded', async function() {
    // Check login
    if (!localStorage.getItem('isLoggedIn')) {
        alert('Please login first.');
        window.location.href = 'index.html';
        return;
    }

    // Get booking from localStorage
    const booking = JSON.parse(localStorage.getItem('currentBooking'));
    if (!booking) {
        alert('No booking found. Please start over.');
        window.location.href = 'main.html';
        return;
    }

    // Populate summary
    document.getElementById('movie-title-summary').textContent = booking.movie;
    document.getElementById('booking-date').textContent = booking.date;
    document.getElementById('showtime-summary').textContent = booking.time;
    document.getElementById('auditorium-summary').textContent = booking.auditorium;
    document.getElementById('selected-seats-summary').textContent = booking.seats.join(', ');
    document.getElementById('total-price-summary').textContent = booking.total.toFixed(2);

    // Payment handlers
    document.getElementById('visa-button').addEventListener('click', () => {
        document.getElementById('payment-form').style.display = 'block';
    });
    
    document.getElementById('cash-button').addEventListener('click', handleCashPayment);
    document.getElementById('submit-payment').addEventListener('click', handleVisaPayment);
});

async function handleVisaPayment() {
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('card-name').value;
    
    // Validation
    if (!cardNumber || !expiry || !cvv || !cardName) {
        alert('Please fill all payment details');
        return;
    }
    
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Please enter a valid 16-digit card number');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Please enter expiry date in MM/YY format');
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Please enter a valid CVV (3-4 digits)');
        return;
    }

    showProcessing(true);
    
    try {
        const token = localStorage.getItem('token');
        const booking = JSON.parse(localStorage.getItem('currentBooking'));
        
        const response = await fetch(`${API_BASE_URL}/api/payments/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                booking_id: booking.id,
                card_number: cardNumber,
                expiry: expiry,
                cvv: cvv,
                amount: booking.total
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Payment failed');
        }
        
        const result = await response.json();
        
        // Generate ticket
        const ticket = {
            id: result.paymentId,
            ...booking,
            status: 'confirmed',
            paymentMethod: 'visa',
            qrCode: generateQRCode(result.paymentId)
        };
        
        // Save to "my tickets"
        saveTicket(ticket);
        
        // Show success
        showPaymentSuccess(ticket, 'visa');
    } catch (error) {
        console.error('Payment error:', error);
        alert(`Payment failed: ${error.message}`);
    } finally {
        showProcessing(false);
    }
}

async function handleCashPayment() {
    showProcessing(true);
    
    try {
        // Generate reservation
        const booking = JSON.parse(localStorage.getItem('currentBooking'));
        const reservation = {
            id: 'VOX-' + Date.now().toString(36).toUpperCase(),
            ...booking,
            status: 'reserved',
            paymentMethod: 'cash',
            qrCode: generateQRCode('VOX-' + Date.now().toString(36).toUpperCase())
        };
        
        // Save reservation
        saveTicket(reservation);
        
        // Show success
        showPaymentSuccess(reservation, 'cash');
    } catch (error) {
        console.error('Reservation error:', error);
        alert('Reservation failed. Please try again.');
    } finally {
        showProcessing(false);
    }
}

function saveTicket(ticket) {
    let tickets = JSON.parse(localStorage.getItem('userTickets')) || [];
    tickets.unshift(ticket);
    localStorage.setItem('userTickets', JSON.stringify(tickets));
}

function showPaymentSuccess(ticket, paymentType) {
    document.querySelector('.payment-options').style.display = 'none';
    document.getElementById('payment-form').style.display = 'none';
    
    const successElement = document.getElementById(`${paymentType}-${paymentType === 'cash' ? 'message' : 'success'}`);
    
    document.getElementById(`${paymentType}-movie-title`).textContent = ticket.movie;
    document.getElementById(`${paymentType}-showtime`).textContent = ticket.showtime;
    document.getElementById(`${paymentType}-seats`).textContent = ticket.seats.join(', ');
    
    const qrElement = document.getElementById(`${paymentType}-qr-code`);
    qrElement.innerHTML = `<img src="${ticket.qrCode}" alt="Ticket QR Code">`;
    
    successElement.style.display = 'block';
}

function showProcessing(show) {
    const processingElement = document.getElementById('payment-processing');
    const visaButton = document.getElementById('visa-button');
    const cashButton = document.getElementById('cash-button');
    const submitButton = document.getElementById('submit-payment');
    
    if (show) {
        processingElement.style.display = 'block';
        visaButton.disabled = true;
        cashButton.disabled = true;
        submitButton.disabled = true;
    } else {
        processingElement.style.display = 'none';
        visaButton.disabled = false;
        cashButton.disabled = false;
        submitButton.disabled = false;
    }
}

function generateQRCode(data) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
}