const { execSync } = require('child_process');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function setup() {
  console.log('🚀 Starting Restaurant Ordering API setup...\n');

  try {
    // Step 1: Start Docker
    console.log('📦 Starting DynamoDB Local...');
    execSync('docker-compose up -d', { stdio: 'inherit' });
    
    // Step 2: Wait for DynamoDB to be ready
    console.log('⏳ Waiting for DynamoDB to be ready (5 seconds)...');
    await delay(5000);
    
    // Step 3: Initialize database
    console.log('🗄️  Initializing database...');
    execSync('npm run init:db', { stdio: 'inherit' });
    
    console.log('\n✅ Setup complete! You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
