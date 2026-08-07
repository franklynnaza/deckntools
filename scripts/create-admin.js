// Script to create the first admin user
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// MongoDB connection string from .env
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deckntools';

async function createAdmin() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const adminsCollection = db.collection('admins');
    
    // Check if any admin already exists
    const adminCount = await adminsCollection.countDocuments();
    if (adminCount > 0) {
      console.log('An admin account already exists. No new admin can be created.');
      client.close();
      rl.close();
      return;
    }
    
    // Get admin email and password
    rl.question('Enter admin email: ', (email) => {
      rl.question('Enter admin password (min 6 characters): ', async (password) => {
        if (password.length < 6) {
          console.log('Password must be at least 6 characters long');
          rl.close();
          client.close();
          return;
        }
        
        try {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          
          // Create admin document
          const admin = {
            email,
            password: hashedPassword,
            createdAt: new Date()
          };
          
          // Insert admin into database
          const result = await adminsCollection.insertOne(admin);
          console.log(`Admin created successfully with ID: ${result.insertedId}`);
          
          // Close connections
          client.close();
          rl.close();
        } catch (error) {
          console.error('Error creating admin:', error);
          client.close();
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    rl.close();
  }
}

// Run the function
createAdmin();