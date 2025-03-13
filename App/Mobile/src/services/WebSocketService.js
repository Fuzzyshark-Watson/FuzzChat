import { ref } from 'vue';

class WebSocketService {
  constructor() {
    if (!WebSocketService.instance) {
      this.ws = ref(null);
      this.token = ref(null);
      this.username = ref(null);
      this.characters = ref(null);
      this.bookmarks = ref(null);
      this.reconnectInterval = 5000; // 5 seconds
      this.serverUrl = 'ws://localhost:3001';
      this.messageHandlers = []; // Handlers for incoming messages

      WebSocketService.instance = this;
    }

    return WebSocketService.instance;
  }

  connect() {
    if (this.ws.value) {
      console.log('[WebSocket] Already connected.');
      return;
    }

    console.log('[WebSocket] Connecting...');
    this.ws.value = new WebSocket(this.serverUrl);

    this.ws.value.onopen = () => {
      console.log('[WebSocket] Connection established.');
    };

    this.ws.value.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('[WebSocket] Message received:', response);

      // Handle messages
      if (response.action === 'MSG' && response.channel) {
        this.messages.value.push(response); // Store message

        // Notify listeners (chat components)
        this.messageHandlers.forEach((handler) => handler(response));
      }
    };

    this.ws.value.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    this.ws.value.onclose = () => {
      console.log('[WebSocket] Connection closed. Attempting reconnect in 5s...');
      this.ws.value = null;
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  sendIdentification(action, data = {}) {
    console.log('Send Identification: ', data);
  
    if (!this.ws.value || this.ws.value.readyState !== WebSocket.OPEN) {
      console.log('[WebSocket] Connection not open. Connecting...');
      this.connect();
  
      // Wait for connection before sending
      setTimeout(() => {
        if (this.ws.value.readyState === WebSocket.OPEN) {
          this._sendIdentificationMessage(action, data);
        } else {
          console.warn('[WebSocket] Connection still not open. Retrying...');
          setTimeout(() => this.sendIdentification(action, data), 1000);
        }
      }, 1000);
    } else {
      this._sendIdentificationMessage(action, data);
    }
  }
  

  _sendIdentificationMessage(action, data) {
    const identificationData = {
      method: 'ticket',
      account: this.username.value,
      ticket: this.token.value,
      character: data.character,
      cname: 'Fuzzchat',
    };

    console.log(`[WebSocket] Sending Identification message:`, identificationData);
    this.ws.value.send(JSON.stringify({ action, ...identificationData }));
  }

  sendMessage(action, data = {}) {
    if (!this.ws.value || this.ws.value.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Connection not open. Retrying in 1s...');
      setTimeout(() => this.sendMessage(action, data), 1000);
      return;
    }

    if (this.token.value) {
      data.token = this.token.value;
    }

    this.ws.value.send(JSON.stringify({ action, ...data }));
    console.log(`[WebSocket] Sent message: ${action}`, data);
  }
  

  close() {
    if (this.ws.value) {
      this.ws.value.close();
      console.log('[WebSocket] Connection closed manually.');
    }
  }

  storeUsername(user) {
    this.username.value = user;
    console.log('[WebSocket] Username stored:', this.username.value);
  }

  storePassword(pw) {
    this.password.value = pw;
    console.log('[WebSocket] Password stored.');
  }

  storeToken(token) {
    this.token.value = token;
    console.log('[WebSocket] Token stored:', this.token.value);
  }

  storeCharacters(characters) {
    this.characters.value = characters;
    console.log('[WebSocket] Characters stored:', this.characters.value);
  }

  storeBookmarks(bookmarks) {
    this.bookmarks.value = bookmarks;
    console.log('[WebSocket] Bookmarks stored:', this.bookmarks.value);
  }

  getUsername() {
    return this.username.value;
  }

  getToken() {
    return this.token.value;
  }

  getCharacters() {
    return this.characters.value;
  }

  getBookmarks() {
    return this.bookmarks.value;
  }

  onMessage(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    } else {
      console.error('[WebSocket] onMessage handler must be a function');
    }
  }

  
}
const instance = new WebSocketService();
Object.freeze(instance);
export default instance;



// Client-side:
// Read "PIN {}", return "PIN {}".

// Login as “Character”:
// IDN { "method": "ticket", "account": string, "ticket": string, "character": string, "cname": string, "cversion": string }

// Change your character status: (K5: Join a public or private Chatroom)
// STA { "status": enum, "statusmsg": string }

// Create Private:
// CCR { "channel": string }

// Invite to channel:
// CIU { "channel": string, "character": string }

// Lookup public channels:
// CHA

// Lookup private channels:
// ORS

// Create an official channel:
// CRC { "channel": string }

// Set new channel owner:
// CSO {"character":"string","channel":"string"}

// Request to join channel:
// JCH { "channel": string }

// Delete channel:
// KIC { "channel": string }

// Leave Channel:
// LCH { "channel": string }

// Message inside channel: (K10: Message Channel)
// MSG { "channel": string, "message": string }

// Change a channel to either private or public:
// RST { "channel": string, "status": enum }

// Send a private message: (K11: Private Message)
// PRI { "recipient": string, "message": string }

// Typing status:
// TPN { "character": string, "status": enum }
// Status: can have a value of "clear", "paused", and "typing".


// Character has left channel:
// LCH { "channel": string, "character": character }

// Sent by the server to inform the client a given character went offline.
// FLN { "character": string }