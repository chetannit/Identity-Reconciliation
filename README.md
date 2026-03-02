# Identity Reconciliation Service

A backend service for Bitespeed's Identity Reconciliation system that links customer contact information across multiple purchases.

## 🎯 Problem Statement

FluxKart.com needs to identify and track customers who use different email addresses and phone numbers across multiple purchases. This service consolidates contact information to provide a unified customer identity.

## 🏗️ Tech Stack

- **Backend**: Node.js with JavaScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (for production)

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:

```bash
npm install
```

2. **Setup database**:

```bash
# Create .env file
echo "DATABASE_URL=your_database_url" > .env

# Run migrations
npx prisma migrate deploy
```

3. **Start server**:

```bash
npm start
```

The server will start on `http://localhost:3000`

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/identity_db
PORT=3000
```

## 📡 API Endpoints

### GET /health

Health check endpoint.

**Response**: `{"status":"ok"}`

### POST /identify

Identifies and consolidates contact information.

**Request Body**:

```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

**Response**:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["email1@example.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

## 🧪 Testing Example

```bash
# Create a contact
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"123456"}'

# Add secondary contact
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","phoneNumber":"123456"}'
```

## 🗄️ Database Schema

```sql
CREATE TABLE "Contact" (
    "id" SERIAL PRIMARY KEY,
    "phoneNumber" TEXT,
    "email" TEXT,
    "linkedId" INTEGER,
    "linkPrecedence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);
```

## 🔍 How It Works

1. **New Contact**: Creates primary contact when no match exists
2. **Partial Match**: Links to existing primary contact when email OR phone matches
3. **New Information**: Creates secondary contacts for new combinations
4. **Primary Merge**: Older primary contact takes precedence when merging

## 📦 Project Structure

```
identity-reconciliation/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── src/
│   ├── server.js                  # Express server
│   ├── routes.js                  # API routes
│   └── contactService.js          # Business logic
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

## 🚀 Deployment

### Render.com (Recommended)

1. Create PostgreSQL database on Render
2. Create Web Service connected to your GitHub repo
3. Set environment variable: `DATABASE_URL`
4. Deploy!

Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
Start command: `npm start`

## 📝 Notes

- Database uses PostgreSQL for production
- All timestamps are in UTC
- Contact IDs ordered by creation time (oldest first)

---

Built for Bitespeed Backend Task
