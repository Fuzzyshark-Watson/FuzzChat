<template>
  <div class="chatbox">
    <textarea v-model="message" placeholder="Type your message here..."></textarea>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import WebSocketService from '../services/WebSocketService'; // Assuming you have a WebSocket service

export default {
  name: 'Chatbox',
  data() {
    return {
      message: '', // Stores the user's message
    };
  },
  computed: {
    // Get the current channel from the store
    currentChannel() {
      return this.$store.state.selectedTab; // Access currentChannel from the Vuex store
    },
  },
  methods: {
    // BBCode to HTML parser
    parseBBCode() {
      // Simple regex-based BBCode parser for common tags
      const bbcodePatterns = [
        { regex: /\[b\](.*?)\[\/b\]/g, replacement: '<strong>$1</strong>' }, // Bold
        { regex: /\[i\](.*?)\[\/i\]/g, replacement: '<em>$1</em>' }, // Italics
        { regex: /\[u\](.*?)\[\/u\]/g, replacement: '<u>$1</u>' }, // Underline
        { regex: /\[s\](.*?)\[\/s\]/g, replacement: '<del>$1</del>' }, // Strikethrough
        { regex: /\[big\](.*?)\[\/big\]/g, replacement: '<span style="font-size: large;">$1</span>' }, // Big text
        { regex: /\[sup\](.*?)\[\/sup\]/g, replacement: '<sup>$1</sup>' }, // Superscript
        { regex: /\[sub\](.*?)\[\/sub\]/g, replacement: '<sub>$1</sub>' }, // Subscript
        { regex: /\[color=(#?[a-fA-F0-9]{6}|[a-zA-Z]+)](.*?)\[\/color\]/g, replacement: '<span style="color:$1">$2</span>' }, // Color
        { regex: /\[url=(.*?)\](.*?)\[\/url\]/g, replacement: '<a href="$1" target="_blank">$2</a>' }, // Hyperlink
      ];

      let parsedMessage = this.message;
      
      // Loop through each pattern and apply the regex replacement
      bbcodePatterns.forEach(({ regex, replacement }) => {
        parsedMessage = parsedMessage.replace(regex, replacement);
      });

      // Update the message with parsed HTML
      this.message = parsedMessage;
    },

    // Send the formatted message to the WebSocket (or other message handling service)
    sendMessage() {
      const currentChannel = this.currentChannel; // Get the current channel from Vuex store

      if (currentChannel && this.message.trim() !== '') {
        // Parse BBCode before sending
        this.parseBBCode();

        // Send the parsed message to the current channel via WebSocket
        WebSocketService.sendMessage('MSG', { channel: currentChannel, message: this.message });

        // Clear the input field after sending
        this.message = '';
      } else {
        console.error("No active channel or message is empty!");
      }
    },
  },
};
</script>

<style scoped>
.chatbox {
  display: grid;
  grid-template-columns: 1fr 100px; /* 1fr for the input, 100px for the button */
  grid-template-rows: repeat(3, auto); /* Three rows */
  background-color: var(--grey);
  gap: 10px; /* Optional: Add some space between elements */
}

textarea {
  grid-column: 1 / 2; /* Span the first column */
  grid-row: 1 / 4; /* Span three rows */
  max-width: 100%; /* Fill the available space */
  padding: 10px;
  min-height: 80px; /* Allow space for multiline input */
  font-size: 16px;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
}

button {
  grid-column: 2 / 3; /* Span the second column */
  grid-row: 2 / 3; /* Span the second row */
  background-color: var(--darkgrey);
  color: var(--lightgray);
  cursor: pointer;
  width: 80%; /* Ensure the button fills the grid cell */
  height: 80%; /* Ensure the button fills the grid cell */
  
}
</style>
