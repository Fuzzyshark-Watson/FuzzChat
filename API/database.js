import sqlite3 from 'sqlite3';
import path from 'path';

const DEBUG = true;

// Specify the path to your SQLite database
const dbPath = path.resolve('C:/temp/FuzzChat/API/db.sqlite'); // Adjust the path as necessary

// Create the SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run("PRAGMA foreign_keys = ON;");
  }
});

// Initialize the database and create tables if not already created
export function initializeDatabase() {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Accounts (account_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS Characters (character_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, gender TEXT NOT NULL, status TEXT NOT NULL, account_id INTEGER, FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS Messages (message_id INTEGER PRIMARY KEY AUTOINCREMENT, MessageContent TEXT NOT NULL, account_id INTEGER, FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS Bookmarks (bookmark_id INTEGER PRIMARY KEY AUTOINCREMENT, bookmarked_Character_id INTEGER, account_id INTEGER, FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE, FOREIGN KEY (bookmarked_Character_id) REFERENCES Characters (character_id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS Channels (channel_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, account_id INTEGER, creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (account_id) REFERENCES Accounts (account_id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS Channels_Characters (Channels_channel_id INTEGER, Characters_character_id INTEGER, PRIMARY KEY (Channels_channel_id, Characters_character_id), FOREIGN KEY (Channels_channel_id) REFERENCES Channels (channel_id) ON DELETE CASCADE, FOREIGN KEY (Characters_character_id) REFERENCES Characters (character_id) ON DELETE CASCADE)");
    console.log("Database initialized with tables.");
  });
}

// Helper functions to interact with the database
export const Database = {
  // Get user details by account name (fetch account, characters, bookmarks, and friends)
  getUserDetailsByUsername(username) {
    return new Promise((resolve, reject) => {
      // Fetch account details first
      const queryAccount = `SELECT * FROM Accounts WHERE name = ?`;
      if (DEBUG) console.log(`getUserDetailsByUsername: Executing query: ${queryAccount} with username: ${username}`);
  
      db.get(queryAccount, [username], (err, accountRow) => {
        if (DEBUG) {
          console.log(`getUserDetailsByUsername: Received account row: ${JSON.stringify(accountRow)}`);
          if (err) console.error(`getUserDetailsByUsername: Error: ${err.message}`);
        }
  
        if (err || !accountRow) {
          reject({ error: 'User not found' });
          return;
        }
  
        const accountId = accountRow.account_id;
        const result = {
          account: accountRow,
          default_character: accountRow.default_character,
          characters: {}, // Initialize as empty object for character names and ids
          ticket: 'fct_e82e211c8483b807c2b930b2', // Example static ticket (could be dynamic later)
          friends: [], // Initialize empty friends list
          bookmarks: [], // Initialize empty bookmarks list
          error: ''
        };
  
        // Fetch characters by account ID
        const queryCharacters = `SELECT * FROM Characters WHERE account_id = ?`;
        if (DEBUG) console.log(`getUserDetailsByUsername: Executing query: ${queryCharacters} with account_id: ${accountId}`);
  
        db.all(queryCharacters, [accountId], (err, characterRows) => {
          if (DEBUG) {
            console.log(`getUserDetailsByUsername: Received character rows: ${JSON.stringify(characterRows)}`);
            if (err) console.error(`getUserDetailsByUsername: Error: ${err.message}`);
          }
  
          if (characterRows) {
            characterRows.forEach(character => {
              result.characters[character.name] = character.character_id; // Map character names to their IDs
            });
          }
  
          // Fetch friends (example query)
          const queryFriends = `SELECT * FROM Friends WHERE account_id = ?`;
          if (DEBUG) console.log(`getUserDetailsByUsername: Executing query: ${queryFriends} with account_id: ${accountId}`);
  
          db.all(queryFriends, [accountId], (err, friendRows) => {
            if (DEBUG) {
              console.log(`getUserDetailsByUsername: Received friend rows: ${JSON.stringify(friendRows)}`);
              if (err) console.error(`getUserDetailsByUsername: Error: ${err.message}`);
            }
  
            if (friendRows) {
              result.friends = friendRows.map(friend => ({
                dest_name: friend.dest_name,
                source_name: friend.source_name
              }));
            }
  
            // Fetch bookmarks by account ID
            const queryBookmarks = `SELECT * FROM Bookmarks WHERE account_id = ?`;
            if (DEBUG) console.log(`getUserDetailsByUsername: Executing query: ${queryBookmarks} with account_id: ${accountId}`);
  
            db.all(queryBookmarks, [accountId], (err, bookmarkRows) => {
              if (DEBUG) {
                console.log(`getUserDetailsByUsername: Received bookmark rows: ${JSON.stringify(bookmarkRows)}`);
                if (err) console.error(`getUserDetailsByUsername: Error: ${err.message}`);
              }
  
              if (bookmarkRows) {
                result.bookmarks = bookmarkRows.map(bookmark => ({
                  name: bookmark.name
                }));
              }
              if (DEBUG) {
                console.log(`getUserDetailsByUsername: Total return result ${JSON.stringify(result)}`);
                if (err) console.error(`getUserDetailsByUsername: Error: ${err.message}`);
              }
              // Resolve the promise with the final result
              resolve(result);
            });
          });
        });
      });
    });
  }
};

