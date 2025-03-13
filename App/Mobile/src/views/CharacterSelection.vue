<template>
  <div class="character-selection">
    <h1>Select Your Character</h1>
    <select v-model="selectedCharacter">
      <option v-for="character in characters" :key="character.id" :value="character">
        {{ character.name }}
      </option>
    </select>
    <button @click="loginWithCharacter">Login</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import WebSocketService from '../services/WebSocketService'; // Import WebSocketService

export default {
  name: 'CharacterSelection',
  setup() {
    const router = useRouter();
    const characters = ref([]);
    const selectedCharacter = ref(null);

    onMounted(() => {
      const storedCharacters = WebSocketService.getCharacters();
      if (storedCharacters && Object.keys(storedCharacters).length > 0) {
        characters.value = Object.entries(storedCharacters).map(([name, id]) => ({
          id,
          name
        }));
      } else {
        console.error('No characters found');
      }
    });

    const loginWithCharacter = () => {
      if (selectedCharacter.value) {
        console.log('✅ Selected Character:', selectedCharacter.value);

        WebSocketService.connect();

        WebSocketService.sendIdentification('IDN', {
          method: 'ticket',
          account: WebSocketService.getUsername(),
          ticket: WebSocketService.getToken(),
          character: selectedCharacter.value,
          cname: 'Fuzzchat',
        });

        console.log('📡 Sent WebSocket identification message');

        WebSocketService.onMessage((message) => {
          console.log('📩 WebSocket Response:', message);
          if (message.status === 'success') {
            console.log('🎉 Login Successful! Navigating to HomeView.vue');
            router.push('/home'); // ✅ Vue Router navigation (instead of `window.location.href`)
          } else {
            console.error('❌ Login failed:', message.message);
          }
        });

      } else {
        console.error('⚠️ No character selected');
      }
    };

    return {
      characters,
      selectedCharacter,
      loginWithCharacter
    };
  }
};
</script>

<style scoped>
.character-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--darkgrey);
  color: var(--lightgray);
}

select {
  margin: 20px 0;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: var(--warmgray);
  color: var(--darkgrey);
  border: none;
}
</style>
