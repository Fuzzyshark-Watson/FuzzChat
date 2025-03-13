import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Database, initializeDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const SECRET_KEY = 'eggscrambler';

initializeDatabase();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// Add a debug log to show the server is running
console.log('✅ Starting HTTP server...');

app.post('/login', async (req, res) => {
  const { account, password } = req.body;
  console.log('🔑 Received login request:', { account, password }); // Debug log to show received data

  try {
    // Debug log to show if the request body is received correctly
    console.log(`🔍 Querying database for user: ${account}`);

    // Now await the promise returned by getUserDetailsByUsername
    const userDetails = await Database.getUserDetailsByUsername(account);

    if (!userDetails) {
      console.log(`❌ No user found with username: ${account}`);
      return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
    }

    console.log(`✅ User found: ${userDetails.account.name}`);

    // Check password
    if (userDetails.account.password === password) {
      console.log('✅ Password matched, generating JWT token');

      // Create the token (you could dynamically create the ticket here as well)
      const token = jwt.sign({ username: userDetails.account.name }, SECRET_KEY, { expiresIn: '1h' });

      // Send the user details along with the ticket, characters, and bookmarks
      console.log('📩 Sending response with user details');
      res.json({
        status: 'success',
        ticket: token,
        characters: userDetails.characters,  // Return the character list
        bookmarks: userDetails.bookmarks     // Return the bookmarks
      });
    } else {
      console.log(`❌ Invalid password for user: ${account}`);
      res.status(401).json({ status: 'error', message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Starting the HTTP server
server.listen(3000, () => {
  console.log('✅ HTTP server running on http://localhost:3000');
});

process.on('SIGINT', () => {
  console.log('\n❌ Shutting down HTTP server...');
  process.exit();
});
