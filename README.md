# Identity Reconciliation Service

A backend service for Bitespeed's Identity Reconciliation system that links customer contact information across multiple purchases.

## 🎯 Problem Statement

FluxKart.com needs to identify and track customers who use different email addresses and phone numbers across multiple purchases. This service consolidates contact information to provide a unified customer identity.

## 🏗️ Tech Stack

- **Backend**: Node.js with JavaScript
- **Framework**: Express.js
- **Database**: SQLite (via Prisma ORM)
- **ORM**: Prisma

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Generate Prisma Client**:

```bash
npm run prisma:generate
```

3. **Run database migrations**:

```bash
npm run prisma:migrate
```

## 🏃 Running the Application

### Quick Start (Recommended for Windows)

```bash
start-server.bat
```

This automatically stops any existing server and starts a fresh instance.

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Using Custom Port

```bash
PORT=3001 npm start
```

Or in PowerShell:

```powershell
$env:PORT=3001; npm start
```

The server will start on `http://localhost:3000` (or your custom port)

### Managing the Server

**Stop the server:**

```bash
stop-server.bat
```

Or press `Ctrl+C` in the terminal where the server is running.

## 📡 API Endpoint

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
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

## 🧪 Testing Examples

### Example 1: Creating a new contact

**Request**:

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lorraine@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```

**Response**:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### Example 2: Adding new information (creates secondary contact)

**Request**:

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mcfly@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```

**Response**:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

### Example 3: Linking two primary contacts

**Setup**: First create two separate primary contacts

```bash
# Create first primary contact
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "919191"
  }'

# Create second primary contact
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "biffsucks@hillvalley.edu",
    "phoneNumber": "717171"
  }'
```

**Now link them**:

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "george@hillvalley.edu",
    "phoneNumber": "717171"
  }'
```

**Response**:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
    "phoneNumbers": ["919191", "717171"],
    "secondaryContactIds": [2]
  }
}
```

### Example 4: Query with only email or phone

**Request**:

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mcfly@hillvalley.edu"
  }'
```

Returns the same consolidated contact information.

## 🗄️ Database Schema

```prisma
model Contact {
  id              Int       @id @default(autoincrement())
  phoneNumber     String?
  email           String?
  linkedId        Int?
  linkPrecedence  String    // "primary" or "secondary"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?
}
```

## 🔍 How It Works

1. **New Contact**: When no matching contacts exist, creates a new primary contact
2. **Partial Match**: When email OR phone matches existing contact(s), links to the primary contact
3. **New Information**: Creates secondary contacts when new email/phone combinations are discovered
4. **Primary Merge**: When two separate primary contacts are linked, the older one remains primary

## 📦 Project Structure

```
identity-reconciliation/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── server.js            # Express server setup
│   ├── routes.js            # API routes
│   └── contactService.js    # Business logic
├── start-server.bat         # Helper script to start server (Windows)
├── stop-server.bat          # Helper script to stop server (Windows)
├── start-server.sh          # Helper script for Linux/Mac
├── package.json
└── README.md
```

## 🛠️ Useful Commands

- `npm run dev` - Run in development mode
- `npm start` - Start server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Run database migrations

## 🧹 Database Management

To view and manage your database:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit database records.

## 📝 Notes

- The service uses SQLite for simplicity. For production, consider PostgreSQL or MySQL
- All timestamps are in UTC
- The `deletedAt` field is for soft deletes (not currently implemented)
- Contact IDs in responses maintain the order of creation (oldest first)

## 🐛 Troubleshooting

**Issue**: `Cannot find module '@prisma/client'`
**Solution**: Run `npm run prisma:generate`

**Issue**: Database not found
**Solution**: Run `npm run prisma:migrate`

**Issue**: Port 3000 already in use
**Solutions**:

1. Use the helper script: `start-server.bat` (automatically stops existing server)
2. Stop the existing server: `stop-server.bat`
3. Use a different port: `PORT=3001 npm start`
4. Find and kill the process manually: `netstat -ano | findstr :3000`

**Issue**: Server crashes on startup
**Solution**: Check if all dependencies are installed with `npm install`

**Issue**: "EADDRINUSE" error
**Solution**: The improved error handler now shows helpful messages. Follow the on-screen suggestions.

---

Built with ❤️ for Bitespeed Backend Task
