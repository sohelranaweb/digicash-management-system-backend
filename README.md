# 📱 DigiCash - Digital Wallet Backend

## 🔍 Overview

DigiCash is a secure, role-based digital wallet backend system designed to facilitate fast and safe money transfers, similar to popular services like **Bkash**, **Nagad**, or **Rocket**.

Built using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, the system provides a full range of wallet functionalities for different user roles: **Admin**, **Agent**, and **User**.

DigiCash ensures robust authentication, authorization, and transaction tracking, making it suitable for modern digital payment applications.

---

## 🚀 Technologies & Tools Used

### 🔧 Runtime & Framework

- **Node.js** – Server-side JavaScript runtime environment
- **Express.js** – Lightweight web framework for building APIs

### 🛢️ Database

- **MongoDB** – NoSQL database for flexible document storage
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB in Node.js

### 🔐 Authentication & Security

- **bcrypt** – Password hashing
- **jsonwebtoken (JWT)** – User authentication and token management
- **cors** – Cross-Origin Resource Sharing configuration
- **dotenv** – Environment variable management

### ⚙️ Project Structure & Utilities

- **TypeScript** – Superset of JavaScript with static type-checking
- **ts-node-dev** – Run TypeScript code in development mode with auto-reload
- **nodemon (optional)** – Auto-restarts server on file changes

### 🧪 Testing & Debugging

- **Postman** – API testing and debugging

---

## 📁 Folder Structure

```
src/
├── app.ts                # Express app configuration
├── server.ts             # Main entry point to start the server
├── modules/              # Modular features: auth, user, wallet, transaction
├── middlewares/          # Authorization, error handlers, etc.
├── config/               # Database & environment configurations
└── utils/                # Utility/helper functions
```

---

## 👑 Admin User

- A **default Admin** user is created automatically on the first server start.
- This admin has full control over users, wallets, transactions, and agents.

---

## 👤 User Lifecycle

- When a new user registers, a **wallet is automatically created** and linked.
- Users **must verify their email** before they can log in or access features.

---

## 🧑‍💼 Agent Lifecycle

- Any regular user can request to become an **Agent**.
- Admin reviews and **approves** or **rejects** the request.
- Only **approved agents** can perform agent-specific actions.

---

## 💼 Wallet Management System Features

### 👥 User Features

- **Add Money** – Users can top-up their wallet
- **Withdraw Money (Cash-out)** – Transfer money from wallet to bank/cash
- **Send Money to Another User** – Seamless user-to-user transfer
- **View Transaction History** – Detailed history of top-ups, withdrawals, and transfers

### 🧑‍💼 Agent Features

- **Cash In (Add Money) to User Wallets** – Accept cash and add money to users
- **Cash Out (Withdraw Money) from User Wallets** – Give cash and deduct from user
- **View Commission History** – See commission earnings
- **View Transaction History** – Review own transaction activity

### 🛠️ Admin Features

- **View All Data** – Access to all users, agents, wallets, and transactions
- **Block/Unblock Wallets** – Control wallet activity
- **Approve/Suspend Agents** – Maintain agent integrity

---

## 📡 API Endpoint Overview

### 👤 Create User (Wallet auto-created)

**POST:** `/api/v1/user/create`

**Description:** Create a new user account. Automatically creates a wallet and sends verification email.

**Auth Required:** No

**Request Body:**

```json
{
  "name": "Sohel4",
  "email": "sohel4@gmail.com",
  "password": "Sohel41234!"
}
```

**Success Response (201 Created):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "name": "Sohel4",
    "email": "sohel4@gmail.com",
    "password": "$2b$10$YIlxDnyP8C7fS5fQKGC2w.egdiE8yZI7tmhj/CCbvVQ2oMTm1w.bq",
    "role": "USER",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": false,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel4@gmail.com"
      }
    ],
    "_id": "688f8ecf76f2cfffebbcca53",
    "createdAt": "2025-08-03T16:31:11.797Z",
    "updatedAt": "2025-08-03T16:31:12.846Z",
    "wallet": "688f8ed076f2cfffebbcca56"
  }
}
```



