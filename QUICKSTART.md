# Quick Start Guide

## One-Step Setup (Windows)

```bash
setup.bat
```

## One-Step Setup (Linux/Mac)

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup

If the setup script doesn't work, follow these steps:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Generate Prisma Client**:

   ```bash
   npm run prisma:generate
   ```

3. **Run migrations**:

   ```bash
   npm run prisma:migrate
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

## Verify Installation

Once the server is running, test the health endpoint:

```bash
curl http://localhost:3000/health
```

You should see: `{"status":"ok"}`

## Run Your First Test

```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"phoneNumber\":\"1234567890\"}"
```

## Next Steps

- See [README.md](README.md) for complete documentation
- See [TEST_CASES.md](TEST_CASES.md) for comprehensive test scenarios
- Use `npm run prisma:studio` to view the database

## Troubleshooting

**Issue**: Command not found

- Make sure Node.js is installed: `node --version`
- Make sure npm is installed: `npm --version`

**Issue**: Port already in use

- Change the port: `PORT=3001 npm run dev`

**Issue**: Prisma errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Run `npm run prisma:generate`
