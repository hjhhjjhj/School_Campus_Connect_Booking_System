// 从sessionStorage获取预订信息
function loadBookingDetails() {
    const bookingInfo = JSON.parse(sessionStorage.getItem('pendingBooking'));
    const userInfo = JSON.parse(sessionStorage.getItem('campusBookingUser'));
    
    if (!bookingInfo || !userInfo) {
        document.getElementById('booking_details').innerHTML = '<p>No booking information found. <a href="Room.html">Back to rooms</a></p>';
        return;
    }
    
    const detailsHTML = `
        <div class="detail-row">
            <label>Room Name:</label>
            <span>${bookingInfo.roomName}</span>
        </div>
        <div class="detail-row">
            <label>Room Capacity:</label>
            <span>${bookingInfo.capacity}</span>
        </div>
        <div class="detail-row">
            <label>Available Seats:</label>
            <span>${bookingInfo.availableSeats}</span>
        </div>
        <div class="detail-row">
            <label>Booked by:</label>
            <span>${userInfo.name}</span>
        </div>
        <div class="detail-row">
            <label>User Role:</label>
            <span>${userInfo.role}</span>
        </div>
    `;
    
    document.getElementById('booking_details').innerHTML = detailsHTML;
}

// 确认预订
document.getElementById('confirm_button').addEventListener('click', () => {
    const bookingInfo = JSON.parse(sessionStorage.getItem('pendingBooking'));
    
    if (bookingInfo) {
        // 这里可以后续实现实际的数据库保存逻辑
        alert(`Booking confirmed for ${bookingInfo.roomName}`);
        
        // 清除临时预订信息
        sessionStorage.removeItem('pendingBooking');
        
        // 跳转回房间列表
        window.location.href = 'Room.html';
    }
});

// 取消预订
document.getElementById('cancel_button').addEventListener('click', () => {
    // 清除临时预订信息
    sessionStorage.removeItem('pendingBooking');
    
    // 返回房间列表
    window.location.href = 'Room.html';
});

// 页面加载时显示预订信息
window.addEventListener('load', () => {
    loadBookingDetails();
});
