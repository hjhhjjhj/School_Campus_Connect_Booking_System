function getCurrentUser() {
    const userStr = sessionStorage.getItem('campusBookingUser');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (err) {
        return null;
    }
}

function getAllBookings() {
    return JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
}

function formatBookingTime(booking) {
    const bookedAt = booking.bookedAt ? new Date(booking.bookedAt).toLocaleString() : 'N/A';
    return `Booked at: ${bookedAt}`;
}

function renderBookingCard(booking, index) {
    const durationText = booking.timeRange && booking.timeRange.duration
        ? `${booking.timeRange.startTime} - ${booking.timeRange.endTime} (${booking.timeRange.duration.toFixed(1)}hours)`
        : 'Time not selected';

    const statusText = booking.status || '待审核';
    const statusClass = statusText === '待审核' ? 'status-pending' : '';

    return `
        <div class="booking-card">
            <h3>${booking.roomName}</h3>
            <p><strong>Capacity:</strong> ${booking.capacity}</p>
            <p><strong>Available Seats:</strong> ${booking.availableSeats}</p>
            <p><strong>Booked by:</strong> ${booking.bookedBy} (${booking.userRole})</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p class="booking-time">${durationText}</p>
            <p><strong>Status:</strong> <span class="booking-status ${statusClass}">${statusText}</span></p>
            <p>${formatBookingTime(booking)}</p>
            <button class="approve-btn" data-index="${index}">Approve</button>
            <button class="reject-btn" data-index="${index}">Reject</button>
        </div>
    `;
}

function renderPendingReviews() {
    const container = document.getElementById('pending_review_list');
    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = `
            <div class="no-bookings">
                <p>You have not logged in yet. <a href="Login.html">Please login first</a> to review applications.</p>
            </div>
        `;
        return;
    }

    if (user.role !== 'Teacher') {
        container.innerHTML = `
            <div class="no-bookings">
                <p>Only teachers can access this page.</p>
            </div>
        `;
        return;
    }

    const bookings = getAllBookings();
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <p>No booking applications found.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map((booking, index) => renderBookingCard(booking, index)).join('');
}

function handleActionClick(e) {
    const btn = e.target.closest('.approve-btn, .reject-btn');
    if (!btn) return;

    const user = getCurrentUser();
    if (!user || user.role !== 'Teacher') return;

    const bookings = getAllBookings();
    const index = parseInt(btn.getAttribute('data-index'), 10);
    const targetBooking = bookings[index];
    if (!targetBooking) return;

    const isApprove = btn.classList.contains('approve-btn');
    const action = isApprove ? 'approve' : 'reject';
    const newStatus = isApprove ? 'Approved' : 'Rejected';

    if (!confirm(`Are you sure you want to ${action} this booking for ${targetBooking.roomName}?`)) return;

    const storedBookings = JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
    const updatedBookings = storedBookings.map(b => {
        if (b.bookedAt === targetBooking.bookedAt &&
            b.roomId === targetBooking.roomId &&
            b.date === targetBooking.date) {
            return { ...b, status: newStatus };
        }
        return b;
    });

    localStorage.setItem('campusBookingBookings', JSON.stringify(updatedBookings));
    renderPendingReviews();
}

window.addEventListener('load', () => {
    renderPendingReviews();
    document.getElementById('pending_review_list').addEventListener('click', handleActionClick);
});
