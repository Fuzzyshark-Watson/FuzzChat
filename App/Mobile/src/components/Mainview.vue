<template>
  <div class="mainview">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="selectTab(tab)"
        :class="{ active: tab === selectedTab }">
        {{ tab }}
      </button>
    </div>
    <div class="content">
      <p v-if="selectedTab === 'console'"></p>
      <p v-else>{{ selectedTab }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mainview',
  data() {
    return {
      tabs: ['console'],
    };
  },
  computed: {
    selectedTab() {
      return this.$store.state.selectedTab; 
    },
  },
  methods: {
    selectTab(tab) {
      this.$store.commit('setSelectedTab', tab); // Commit the tab change store
    },
    fetchChannelInfo(channelId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: channelId, name: 'General' });
        }, 1000);
      });
    },
  },
  async mounted() {
    try {
      const channelInfo = await this.fetchChannelInfo(1);
      this.tabs.push(channelInfo.name); 
      this.$store.commit('setSelectedTab', channelInfo.name); 
    } catch (error) {
      console.error('Failed to fetch channel info:', error);
    }
  },
};
</script>

<style scoped>
.mainview {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: var(--darkgrey);
  padding: 10px;
}

.tabs button {
  background: var(--darkgrey);
  color: var(--lightgray);
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: var(--warmgray);
  color: var(--darkgrey);
}

.content {
  flex: 1;
  padding: 20px;
  background-color: var(--darkgrey);
  border-top: 2px solid var(--warmgray);
}
</style>
