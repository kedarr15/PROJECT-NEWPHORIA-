document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('destinationForm');
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const destination = document.getElementById('destination').value.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            const days = document.getElementById('days').value;

            if ((destination === 'goa' || destination === 'gokarna' || destination === 'ooty' || destination === 'pondicherry') && (days === '1' || days === '2' || days === '3')) {
                window.location.href = `${destination}${days}.html`;
            } else {
                alert('Invalid input. Please enter a valid destination and number of days (1, 2, or 3).');
            }
});
});
      