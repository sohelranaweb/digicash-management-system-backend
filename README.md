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
---
## 👤 Get All Users (Only Admin)

**GET:** `/api/v1/user/all-users`

**Description:** Retrieve a paginated list of all users in the system (Admin only).

**Auth Required:** Yes (Admin token)

**Request Body:** None

**Success Response (200 OK):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All Users Retrieved Successfully",
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 7,
    "totalPage": 2,
    "count": 5
  },
  "data": [
    {
      "_id": "688f8ecf76f2cfffebbcca53",
      "name": "Sohel4",
      "email": "sohel4@gmail.com"
    },
    {
      "_id": "688f759ec3b43b4bce153a03",
      "name": "Sohel3",
      "email": "sohel3@gmail.com"
    },
    {
      "_id": "688f3b97e8f29b3f34f5d6ef",
      "name": "MS RANA",
      "email": "msr3876@gmail.com"
    },
    {
      "_id": "688f3b18e8f29b3f34f5d6e6",
      "name": "Sohel",
      "email": "sohel@gmail.com"
    },
    {
      "_id": "688f3ad7e8f29b3f34f5d6e1",
      "name": "Sohel",
      "email": "sohel.rana.web1@gmail.com"
    }
  ]
}
```
---

### 👤 Get Me (Current Logged-In User)

**GET:** `/api/v1/user/me`

**Description:** Retrieve current logged-in user’s info.

**Auth Required:** ✅ (Bearer Token)

**Request:** _none_

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Get me Retrieved Successfully",
  "data": {
    "_id": "688f3ad7e8f29b3f34f5d6e1",
    "name": "Sohel",
    "email": "sohel.rana.web1@gmail.com",
    "role": "AGENT",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": true,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel.rana.web1@gmail.com"
      }
    ],
    "createdAt": "2025-08-03T10:32:55.883Z",
    "updatedAt": "2025-08-03T15:53:36.769Z",
    "wallet": "688f3ad7e8f29b3f34f5d6e3",
    "agentApprovalStatus": "APPROVED"
  }
}
```

---

### 🧾 Agent Request (User wants to become an agent)

**POST:** `/api/v1/user/request-agent`

**Description:** Submit a request to become an agent (by current user).

**Auth Required:** ✅ (User Token)

**Request:** _none_

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent request submitted, waiting for admin approval",
  "data": {
    "_id": "688f8ecf76f2cfffebbcca53",
    "name": "Sohel4",
    "email": "sohel4@gmail.com",
    "password": "$2b$10$YIlxDnyP8C7fS5fQKGC2w.egdiE8yZI7tmhj/CCbvVQ2oMTm1w.bq",
    "role": "AGENT",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": true,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel4@gmail.com"
      }
    ],
    "createdAt": "2025-08-03T16:31:11.797Z",
    "updatedAt": "2025-08-04T05:44:33.674Z",
    "wallet": "688f8ed076f2cfffebbcca56",
    "agentApprovalStatus": "PENDING"
  }
}
```

---

### ✅ Agent Approved (Requesting agent is approved by admin)

**PATCH:** `/api/v1/user/approve-agent/:id`

**Description:** Approve the requested agent (by admin).

**Auth Required:** ✅ (Admin)

**Request:** _none_

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Agent approved succesfully",
  "data": {
    "_id": "688f8ecf76f2cfffebbcca53",
    "name": "Sohel4",
    "email": "sohel4@gmail.com",
    "password": "$2b$10$YIlxDnyP8C7fS5fQKGC2w.egdiE8yZI7tmhj/CCbvVQ2oMTm1w.bq",
    "role": "AGENT",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": true,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel4@gmail.com"
      }
    ],
    "createdAt": "2025-08-03T16:31:11.797Z",
    "updatedAt": "2025-08-04T05:47:20.661Z",
    "wallet": "688f8ed076f2cfffebbcca56",
    "agentApprovalStatus": "APPROVED"
  }
}
```

---

### ✏️ Update User (Admin can change user role)

**PATCH:** `/api/v1/user/update/:id`

**Description:** Admin can update a user’s role.

**Auth Required:** ✅ (Admin)

**Request:**

```json
{
  "role": "ADMIN"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User Updated Successfully",
  "data": {
    "_id": "688f759ec3b43b4bce153a03",
    "name": "Sohel3",
    "email": "sohel3@gmail.com",
    "password": "$2b$10$wdN3ULlCto8Bd38QcyRo0u9dGVi6aLLMLSoW0uf3hGkoM7cvDLR42",
    "role": "ADMIN",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": true,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel3@gmail.com"
      }
    ],
    "createdAt": "2025-08-03T14:43:42.667Z",
    "updatedAt": "2025-08-04T05:59:25.208Z",
    "wallet": "688f759ec3b43b4bce153a05"
  }
}
```

---
