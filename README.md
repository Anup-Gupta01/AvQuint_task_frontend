# Task Management App - Frontend

## Overview

This is the frontend of the Task Management Application built using React.js. The application allows users to register, log in, and manage their daily tasks through a clean and responsive user interface.

## Features

* User Registration and Login
* JWT-based Authentication
* Create New Tasks
* Edit Existing Tasks
* Delete Tasks
* Mark Tasks as Completed or Pending
* Responsive Dashboard
* Form Validation
* API Integration with Backend

## Tech Stack

* React.js
* React Router DOM
* Axios
* Context API
* CSS / Tailwind CSS (if used)

## Project Structure

```bash
src/
├── components/
├── pages/
├── context/
├── api/
├── App.js
└── index.js
```

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to frontend folder

```bash
cd frontend
```

3. Install dependencies

```bash
npm install
```

4. Create a .env file

```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server

```bash
npm start
```

## Available Pages

### Register Page

Allows new users to create an account.

### Login Page

Authenticates users and provides access to the dashboard.

### Dashboard Page

Displays all tasks and provides CRUD functionality.

## Future Improvements

* Task Search
* Task Filtering
* Pagination
* Dark Mode
* Drag and Drop Task Management

## Author

Developed as part of a MERN Stack Internship Assignment.
