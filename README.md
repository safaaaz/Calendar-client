
# Calendar Client

A web-based calendar application built with JavaScript and Spring Boot. This project allows users to create, view, and update calendar events with attachments and other details.

## Features

- **View Calendar**: Display a calendar with events for the selected month.
- **Create Events**: Add new events with titles, dates, times, locations, descriptions, and attachments.
- **Update Events**: Edit existing events.
- **Dynamic Attachments**: Add and remove attachments dynamically.
- **Pagination**: Navigate between months.

## Setup and Installation

### Prerequisites

- Node.js and npm (for frontend)
- Java and Maven (for backend)
- Spring Boot (backend framework)

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/safaaaz/Calendar-client.git
   cd Calendar-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

### Backend Setup

1. **Clone the repository** (if not done already):
   ```bash
   git clone https://github.com/your-repo/backend.git
   cd backend
   ```

2. **Build and run the application**:
   ```bash
   mvn spring-boot:run
   ```

## Usage

1. **Open the application** in your browser:
   Navigate to `http://localhost:3000` for the frontend.

2. **Create and View Events**:
   - Click on the button to open the event creation modal.
   - Fill in the details and click "Create Event".
   - View the calendar and click on events to update them.

3. **Navigate Between Months**:
   - Use the left and right buttons to navigate through months.
