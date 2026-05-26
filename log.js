document.addEventListener('DOMContentLoaded', () => {
    const loginAnchor = document.querySelector('nav a[href="Login.html"]');
    const currentUserStr = sessionStorage.getItem('campusBookingUser');
    let currentUser = null;
    try {
        currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    } catch (e) {
        currentUser = null;
    }

    if (loginAnchor && currentUser) {
        loginAnchor.href = 'Logout.html';
        loginAnchor.textContent = 'Logout';

        const loginH2Anchor = document.querySelector('#main_mid_page h2 a[href="Login.html"]');
        if (loginH2Anchor) {
            const h2 = loginH2Anchor.closest('h2');
            if (h2) h2.textContent = 'You have logged in!';
        }
    }
});
