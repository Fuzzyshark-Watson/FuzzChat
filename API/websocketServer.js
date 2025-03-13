import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { Database } from './database.js';

const SECRET_KEY = 'eggscrambler';
const activeConnections = new Map(); // Stores { username: ws }

const wss = new WebSocketServer({ port: 3001 });

console.log('🌐 WebSocket Server is running on ws://localhost:3001');

wss.on('connection', (ws) => {
  console.log('🔗 Client connected');

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('📩 Received:', parsedMessage);

      if (!parsedMessage.action) {
        ws.send(JSON.stringify({ status: 'error', message: 'Missing action' }));
        return;
      }

      const action = parsedMessage.action.trim().toUpperCase();
      console.log('📩 Received:', action);
      switch (action) {
        case 'IDN': // Handle login
          await handleLogin(parsedMessage, ws);
          break;
        case 'MSG': // Handle messages
          await MessageToChannel(parsedMessage, ws);
          break;
        default:
          ws.send(JSON.stringify({ status: 'error', message: `Unknown action: ${parsedMessage.action}` }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ status: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    if (ws.user) {
      console.log(`❌ Client disconnected: ${ws.user.username}`);
      activeConnections.delete(ws.user.username); // Remove from active connections
    }
  });
});

/** Handle login via IDN */
async function handleLogin(message, ws) {
  const { account, ticket, character } = message;

  try {
    const user = await Database.getUserDetailsByUsername(account);
    if (!user) {
      ws.send(JSON.stringify({ status: 'error', message: 'User not found' }));
      return;
    }

    jwt.verify(ticket, SECRET_KEY, (err, decoded) => {
      if (err) {
        ws.send(JSON.stringify({ status: 'error', message: 'Invalid ticket' }));
        return;
      }

      console.log(`✅ User authenticated: ${decoded.username}`);

      // Store user in WebSocket session
      ws.user = {
        username: decoded.username,
        character: character || null
      };

      activeConnections.set(decoded.username, ws); // Store WebSocket connection

      ws.send(JSON.stringify({
        status: 'success',
        message: 'Connected to WebSocket',
        userDetails: {
          username: decoded.username,
          characters: user.characters || [],
          bookmarks: user.bookmarks || [],
          activeCharacter: character || null
        }
      }));
    });
  } catch (error) {
    ws.send(JSON.stringify({ status: 'error', message: 'Internal error during login' }));
  }
}

/** Handle messages and infer the sender */
async function MessageToChannel(message, ws) {
  if (!ws.user) {
    ws.send(JSON.stringify({ status: 'error', message: 'Unauthorized: No active session' }));
    return;
  }

  const { character } = ws.user; // Infer character from connection
  const { channel, message: chatMessage } = message;

  if (!character || !channel || !chatMessage) {
    ws.send(JSON.stringify({ status: 'error', message: 'Invalid message structure' }));
    return;
  }

  console.log(`💬 Message from ${character} in ${channel}: ${chatMessage}`);

  // Broadcast to all users (or implement channel-specific logic)
  for (const [username, clientWs] of activeConnections.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({
        action: 'MSG',
        character,
        message: chatMessage,
        channel
      }));
    }
  }
}
