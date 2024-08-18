document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send the form data to the API server
    fetch('/customer/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // If login is successful, redirect to home page
            window.location.href = `afterlogin.html`; 
        } else {
            // If login fails, reset fields and display error message
            document.getElementById('password').value = '';
            document.getElementById('email').value = ''; // Clear the email field

            // Show suggestion box
            showSuggestionBox(username);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    });
});

function showSuggestionBox(username) {
    const emailField = document.getElementById('email');
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestion-box';

    // Suggest possible alternatives (you can customize this logic)
    const domainSuggestion = username.includes('@') ? '' : '@gmail.com';
    suggestionBox.textContent = `Invalid username or passsword ${username}${domainSuggestion}`;
    
    // Position the suggestion box
    emailField.parentNode.appendChild(suggestionBox);
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.top = emailField.offsetTop + emailField.offsetHeight + 'px';
    suggestionBox.style.left = emailField.offsetLeft + 'px';
    suggestionBox.style.backgroundColor = '#f8d7da';
    suggestionBox.style.color = '#721c24';
    suggestionBox.style.padding = '10px';
    suggestionBox.style.border = '1px solid #f5c6cb';
    suggestionBox.style.borderRadius = '5px';
    suggestionBox.style.fontSize = '12px';
    suggestionBox.style.zIndex = '1000';

    // Remove the suggestion box after a short delay
    setTimeout(() => {
        suggestionBox.remove();
    }, 5000);
}
