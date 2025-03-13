import { createStore } from 'vuex';

const state = {
  user: null,
  isAuthenticated: false,
  token: null,
  settings: {
    theme: 'light',
    language: 'en',
  },
  selectedTab: 'console',  // Default selected tab
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
  token: (state) => state.token,
  theme: (state) => state.settings.theme,
  language: (state) => state.settings.language,
  selectedTab: (state) => state.selectedTab, // Getter for selectedTab
};

const mutations = {
  setUser(state, user) {
    state.user = user;
    state.isAuthenticated = !!user;
  },
  setToken(state, token) {
    state.token = token;
  },
  setTheme(state, theme) {
    state.settings.theme = theme;
  },
  setLanguage(state, language) {
    state.settings.language = language;
  },
  setSelectedTab(state, tab) {
    state.selectedTab = tab; // Update the selectedTab state
  },
};

const actions = {
  login({ commit }, { user, token }) {
    commit('setUser', user);
    commit('setToken', token);
  },
  logout({ commit }) {
    commit('setUser', null);
    commit('setToken', null);
  },
  updateTheme({ commit }, theme) {
    commit('setTheme', theme);
  },
  updateLanguage({ commit }, language) {
    commit('setLanguage', language);
  },
  updateSelectedTab({ commit }, tab) {
    commit('setSelectedTab', tab);
  },
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
});

export default store;
