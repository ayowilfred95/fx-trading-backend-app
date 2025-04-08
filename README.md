# Currency Exchange & Wallet Management API

## 📘 Overview

This application enables users to manage wallets, perform transactions, and verify identities using OTPs (One-Time Passwords). Built with **NestJS** and **TypeORM**, it features a modular, scalable backend architecture.

---

## 📌 Key Assumptions

- **User Authentication**: Registration and email verification are required before accessing features.
- **Supported Currencies**: NGN, USD, EUR, GBP.
- **Transaction Types**: Funding, currency conversion, and transfers.
- **OTP Verification**: Sent to user’s registered email during sensitive operations.
- **Database**: PostgreSQL for storing all user, wallet, and transaction records.

---

## ⚙️ Setup Instructions

### 🧰 Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayowilfred95/fx-trading-backend-app
   cd fx-trading-backend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE_IN=1h
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASSWORD=your_smtp_password
   SMTP_FROM=your_email@example.com
   ```

---

### 🐳 Docker Setup

1. **Install Docker & Docker Compose**  
   Download from [Docker's official site](https://www.docker.com/products/docker-desktop)

2. **Start PostgreSQL with Docker Compose**
   ```bash
   docker-compose up -d
   ```

Docker configuration includes:
- PostgreSQL 15
- Port: 5432
- Persistent volume
- `.env`-based environment variables

---

### 🧬 Database Migrations

### 🚀 Start Application

```bash
npm run start:dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📚 API Documentation

### 🔗 Postman Collection

Find the full API reference in the linked [Postman Collection](https://www.postman.com/your-collection-link).

---

### 🔐 Authentication

- **POST** `/auth/register`
- **POST** `/auth/login`
- **POST** `/auth/verify`

Each route returns consistent response structures including JWT tokens and user data.

Example: `/auth/register`
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "isVerified": false
    }
  },
  "message": "Please check your email to verify your account"
}
```

---

### 💳 Wallet Management

- **POST** `/wallet/fund`
- **POST** `/wallet/convert`
- **POST** `/wallet/trade`

Example: `/wallet/fund`
```json
{
  "success": true,
  "data": {
    "wallet": {
      "newBalance": 322411.1916,
      "currencyCode": "NGN"
    }
  },
  "message": "Wallet funded successfully"
}
```

---

## 🧠 Architectural Decisions

### 🔧 Frameworks & Tools

- **Backend**: NestJS (v10+)
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Containerization**: Docker Compose
- **Authentication**: JWT, Passport.js

### 🔐 Authentication & Authorization

- **JWT Auth**: `@nestjs/jwt`, `passport-jwt`, custom guards
- **RBAC**: Custom `RolesGuard`, route-level decorators
- **Roles**: `ADMIN > USER`

---

### 🔐 Security Features

- Password Hashing: `bcrypt`
- Request Validation: `class-validator`
- Role Guard: `Passport Strategy`

---

### ✉️ Email Service

- **SMTP Integration**: Configurable via `.env`
- **Nodemailer**: OTPs, transaction alerts, updates
- **Templates**: Reusable for various email types

---

### 🧱 Business Logic Architecture

- **Service-Oriented Design**
- **Repository Pattern**
- **DTOs for validation**
- **Custom Exceptions**

#### Core Services

- `UserService`: User lifecycle, auth
- `WalletService`: Funding, conversion, trades
- `ExchangeRateService`: Currency rates
- `EmailService`: Notifications, OTPs

---

### 💱 Exchange Rate Management

- **Real-time Updates**: Every 5 mins via cron
- **Caching**: In-memory + DB fallback
- **Source**: External API integration

```ts
@Cron(CronExpression.EVERY_5_MINUTES)
async fetchLatestRates() {
  try {
    // Update rates
  } catch (error) {
    // fallback
  }
}
```

---

## 🧪 Testing Strategy

- **Unit Testing**: Jest, mocks, coverage
- **Integration**: Real DB, Testcontainers
- **E2E**: Supertest, full flows

---

## ⚡ Performance Optimization

- **Caching**: Rates, requests
- **Rate Limiting**: IP & user-based
- **DB Optimization**: Indexing, pooling, efficient queries

---

