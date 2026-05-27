function getCurrentUser() {
    const userStr = sessionStorage.getItem('campusBookingUser');
    if (!userStr) {
        return null;
    }
    try {
        return JSON.parse(userStr);
    } catch (err) {
        return null;
    }
}

function getUserBookings(username) {
    const storedBookings = JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
    return storedBookings.filter(booking => booking.bookedUsername === username);
}

function formatBookingTime(booking) {
    const bookedAt = booking.bookedAt ? new Date(booking.bookedAt).toLocaleString() : 'N/A';
    return `Booked at: ${bookedAt}`;
}

function renderBookingCard(booking) {
    const durationText = booking.timeRange && booking.timeRange.duration
        ? `${booking.timeRange.startTime} - ${booking.timeRange.endTime} (${booking.timeRange.duration.toFixed(1)}hours)`
        : 'Time not selected';

    return `
        <div class="booking-card">
            <h3>${booking.roomName}</h3>
            <p><strong>Capacity:</strong> ${booking.capacity}</p>
            <p><strong>Available Seats:</strong> ${booking.availableSeats}</p>
            <p><strong>User Role:</strong> ${booking.userRole}</p>
            <p class="booking-time">${durationText}</p>
            <p>${formatBookingTime(booking)}</p>
        </div>
    `;
}

function renderMyBookings() {
    const container = document.getElementById('my_booking_list');
    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="no-bookings">
                <p>You have not logged in yet.<a href="Login.html">Please login first</a> to view your booking records.</p>
            </div>
        `;
        return;
    }

    const bookings = getUserBookings(user.username);
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <p>Currently, no booking records found for you.</p>
                <p><a href="Room.html">Go to Room Page to make a booking</a></p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map(renderBookingCard).join('');
}

window.addEventListener('load', () => {
    renderMyBookings();
});