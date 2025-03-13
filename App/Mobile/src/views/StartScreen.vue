<template>
  <div class="form-grid">
    <label for="username" :style="{ gridRow: '4', gridColumn: '1' }">Username:</label>
    <input type="text" id="username" v-model="username" :style="{ gridRow: '4', gridColumn: '2' }" value="User1">

    <label for="password" :style="{ gridRow: '5', gridColumn: '1' }">Password:</label>
    <input type="password" id="password" v-model="password" :style="{ gridRow: '5', gridColumn: '2' }" value="User">
    
    <button @click="login">Submit</button>
    <label id="statusLabel" :style="{ gridRow: '6', gridColumn: '2' }">{{ statusMessage }}</label>
  </div>
</template>

<style>
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  grid-template-rows: auto auto auto 1fr 1fr 1fr 1fr 1fr 1fr; /* 9 rows */
  gap: 15px; /* Space between grid items */
}

label {
  grid-column: 1; /* Label in the first column */
  align-self: center; /* Vertically center the label */
  justify-self: end; /* Horizontally align the label to the right */
}

input {
  grid-column: 2 / 4; /* Input spans columns 2-3 */
  max-width: 250px; /* Set a fixed max width */
  width: 100%; /* Ensure it takes the full width up to the max width */
}

button {
  grid-column: 2; /* Button in column 2 */
  grid-row: 7; /* Button in row 7 */
}

input {
  padding: 5px;
}

#statusLabel {
  grid-column: 1 / 4; /* Span across columns 1 to 3 */
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Show ellipsis for overflow text */
  justify-self: center; /* Horizontally center the label */
  align-self: center; /* Vertically center the label */
}
</style>

<script>
import { ref } from 'vue';
import WebSocketService from '../services/WebSocketService'; // Import WebSocketService
import { useRouter } from 'vue-router'; // Import Vue Router

export default {
  name: 'StartScreen',
  setup() {
    const username = ref('');
    const password = ref('');
    const statusMessage = ref('');
    const router = useRouter(); // Initialize the router

    const login = async () => {
      console.log('[Login] Button clicked'); // Debug log for when the button is clicked
      if (!username.value || !password.value) {
        statusMessage.value = 'Enter both username and password.';
        console.log('[Login] Missing username or password');
        return;
      }

      console.log('[Login] Sending request with username:', username.value);

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: username.value, password: password.value }),
        });

        // Log the status of the response
        console.log('[Login] Response status:', response.status);
        
        // Check if response is ok before parsing
        if (!response.ok) {
          console.error('[Login] Failed to connect to server', response.statusText);
          statusMessage.value = 'Failed to connect to server.';
          return;
        }

        const result = await response.json();
        console.log('[Login] Response:', result);

        if (result.status === 'success') {
          console.log('[Login] Login successful:', result);
          WebSocketService.storeToken(result.ticket); // Store token in WebSocketService
          WebSocketService.storeUsername(username.value); // Store username
          WebSocketService.storeCharacters(result.characters); // Store characters in WebSocketService
          WebSocketService.storeBookmarks(result.bookmarks); // Store bookmarks in WebSocketService
          statusMessage.value = 'Login successful!';
          router.push('/CharacterSelection');
        } else {
          console.error('[Login] Login failed:', result.message);
          statusMessage.value = 'Login failed: ' + result.message;
        }
      } catch (error) {
        console.error('[Login] Error:', error);
        statusMessage.value = 'Error connecting to server.';
      }
    };

    return {
      username,
      password,
      statusMessage,
      login,
    };
  },
};

</script>
