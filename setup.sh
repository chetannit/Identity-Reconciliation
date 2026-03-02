#!/bin/bash

echo "🚀 Setting up Identity Reconciliation Service..."

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma Client..."
npm run prisma:generate

echo "🗄️ Running database migrations..."
npm run prisma:migrate

echo "✅ Setup complete!"
echo ""
echo "To start the server in development mode, run:"
echo "  npm run dev"
echo ""
echo "To build and start in production mode, run:"
echo "  npm run build"
echo "  npm start"
