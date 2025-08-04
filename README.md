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

### 👤Get single user (Only admin)

**GET:** `/api/v1/user/id`

**Description:** Retrieve single user information by user ID (Admin only)..

**Auth Required:** ✅ (Admin token)

**Request:** _none_

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Single User Retrieved Successfully",
  "data": {
    "_id": "688f3995e8f29b3f34f5d6dc",
    "name": "Sohel2",
    "email": "sohel2@gmail.com",
    "role": "AGENT",
    "isDeleted": false,
    "isActive": "ACTIVE",
    "isVerified": true,
    "auths": [
      {
        "provider": "credentials",
        "providerId": "sohel2@gmail.com"
      }
    ],
    "createdAt": "2025-08-03T10:27:33.128Z",
    "updatedAt": "2025-08-03T13:19:07.624Z",
    "wallet": "688f3995e8f29b3f34f5d6de",
    "agentApprovalStatus": "APPROVED"
  }
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

---

### ✏️ Delete user

**PATCH:** `/api/v1/user/delete/:id`

**Description:** Every user has the ability to delete their own account, wallet, transactions..

**Auth Required:** None.

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User, wallet, and transactions deleted successfully.",
  "data": null
}
```

---

### Auth Related Apis Endpoints

---

### ✏️ 1. Login

**POST:** `/api/v1/auth/login`

**Description:** Authenticate a user and generate an access token to use for authorized requests

**Auth Required:** None.

**Request:**

```json
{
  "email": "sohel3@gmail.com",
  "password": "Sohel31234!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Logged In Successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmNzU5ZWMzYjQzYjRiY2UxNTNhMDMiLCJlbWFpbCI6InNvaGVsM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NDI4NzExMCwiZXhwIjoxNzU0MzczNTEwfQ.-lzZblPS_jAMrYybeR1wbYIuTVwCRvrva3tlDSrXzF0",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmNzU5ZWMzYjQzYjRiY2UxNTNhMDMiLCJlbWFpbCI6InNvaGVsM0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NDI4NzExMCwiZXhwIjoxNzU2ODc5MTEwfQ.fOm8wnoy3tLKd7tFNuPETXf9nhehYSG9zTz2jYdORz8",
    "user": {
      "_id": "688f759ec3b43b4bce153a03",
      "name": "Sohel3",
      "email": "sohel3@gmail.com",
      "role": "USER",
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
      "updatedAt": "2025-08-03T14:43:42.878Z",
      "wallet": "688f759ec3b43b4bce153a05"
    }
  }
}
```

---

### ✏️ 2. Logout

**POST:** `/api/v1/auth/logout`

**Description:** User logout

**Auth Required:** None.

**Request:**

```json
{
  "email": "sohel.rana.web1@gmail.com",
  "password": "Sohel1web!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User Logged Out  Successfully",
  "data": null
}
```

---

### ✏️ 3. Change Passowrd

**POST:** `/api/v1/auth/change-password`

**Description:** Change password

**Auth Required:** (Current user Token).

**Request:**

```json
{
  "oldPassword": "Sohel1web!1!",
  "newPassword": "Sohel1web!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password Changed Successfully",
  "data": null
}
```

---

### ✏️ 3. Access/Refresh Token

**POST:** `/api/v1/auth/refresh-token`

**Description:** Get new access token for authorized instead login

**Auth Required:** (Current user Token not need automatically set cookie).

**Request:**

```json
{
  "email": "sohel@gmail.com",
  "password": "Sohel1234!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "New Access Token Retrieved Successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhmNzU5ZWMzYjQzYjRiY2UxNTNhMDMiLCJlbWFpbCI6InNvaGVsM0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTQyOTI1OTcsImV4cCI6MTc1NDM3ODk5N30.wHLtRB2HSTgMyseUYOnUxsU0uspCJcdgLC2uuk5DIrU"
  }
}
```

---

### ✏️ 4. Reset Password

**POST:** `/api/v1/auth/reset-password`

**Description:** Password reset

**Auth Required:** (Current user Token ).

**Request:**

```json
{
  "id": "688f759ec3b43b4bce153a03",
  "newPassword": "Sohel312345!"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password Reset Successfully",
  "data": null
}
```

---

### Wallet Related Apis Endpoints

---

### ✏️ 1. Top-up(Only user Allowed)

**POST:** `/api/v1/wallet/top-up`

**Description:** User can add own money for wallet

**Auth Required:** (Current user token).

**Request:**

```json
{
  "amount": 499
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Top up successful. Total deposited: 499.00 ৳",
  "data": {
    "oldBalance": "50.00",
    "newBalance": "549.00",
    "trxId": "trx_1754293772004_115"
  }
}
```

---

### ✏️ 2. Send Money(Only user)

**POST:** `/api/v1/wallet/send-money`

**Description:** User can send money any valid user(userId not WalletId)

**Auth Required:** (Current user token).

**Request:**

```json
{
  "receiverId": "688f759ec3b43b4bce153a03",
  "amount": 100,
  "reference": "send money 1"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Successfully sent 100 ৳ to user. Fee 5 ৳ deducted.",
  "data": {
    "oldBalance": 549,
    "newSenderBalance": 444,
    "trxId": "trx_1754294317340_710"
  }
}
```

---

### ✏️ 3. Cash-in (Only Agent can do this)

**POST:** `/api/v1/auth/change-password`

**Description:** Agent can cash-in any valid user(by userId)

**Auth Required:** (Current Agent Token).

**Request:**

```json
{
  "userId": "688f759ec3b43b4bce153a03",
  "amount": 200,
  "reference": "cash in 1"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cash in successful. Amount: 200 ৳, Agent commission paid from admin wallet: 0.80 ৳",
  "data": {
    "oldBalance": 2214.57,
    "newAgentBalance": 2015.37,
    "trxId": "trx_1754294509857_317"
  }
}
```

---

### ✏️ 4. Cash-out(Any valid user can this)

**POST:** `/api/v1/wallet/cash-out`

**Description:** Any valid user can cash-out to valid agent wallet(by agent!alletId)

**Auth Required:** (Current user Token).

**Request:**

```json
{
  "amount": 200,
  "agentWalletId": "688f3b18e8f29b3f34f5d6e8",
  "reference": "200 taka only"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cash out successful. Total deducted: 203.6 ৳",
  "data": {
    "oldBalance": 444,
    "totalDeducted": 203.6,
    "newBalance": 240.4,
    "fee": 3.6,
    "trxId": "trx_1754294772205_451"
  }
}
```

---

### ✏️ 5. update blockWallet to unblockWallet(Only Admin)

**PATCH:** `/api/v1/wallet/unblock/id`

**Description:** Admin changes the block Wallet to unblockWallet. give walletId.

**Auth Required:** (Admin Token ).

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet has been unblocked successfully",
  "data": {
    "_id": "689065c6ed3c3c3d00883c2a",
    "owner": "689065c6ed3c3c3d00883c28",
    "balance": 240.4,
    "isBlocked": false,
    "transactions": ["6890660ced3c3c3d00883c32", "689069f4b9444bee785c298b"],
    "createdAt": "2025-08-04T07:48:22.349Z",
    "updatedAt": "2025-08-04T08:13:57.279Z"
  }
}
```

