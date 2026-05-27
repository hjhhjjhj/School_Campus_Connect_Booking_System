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
    
    let html = '';
    rooms.forEach(room => {
        const availableSeats = room.capacity - room.bookedSeats;
        const statusText = room.available ? 'Available' : 'Unavailable';
        const buttonText = room.available ? 'Book Now' : 'Unavailable';
        const buttonDisabled = room.available ? '' : 'disabled';
        
        html += `<p>${room.name} | ${statusText} | Seats: ${availableSeats}/${room.capacity} | <button ${buttonDisabled}>${buttonText}</button></p>`;
    });
    
    container.innerHTML = html;
}

// 过滤功能
document.getElementById('Room_search_button_filter').addEventListener('click', () => {
    const searchBuilding = document.getElementById('Room_search_input_buildings').value.toLowerCase();
    const searchCapacity = parseInt(document.getElementById('Room_search_input_time').value) || 0;
    
    const filteredRooms = allRooms.filter(room => {
        const matchBuilding = searchBuilding === '' || 
                              room.name.toLowerCase().includes(searchBuilding) || 
                              room.building.toLowerCase().includes(searchBuilding);
        const matchCapacity = searchCapacity === 0 || (room.capacity - room.bookedSeats) >= searchCapacity;
        
        return matchBuilding && matchCapacity;
    });
    
    displayRooms(filteredRooms.length > 0 ? filteredRooms : allRooms);
});

// 重置按钮功能
document.getElementById('Room_search_input_buildings').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('Room_search_button_filter').click();
    }
});
