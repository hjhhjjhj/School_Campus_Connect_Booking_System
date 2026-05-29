const loginForm = document.getElementById('login_form');
const loginMessage = document.getElementById('login_message');

// 从users.json加载用户数据
let users = [];

fetch('users.json')
    .then(response => response.json())
    .then(data => {
        users = data.users;
    })
    .catch(error => {
        console.error('Error loading users data:', error);
        loginMessage.textContent = 'Failed to load user data. Please try again later.';
        loginMessage.className = 'login-message error';
    });

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const selectedRole = document.getElementById('role-select').value;
    const user = users.find((item) => item.username === username && item.password === password && item.role === selectedRole);

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
        loginMessage.textContent = 'Invalid username, password, or identity. Please try again.';
        loginMessage.className = 'login-message error';
    }
});
