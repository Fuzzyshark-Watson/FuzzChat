<template>
  <div class="sidebar">
    <button @click="$emit('close')" class="close-btn"></button>

    <h2>Friends</h2>
    <ul v-if="friends.length">
      <li v-for="friend in friends" :key="friend">{{ friend }}</li>
    </ul>
    <p v-else>No friends online.</p>

    <h2>Bookmarks</h2>
    <ul v-if="bookmarks.length">
      <li v-for="bookmark in bookmarks" :key="bookmark">{{ bookmark }}</li>
    </ul>
    <p v-else>No bookmarks online.</p>
  </div>
</template>

<script>
import WebSocketService from '../services/WebSocketService'; // Import WebSocket service
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'SidebarRight',
  setup() {
    const friends = ref([]);
    const bookmarks = ref([]);

    // Get friends and bookmarks when the component loads
    onMounted(() => {
      friends.value = WebSocketService.getCharacters() || [];
      bookmarks.value = WebSocketService.getBookmarks() || [];

      // Listen for WebSocket updates
      WebSocketService.onMessage((message) => {
        if (message.action === 'CHARACTERS' && message.characters) {
          friends.value = message.characters;
        }
        if (message.action === 'BOOKMARKS' && message.bookmarks) {
          bookmarks.value = message.bookmarks;
        }
      });
    });

    return { friends, bookmarks };
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: var(--darkgrey);
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border-left: 2px solid solid var(--warmgray);
}

h2 {
  color: white;
  font-size: 1.2em;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 5px 0;
  color: white;
}

p {
  color: grey;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  float: right;
}
</style>
