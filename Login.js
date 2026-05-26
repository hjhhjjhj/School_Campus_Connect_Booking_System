const users = [
    { username: 'alice', password: 'Campus123', displayName: 'Alice', role: 'Student' },
    { username: 'bob', password: 'Room456', displayName: 'Bob', role: 'Teacher' },
    { username: 'cindy', password: 'Book789', displayName: 'Cindy', role: 'Admin' }
];

const loginForm = document.getElementById('login_form');
const loginMessage = document.getElementById('login_message');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const user = users.find((item) => item.username === username && item.password === password);

    if (user) {
        sessionStorage.setItem('campusBookingUser', JSON.stringify({
            username: user.username,
            name: user.displayName,
            role: user.role
        }));
        loginMessage.textContent = `Login successful, welcome ${user.displayName}! Redirecting to the main page...`;
        loginMessage.className = 'login-message success';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } else {
        loginMessage.textContent = 'Invalid username or password. Please try again.';
        loginMessage.className = 'login-message error';
    }
});
