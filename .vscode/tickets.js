const paymentInput = document.getElementById('payment');
const errorMessage = document.getElementById('error-message');
const proceedButton = document.getElementById('proceed-button');

// Format card number with spaces
paymentInput.addEventListener('input', function() {
    let value = paymentInput.value.replace(/\D/g, ''); // Remove non-digit characters
    value = value.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
    paymentInput.value = value;
});

// Validate card number on button click
proceedButton.addEventListener('click', function(event) {
    const cardNumber = paymentInput.value.replace(/\s/g, ''); // Remove spaces for validation

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        errorMessage.style.display = 'block';
        event.preventDefault(); // Prevents the link from redirecting
    } else {
        errorMessage.style.display = 'none';
    }
});