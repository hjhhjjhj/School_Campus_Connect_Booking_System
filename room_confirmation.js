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
    
    // 初始化日期选择器
    initializeDateInput();
    
    // 生成时间卡片
    generateTimeSlots();
}

// 生成时间卡片 (30分钟间隔，从8:00到18:00)
function generateTimeSlots() {
    const container = document.getElementById('time_slots_container');
    const slots = [];
    
    // 从8:00到18:00，每30分钟一个时间段
    for (let hour = 8; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const startHour = hour;
            const startMinute = minute;
            const endHour = minute === 30 ? hour + 1 : hour;
            const endMinute = minute === 30 ? 0 : 30;
            
            const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            
            slots.push({
                start: startTime,
                end: endTime,
                startMinutes: startHour * 60 + startMinute,
                endMinutes: endHour * 60 + endMinute
            });
        }
    }
    
    // 生成HTML
    let html = '';
    slots.forEach((slot, index) => {
        html += `
            <div class="time-slot-card" data-index="${index}" data-start="${slot.start}" data-end="${slot.end}" data-start-minutes="${slot.startMinutes}">
                <div class="time-slot-text">${slot.start} - ${slot.end}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // 为所有时间卡片添加点击事件
    setupTimeSlotEvents();
}

// 设置时间卡片的点击事件
function setupTimeSlotEvents() {
    const timeSlots = document.querySelectorAll('.time-slot-card');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            handleTimeSlotClick(slot);
        });
    });
}

// 处理时间卡片点击事件
function handleTimeSlotClick(clickedSlot) {
    const clickedIndex = parseInt(clickedSlot.getAttribute('data-index'));
    const currentSelected = document.querySelectorAll('.time-slot-card.selected');
    
    if (currentSelected.length === 0) {
        // 如果没有选择任何卡片，则选择点击的卡片
        clickedSlot.classList.add('selected');
        updateSelectedTimeDisplay();
    } else {
        const firstSelected = Array.from(currentSelected)[0];
        const firstIndex = parseInt(firstSelected.getAttribute('data-index'));
        
        // 检查是否点击已选中的卡片（取消选择）
        if (clickedSlot.classList.contains('selected')) {
            // 清空所有选择
            document.querySelectorAll('.time-slot-card').forEach(s => s.classList.remove('selected'));
            updateSelectedTimeDisplay();
            return;
        }
        
        // 计算要选择的范围
        let startIndex, endIndex;
        if (clickedIndex > firstIndex) {
            startIndex = firstIndex;
            endIndex = clickedIndex;
        } else {
            startIndex = clickedIndex;
            endIndex = firstIndex;
        }
        
        // 检查连续时间是否超过4小时（8个30分钟的卡片）
        const slotCount = endIndex - startIndex + 1;
        const durationHours = slotCount * 0.5; // 每个卡片30分钟
        
        if (durationHours > 4) {
            alert('预订时间不能超过4小时！当前选择时间为 ' + durationHours.toFixed(1) + ' 小时');
            return;
        }
        
        // 清空之前的选择
        document.querySelectorAll('.time-slot-card').forEach(s => s.classList.remove('selected'));
        
        // 选择范围内的所有卡片
        const allSlots = document.querySelectorAll('.time-slot-card');
        for (let i = startIndex; i <= endIndex; i++) {
            allSlots[i].classList.add('selected');
        }
        
        updateSelectedTimeDisplay();
    }
}

// 更新显示的选中时间
function updateSelectedTimeDisplay() {
    const selectedSlots = document.querySelectorAll('.time-slot-card.selected');
    const displayElement = document.getElementById('selected_time_display');
    const textElement = document.getElementById('selected_time_text');
    
    if (selectedSlots.length === 0) {
        displayElement.style.display = 'none';
    } else {
        const firstSlot = selectedSlots[0];
        const lastSlot = selectedSlots[selectedSlots.length - 1];
        const startTime = firstSlot.getAttribute('data-start');
        const endTime = lastSlot.getAttribute('data-end');
        const duration = selectedSlots.length * 0.5;
        
        textElement.textContent = `${startTime} - ${endTime} (${duration.toFixed(1)}小时)`;
        displayElement.style.display = 'block';
    }
}

// 获取选中的时间段
function getSelectedTimeRange() {
    const selectedSlots = document.querySelectorAll('.time-slot-card.selected');
    
    if (selectedSlots.length === 0) {
        return null;
    }
    
    const firstSlot = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];
    
    return {
        startTime: firstSlot.getAttribute('data-start'),
        endTime: lastSlot.getAttribute('data-end'),
        duration: selectedSlots.length * 0.5
    };
}

function getSelectedDate() {
    const dateInput = document.getElementById('booking_date');
    return dateInput ? dateInput.value : '';
}

function initializeDateInput() {
    const dateInput = document.getElementById('booking_date');
    if (!dateInput) return;

    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
        dateInput.value = today;
    }
}

function parseTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function timeRangesOverlap(rangeA, rangeB) {
    return parseTimeToMinutes(rangeA.startTime) < parseTimeToMinutes(rangeB.endTime) &&
           parseTimeToMinutes(rangeB.startTime) < parseTimeToMinutes(rangeA.endTime);
}

function isBookingConflict(candidateBooking) {
    const storedBookings = JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
    return storedBookings.some(booking =>
        booking.roomId === candidateBooking.roomId &&
        booking.date === candidateBooking.date &&
        timeRangesOverlap(booking.timeRange, candidateBooking.timeRange)
    );
}

// 确认预订
document.getElementById('confirm_button').addEventListener('click', () => {
    const bookingInfo = JSON.parse(sessionStorage.getItem('pendingBooking'));
    const selectedTime = getSelectedTimeRange();
    const selectedDate = getSelectedDate();
    const userInfo = JSON.parse(sessionStorage.getItem('campusBookingUser'));
    
    if (!selectedDate) {
        alert('Please select a booking date');
        return;
    }

    if (!selectedTime) {
        alert('Please select a booking time');
        return;
    }
    
    if (!userInfo) {
        alert('Please login before confirming a booking.');
        window.location.href = 'Login.html';
        return;
    }
    
    if (bookingInfo) {
        // 将选中的时间添加到预订信息中
        const confirmedBooking = {
            roomId: bookingInfo.roomId,
            roomName: bookingInfo.roomName,
            capacity: bookingInfo.capacity,
            availableSeats: bookingInfo.availableSeats,
            bookedBy: userInfo.name,
            bookedUsername: userInfo.username,
            userRole: userInfo.role,
            date: selectedDate,
            timeRange: selectedTime,
            bookedAt: new Date().toISOString()
        };

        if (isBookingConflict(confirmedBooking)) {
            window.location.href = 'Room_error.html';
            return;
        }
        
        const storedBookings = JSON.parse(localStorage.getItem('campusBookingBookings') || '[]');
        storedBookings.push(confirmedBooking);
        localStorage.setItem('campusBookingBookings', JSON.stringify(storedBookings));
        
        alert(`Booking confirmed for ${bookingInfo.roomName}\nDate: ${selectedDate}\nTime: ${selectedTime.startTime} - ${selectedTime.endTime}`);
        
        // 清除临时预订信息
        sessionStorage.removeItem('pendingBooking');
        
        // 跳转到我的预订页面，便于立即查看已确认的订单
        window.location.href = 'My_Booking.html';
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
