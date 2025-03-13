<template>
  <div class="sidebar">

    <div class="content">
      <h2>Menu</h2>
      <!-- Other sidebar content goes here -->
    </div>
    
    <!-- Logout button will now be inside the sidebar at the bottom -->
    <button class="logout-btn" @click="logout">Logout</button>
  </div>
</template>

<script>
import WebSocketService from '../services/WebSocketService'; // Import WebSocket service

export default {
  name: 'SidebarLeft',
  methods: {
    logout() {
      console.log('[Logout] User logging out...');
      WebSocketService.close(); // Close WebSocket connection
      localStorage.removeItem('token'); // Remove token from storage
      localStorage.removeItem('username'); // Remove username from storage
      this.$router.push('/login'); // Redirect to login page
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: var(--darkgrey);
  padding: 20px;
  border-right: 2px solid var(--warmgray);
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Keep the sidebar content at the top */
  overflow: auto; /* Ensure content can scroll if needed */
}

.close-btn {
  top: 50px; /* 20px from the bottom of the sidebar */
  background: none;
  border: none;
  color: var(--lightgray);
  font-size: 20px;
  cursor: pointer;
  align-self: flex-end;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.logout-btn {
  position: absolute;
  bottom: 50px; /* 20px from the bottom of the sidebar */
  left: 20px;
  right: 20px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn:hover {
  background-color: darkred;
}
</style>
