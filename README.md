# Box Chat Application

A professional real-time chat application built with **Micro-Frontend Architecture**.

## Architecture

- **Frontend**: React, TypeScript, Webpack Module Federation.
    - **Host**: Application shell, authentication, routing.
    - **Chat MFE**: Core chat logic, rooms, messages.
    - **Presence MFE**: Online users list.
    - **Notification MFE**: Unread message badges.
- **Backend**: Node.js, Express, MySQL, Socket.IO.

## Prerequisites

- Node.js (v16+)
- MySQL Server (running on port 3306)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Silentcodr/Box_Chat.git
    cd Box_Chat
    ```

2.  **Setup Backend**:
    - Navigate to backend: `cd backend`
    - Install dependencies: `npm install`
    - Configure Database:
        - Create a `.env` file in `backend/` based on your MySQL credentials:
          ```env
          PORT=3000
          DB_HOST=localhost
          DB_USER=root
          DB_PASS=yourpassword
          DB_NAME=boxchat
          DB_PORT=3306
          JWT_SECRET=your_jwt_secret
          ```
    - Start the server: `npm run dev` (This will automatically sync tables).

3.  **Setup Micro-Frontends**:
    - **Host**:
        ```bash
        cd host
        npm install
        npm start
        ```
    - **Chat**:
        ```bash
        cd chat-mfe
        npm install
        npm start
        ```
    - **Presence**:
        ```bash
        cd presence-mfe
        npm install
        npm start
        ```
    - **Notification**:
        ```bash
        cd notification-mfe
        npm install
        npm start
        ```

4.  **Access the App**:
    - Open [http://localhost:8085](http://localhost:8085)

## Features

- **Micro-frontends**: Independent deployment and development.
- **Real-time Chat**: Powered by Socket.IO.
- **Authentication**: Secure JWT-based auth.
- **MySQL Integration**: Persistent storage for users and messages.
- **Dark Theme**: Professional UI.

