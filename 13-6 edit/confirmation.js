document.getElementById('visa-button').addEventListener('click', function() {
    // Redirect to payment gateway or process payment
    alert('Proceeding to Visa payment...');
});

document.getElementById('cash-button').addEventListener('click', function() {
    document.getElementById('cash-message').style.display = 'block';
});