---

### ✏️ 6.Get Wallet and Transaction history

**GET:** `/api/v1/wallet/wallet-trnx-history`

**Description:** All Role can see wallet and transaction history.

**Auth Required:** (Current user token ).

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet and transaction history fetched successfully",
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 3,
    "totalPage": 1,
    "count": 3
  },
  "data": {
    "wallet": {
      "balance": 457.2,
      "isBlocked": false
    },
    "transactions": [
      {
        "type": "CASH_OUT",
        "amount": 500,
        "commission": 2,
        "trxId": "trx_1754228371918_847"
      },
      {
        "type": "CASH_IN",
        "amount": 500,
        "commission": 2,
        "trxId": "trx_1754229089851_365"
      },
      {
        "type": "CASH_OUT",
        "amount": 200,
        "commission": 0.8,
        "trxId": "trx_1754294772205_451"
      }
    ]
  }
}
```

---

### Transactions Related Apis Endpoints

---

### ✏️ 1. Get All Transactions (Only Admin Allowed)

**GET:** `/api/v1/trx/all-transactions`

**Description:** Admin can see All Transactions

**Auth Required:** (Admin token).

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All Transactions Retrieved Successfully",
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 20,
    "totalPage": 4,
    "count": 5
  },
  "data": [
    {
      "_id": "689069f4b9444bee785c298b",
      "type": "CASH_OUT",
      "amount": 200,
      "status": "COMPLETED"
    },
    {
      "_id": "689068edb9444bee785c297d",
      "type": "CASH_IN",
      "amount": 200,
      "status": "COMPLETED"
    },
    {
      "_id": "6890682db9444bee785c2974",
      "type": "SEND_MONEY",
      "amount": 100,
      "status": "COMPLETED"
    },
    {
      "_id": "6890660ced3c3c3d00883c32",
      "type": "ADD_MONEY",
      "amount": 499,
      "status": "COMPLETED"
    },
    {
      "_id": "688f86827547247bf41b0c3b",
      "type": "CASH_IN",
      "amount": 200,
      "status": "COMPLETED"
    }
  ]
}
```

