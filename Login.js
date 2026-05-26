const users = [
    { username: 'alice', password: 'Campus123', displayName: 'Alice 吴', role: 'Student' },
    { username: 'bob', password: 'Room456', displayName: 'Bob 李', role: 'Teacher' },
    { username: 'cindy', password: 'Book789', displayName: 'Cindy 张', role: 'Admin' }
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
        loginMessage.textContent = `登录成功，欢迎 ${user.displayName}！正在跳转到主页...`;
        loginMessage.className = 'login-message success';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } else {
        loginMessage.textContent = '用户名或密码错误，请重试。';
        loginMessage.className = 'login-message error';
    }
});
