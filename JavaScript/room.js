let allRooms = [];

// 加载房间数据
fetch('rooms.json')
    .then(response => response.json())
    .then(data => {
        allRooms = data.rooms;
        displayRooms(allRooms);
    })
    .catch(error => {
        console.error('Error loading rooms data:', error);
        document.getElementById('Room_main_mid_page_content').innerHTML = '<p>Failed to load room data.</p>';
    });

// 渲染房间列表
function displayRooms(rooms) {
    const container = document.getElementById('Room_main_mid_page_content');
    
    if (rooms.length === 0) {
        container.innerHTML = '<p>No rooms available matching your search criteria.</p>';
        return;
    }
    
    let html = '<div class="rooms-grid">';
    rooms.forEach(room => {
        const availableSeats = room.capacity - room.bookedSeats;
        const statusText = room.available ? 'Available' : 'Unavailable';
        const statusClass = room.available ? 'available' : 'unavailable';
        const cardClass = room.available ? 'room-card' : 'room-card disabled';
        
        html += `
        <div class="${cardClass}" data-room-id="${room.id}">
            <div class="room-name">${room.name}</div>
            <div class="room-status ${statusClass}">${statusText}</div>
            <div class="room-seats">Available: ${availableSeats}/${room.capacity}</div>
            ${room.available ? `<div class="room-action">Click to book</div>` : ''}
        </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    
    // 为可用房间添加点击事件
    document.querySelectorAll('.room-card:not(.disabled)').forEach(card => {
        card.addEventListener('click', () => {
            const roomId = card.getAttribute('data-room-id');
            handleRoomBooking(roomId);
        });
    });
}

// 处理房间预订
function handleRoomBooking(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (room) {
        // 检查用户是否已登录
        const user = JSON.parse(sessionStorage.getItem('campusBookingUser'));
        if (user) {
            // 存储预订信息到sessionStorage
            sessionStorage.setItem('pendingBooking', JSON.stringify({
                roomId: room.id,
                roomName: room.name,
                capacity: room.capacity,
                availableSeats: room.capacity - room.bookedSeats,
                bookingTime: new Date().toLocaleString()
            }));
            
            // 跳转到确认页面
            window.location.href = 'Room_Confirmation.html';
        } else {
            alert('Please login first to book a room.');
            window.location.href = 'Login.html';
        }
    }
}

// 过滤功能
function applyFilter() {
    const searchBuilding = document.getElementById('Room_search_input_buildings').value.trim().toLowerCase();
    const searchDate = document.getElementById('Room_search_input_date').value;
    const searchTime = document.getElementById('Room_search_input_time').value;
    const searchCapacity = parseInt(document.getElementById('Room_search_input_capacity').value) || 0;
    
    const filteredRooms = allRooms.filter(room => {
        // 如果未填写建筑/房间，则不限制
        const matchBuilding = searchBuilding === '' || 
                              room.name.toLowerCase().includes(searchBuilding) || 
                              room.building.toLowerCase().includes(searchBuilding);
        
        // 如果未填写容量要求，则不限制；否则要求可用座位数大于等于输入的容量
        const matchCapacity = searchCapacity === 0 || (room.capacity - room.bookedSeats) >= searchCapacity;
        
        return matchBuilding && matchCapacity;
    });
    
    displayRooms(filteredRooms.length > 0 ? filteredRooms : allRooms);
}

// 过滤按钮点击事件
document.getElementById('Room_search_button_filter').addEventListener('click', () => {
    applyFilter();
});

// Enter键搜索
document.getElementById('Room_search_input_buildings').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        applyFilter();
    }
});

// 容量输入框Enter键搜索
document.addEventListener('DOMContentLoaded', () => {
    const capacityInput = document.getElementById('Room_search_input_capacity');
    if (capacityInput) {
        capacityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                applyFilter();
            }
        });
    }
});
