<!-- filepath: /C:\temp\FuzzChat\App\Mobile\src\views\HomeView.vue -->
<template>
  <div id="app">
    <SidebarLeft v-if="showSidebarLeft" @close="toggleSidebarLeft" />
    <SidebarRight v-if="showSidebarRight" @close="toggleSidebarRight" />
    <div class="main-content">
      <Mainview />
    </div>
    <Chatbox class="chatbox" />
    <button class="toggle-sidebar-left" @click="toggleSidebarLeft">☰</button>
    <button class="toggle-sidebar-right" @click="toggleSidebarRight">☰</button>
  </div>
</template>

<script>
import Chatbox from './../components/Chatbox.vue';
import Mainview from '../components/Mainview.vue';
import SidebarLeft from './../components/SidebarLeft.vue';
import SidebarRight from './../components/SidebarRight.vue';

export default {
  name: 'App',
  components: {
    Chatbox,
    Mainview,
    SidebarLeft,
    SidebarRight
  },
  data() {
    return {
      showSidebarLeft: false,
      showSidebarRight: false
    };
  },
  methods: {
    toggleSidebarLeft() {
      this.showSidebarLeft = !this.showSidebarLeft;
    },
    toggleSidebarRight() {
      this.showSidebarRight = !this.showSidebarRight;
    }
  }
};
</script>

<style>
@import './../assets/styles.css';

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  padding: 20px;
}

.chatbox {
  height: 15%;
  background-color: var(--darkgrey);
  padding: 10px;
}

.toggle-sidebar-left{
  position: absolute;
  top: 10px;
  background: var(--darkgrey);
  color: var(--lightgray);
  padding: 10px;
  cursor: pointer;
  border-right: 2px solid var(--warmgray);
}

.toggle-sidebar-right {
  position: absolute;
  top: 10px;
  background: var(--darkgrey);
  color: var(--lightgray);
  padding: 10px;
  cursor: pointer;
  border-left: 2px solid var(--warmgray);
}

.toggle-sidebar-left {
  left: 10px;
}

.toggle-sidebar-right {
  right: 10px;
}
</style>