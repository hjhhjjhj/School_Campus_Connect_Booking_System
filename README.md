# Campus Connect Booking System

A client-side web application for booking campus rooms, supporting role-based access for students and teachers.

## Features

- **User Login** — Role-based authentication (Student / Teacher) with pre-set accounts
- **Rooms Listing** — Browse all rooms with availability status (Available / Unavailable)
- **Room Search & Filter** — Filter rooms by name, building, or capacity
- **Room Booking** — Select date + time range (30-min slots, 08:00–18:00, max 4 hours)
- **Conflict Detection** — Automatic check for overlapping bookings on the same room/date/time
- **My Bookings** — View your own bookings with review status, and cancel them
- **Teacher Review** — Teachers can view all applications, approve or reject bookings (status updates: `Pending review` → `Approved` / `Rejected`)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript |
| Storage | `localStorage` (persistent) + `sessionStorage` (session) |
| Data Source | Static `rooms.json` and `users.json` |
| Design | No frameworks, no bundlers, no backend |

## Project Structure

```
Campus_Connect_Booking_System/
├── index.html                        # Home page — welcome + login CTA
├── Login.html                        # Login page (Student / Teacher)
├── Logout.html                       # Logout page (auto-redirect)
├── Room.html                         # Room listing + search + filter
├── Room_Confirmation.html            # Booking confirmation (date + time selection)
├── Room_error.html                   # Conflict error page
├── My_Booking.html                   # My Bookings (view & cancel)
├── Pending_review_application.html   # Teacher review dashboard
├── style.css                         # Global shared styles
├── rooms.json                        # Room data (10 rooms)
├── users.json                        # User accounts (6 users)
├── README.md
├── css/
│   ├── index.css
│   ├── Login.css
│   ├── Room.css
│   ├── Room_Confirmation.css
│   ├── My_Booking.css
│   └── Pending_review_application.css
├── JavaScript/
│   ├── log.js                        # Session-aware nav bar (shared)
│   ├── Login.js                      # Login logic
│   ├── Logout.js                     # Clear session & redirect
│   ├── room.js                       # Room list render & filter
│   ├── room_confirmation.js          # Time selection & booking confirmation
│   ├── my_booking.js                 # My Bookings render & cancel
│   └── pending_review_application.js # Teacher review approve/reject
```

## How to Use (User Guide)

### 1. Login

Open `Login.html` and sign in with a pre-set account:

| Username | Password | Role |
|---|---|---|
| alice | Campus123 | Student |
| cindy | Book789 | Student |
| K | 123456 | Student |
| P | 123456 | Student |
| bob | Room456 | Teacher |
| KK | 123456 | Teacher |

Select the correct identity (Student / Teacher) before logging in.

### 2. Browse & Book a Room (Student)

1. Go to **Room** page — all rooms are displayed as cards
2. Green cards = Available, Red cards = Unavailable
3. Use the **Filter** bar to search by room name, building, or minimum capacity
4. Click an available room card → redirected to **Room_Confirmation**
5. Select a date and click time slots (contiguous multi-select, max 4 hours)
6. Click **Confirm Booking** — if the slot is already taken, you'll see an error
7. On success, redirected to **My Bookings** with status `Pending review`

### 3. My Bookings (Student)

1. Go to **My Booking** page to see all your bookings
2. Each card shows: room name, capacity, time, date, status (`Pending review` / `Approved` / `Rejected`)
3. Click **Cancel** to remove a booking

### 4. Review Applications (Teacher)

1. After logging in as Teacher (`bob` / `KK`), the nav bar shows **Pending Review**
2. Click **Pending Review** to see ALL bookings from all users
3. Each card has **Approve** (green) and **Reject** (red) buttons
4. Clicking updates the booking status — visible immediately on the student's **My Booking** page

## How to Set Up (Developer Guide)

### Requirements

Any modern web browser (Chrome, Firefox, Edge, Safari). No server or build tools needed.

### Setup

```bash
git clone <repo-url>
cd Campus_Connect_Booking_System
```

Open any `.html` file in your browser.

> **Note:** Because the app uses `fetch()` to load `rooms.json` and `users.json`, it must run via a local HTTP server (not directly from `file://`). Use any of these:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension
Right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` (or the port shown).

### How It Works

- **No backend** — all data is stored in the browser's `localStorage`
- **Session** — `sessionStorage` holds the logged-in user (`campusBookingUser`) and temporary booking state (`pendingBooking`)
- **Booking persistence** — All bookings are saved under `localStorage` key `campusBookingBookings` as a JSON array
- **Status flow** — `Pending review` (default on student confirm) → `Approved` / `Rejected` (teacher action on Pending Review page)
- **Conflict detection** — Before saving a new booking, the system checks all existing bookings for overlapping room + date + time

### Adding Test Users

Edit `users.json`:

```json
{
  "users": [
    {
      "username": "yourname",
      "password": "yourpass",
      "displayName": "Your Name",
      "role": "Student"
    }
  ]
}
```

### Adding Rooms

Edit `rooms.json`:

```json
{
  "rooms": [
    {
      "id": "E101",
      "building": "E",
      "name": "Room E101",
      "capacity": 30,
      "bookedSeats": 10,
      "available": true
    }
  ]
}
```
