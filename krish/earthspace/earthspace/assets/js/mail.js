document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        name: document.querySelector('input[name="name"]').value,
        email: document.querySelector('input[name="email"]').value,
        subject: document.querySelector('input[name="subject"]').value,
        number: document.querySelector('input[name="number"]').value,
        message: document.querySelector('textarea[name="message"]').value
    };

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const formMessage = document.querySelector('.form-message');
            formMessage.textContent = data.message;
            if (data.success) {
                document.getElementById('contactForm').reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const formMessage = document.querySelector('.form-message');
            formMessage.textContent = 'Failed to send message. Please try again later.';
        });
});

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var submitButton = document.getElementById('submitButton');
    var formMessage = document.querySelector('.form-message');

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formMessage.textContent = '';

    setTimeout(function () {
        submitButton.disabled = false;
        submitButton.textContent = 'SEND MESSAGE';
        formMessage.textContent = 'Message sent successfully!';

        document.getElementById('contactForm').reset();
    }, 2000);
});