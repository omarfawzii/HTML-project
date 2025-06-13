async function handlePayment(paymentMethod) {
  try {
    const bookingReference = document.getElementById('bookingReference').textContent;
    
    // Show loading state
    const paymentButton = document.getElementById('paymentButton');
    const originalText = paymentButton.textContent;
    paymentButton.disabled = true;
    paymentButton.textContent = 'Processing...';

    // Update payment status
    const response = await fetch('/api/bookings/payment/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
      },
      body: JSON.stringify({
        bookingReference,
        paymentMethod,
        paymentStatus: 'paid'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment failed');
    }

    // Show success message
    const paymentSection = document.getElementById('paymentSection');
    paymentSection.innerHTML = `
      <div class="payment-success">
        <i class="fas fa-check-circle"></i>
        <h3>Payment Successful!</h3>
        <p>Your booking has been confirmed.</p>
        ${paymentMethod === 'cash' ? `
          <div class="qr-code">
            <img src="/images/qr-code.png" alt="Payment QR Code">
            <p>Please show this QR code at the counter to complete your payment.</p>
          </div>
        ` : ''}
      </div>
    `;

    // Update booking status in the summary
    document.getElementById('bookingStatus').textContent = 'Confirmed';
    document.getElementById('paymentStatus').textContent = 'Paid';

    // Redirect to my tickets page after 3 seconds
    setTimeout(() => {
      window.location.href = '/mytickets';
    }, 3000);

  } catch (error) {
    console.error('Payment error:', error);
    alert(error.message || 'Payment failed. Please try again.');
    paymentButton.disabled = false;
    paymentButton.textContent = originalText;
  }
}

// Add event listeners for payment buttons
document.addEventListener('DOMContentLoaded', () => {
  const visaPaymentBtn = document.getElementById('visaPaymentBtn');
  const cashPaymentBtn = document.getElementById('cashPaymentBtn');

  if (visaPaymentBtn) {
    visaPaymentBtn.addEventListener('click', () => handlePayment('visa'));
  }

  if (cashPaymentBtn) {
    cashPaymentBtn.addEventListener('click', () => handlePayment('cash'));
  }
}); 