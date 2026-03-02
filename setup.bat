@echo off
echo 🚀 Setting up Identity Reconciliation Service...

echo 📦 Installing dependencies...
call npm install

echo 🔧 Generating Prisma Client...
call npm run prisma:generate

echo 🗄️ Running database migrations...
call npm run prisma:migrate

echo ✅ Setup complete!
echo.
echo To start the server in development mode, run:
echo   npm run dev
echo.
echo To build and start in production mode, run:
echo   npm run build
echo   npm start