---

### ✏️ 2. Get Single transaction with trxId(Any valid user)

**GET:** `/api/v1/trx/transaction/id` TrxId: (trx_1754225437348_243)

**Description:** User can see specific transaction by TrxId: (trx_1754225437348_243)

**Auth Required:** None.

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Transaction fetched successfully",
  "data": {
    "_id": "688f5b1d5080ad9f9f511b47",
    "type": "ADD_MONEY",
    "amount": 200,
    "fee": 0,
    "commission": 0,
    "status": "COMPLETED",
    "initiatedBy": "USER",
    "user": "688f3ad7e8f29b3f34f5d6e1",
    "trxId": "trx_1754225437348_243",
    "createdAt": "2025-08-03T12:50:37.352Z",
    "updatedAt": "2025-08-03T12:50:37.352Z"
  }
}
```

---

### OTP Related Apis Endpoints

---

### ✏️ 1. Send OTP (Any user for verify by email)

**POST:** `/api/v1/otp/send`

**Description:** For verifying User

**Auth Required:** None.

**Request:**

```json
{
  "name": "Sohel",
  "email": "sohel.rana.web1@gmail.com"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP sent successfully",
  "data": null
}
```

---

### ✏️ 2. Very OTP

**POST:** `/api/v1/otp/verify`

**Description:** verify user by get otp from email

**Auth Required:** None.

**Request:**

```json
{
  "email": "sohel.rana.web1@gmail.com",
  "otp": "264626"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "OTP verified successfully",
  "data": null
}
```

---

### Stats Related Apis Endpoints(Only Admin)

---

### ✏️ 1. Get Users Stats (Only Admin)

**GET:** `/api/v1/stats/user`

**Description:** Admin can see all user stats

**Auth Required:** Admin token.

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User stats fetched successfully",
  "data": {
    "totalUsers": 7,
    "totalActiveUsers": 7,
    "totalInActiveUsers": 0,
    "totalBlockedUsers": 0,
    "newUsersInLast7Days": 7,
    "newUsersInLast30Days": 7,
    "usersByRole": [
      {
        "_id": "USER",
        "count": 2
      },
      {
        "_id": "ADMIN",
        "count": 1
      },
      {
        "_id": "AGENT",
        "count": 4
      }
    ]
  }
}
```

---

### ✏️ 2. Transactions Stats

**GET:** `/api/v1/stats/transactions`

**Description:** All Transactions stats

**Auth Required:** (Admin token)

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Admin Dashboard Summary of transactions for range: all",
  "data": {
    "summary": {
      "CASH_OUT": {
        "totalCount": 8,
        "totalAmountOverall": 1957.99,
        "totalCommissionOverall": 7.84,
        "totalFeeOverall": 35.24,
        "counts": {
          "COMPLETED": {
            "count": 8,
            "totalAmount": 1957.99,
            "totalCommission": 7.84,
            "totalFee": 35.24
          }
        }
      },
      "CASH_IN": {
        "totalCount": 7,
        "totalAmountOverall": 2100,
        "totalCommissionOverall": 8.4,
        "totalFeeOverall": 0,
        "counts": {
          "PENDING": {
            "count": 1,
            "totalAmount": 500,
            "totalCommission": 2,
            "totalFee": 0
          },
          "COMPLETED": {
            "count": 6,
            "totalAmount": 1600,
            "totalCommission": 6.4,
            "totalFee": 0
          }
        }
      },
      "SEND_MONEY": {
        "totalCount": 2,
        "totalAmountOverall": 300,
        "totalCommissionOverall": 0,
        "totalFeeOverall": 10,
        "counts": {
          "COMPLETED": {
            "count": 2,
            "totalAmount": 300,
            "totalCommission": 0,
            "totalFee": 10
          }
        }
      },
      "ADD_MONEY": {
        "totalCount": 3,
        "totalAmountOverall": 2699,
        "totalCommissionOverall": 0,
        "totalFeeOverall": 0,
        "counts": {
          "COMPLETED": {
            "count": 3,
            "totalAmount": 2699,
            "totalCommission": 0,
            "totalFee": 0
          }
        }
      }
    },
    "totalPlatformTransactionAmount": 7056.99,
    "totalAgentCommission": 16.24,
    "totalAdminIncome": 45.24
  }
}
```

---

### ✏️ 3. Wallets Stats

**GET:** `/api/v1/stats/wallets`

**Description:** All Wallets stats

**Auth Required:** (Admin token)

**Request:** None

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Wallet Summary fetched successfully",
  "data": {
    "totalWallets": 7,
    "blockedWallets": 0,
    "unblockedWallets": 7
  }
}
```

---
