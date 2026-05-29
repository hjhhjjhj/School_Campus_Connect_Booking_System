document.addEventListener('DOMContentLoaded', () => {
    const loginAnchor = document.querySelector('nav a[href="Login.html"]');
    const currentUserStr = sessionStorage.getItem('campusBookingUser');
    let currentUser = null;
    try {
        currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    } catch (e) {
        currentUser = null;
    }

    const userDisplay = document.getElementById('user_display');
    if (currentUser) {
        userDisplay.textContent = currentUser.name;
        userDisplay.classList.add('logged-in');
        if (loginAnchor) {
            loginAnchor.href = 'Logout.html';
            loginAnchor.textContent = 'Logout';
        }

        const loginH2Anchor = document.querySelector('#main_mid_page h2 a[href="Login.html"]');
        if (loginH2Anchor) {
            const h2 = loginH2Anchor.closest('h2');
            if (h2) h2.textContent = 'You have logged in!';
        }
    } else {
        userDisplay.textContent = 'Guest';
        userDisplay.classList.add('guest');
    }
});
