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

function renderBookingCard(booking, index) {
    const durationText = booking.timeRange && booking.timeRange.duration
        ? `${booking.timeRange.startTime} - ${booking.timeRange.endTime} (${booking.timeRange.duration.toFixed(1)}hours)`
        : 'Time not selected';

    const status = (booking.status || '').toLowerCase();
    let displayStatus, statusClass;
    if (status === 'approved') {
        displayStatus = 'Approved';
        statusClass = 'status-approved';
    } else if (status === 'rejected') {
        displayStatus = 'Rejected';
        statusClass = 'status-rejected';
    } else {
        displayStatus = 'Pending review';
        statusClass = 'status-pending';
    }

    return `
        <div class="booking-card">
            <h3>${booking.roomName}</h3>
            <p><strong>Capacity:</strong> ${booking.capacity}</p>
            <p><strong>Available Seats:</strong> ${booking.availableSeats}</p>
            <p><strong>User Role:</strong> ${booking.userRole}</p>
            <p class="booking-time">${durationText}</p>
            <p><strong>Status:</strong> <span class="booking-status ${statusClass}">${displayStatus}</span></p>
            <p>${formatBookingTime(booking)}</p>
            <button class="cancel-btn" data-index="${index}">Cancel</button>
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

    container.innerHTML = bookings.map((booking, index) => renderBookingCard(booking, index)).join('');
}

function handleCancelClick(e) {
    const btn = e.target.closest('.cancel-btn');
    if (!btn) return;

    const user = getCurrentUser();
    if (!user) return;

    const userBookings = getUserBookings(user.username);
    const index = parseInt(btn.getAttribute('data-index'), 10);
    const targetBooking = userBookings[index];
    if (!targetBooking) return;

    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const storedBookings = JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
    const updatedBookings = storedBookings.filter(b =>
        !(b.bookedAt === targetBooking.bookedAt &&
          b.roomId === targetBooking.roomId &&
          b.date === targetBooking.date)
    );

    if (updatedBookings.length === storedBookings.length) {
        alert('Booking not found. It may have already been cancelled.');
        return;
    }

    localStorage.setItem('campusBookingBookings', JSON.stringify(updatedBookings));
    renderMyBookings();
}

window.addEventListener('load', () => {
    renderMyBookings();
    document.getElementById('my_booking_list').addEventListener('click', handleCancelClick);
});