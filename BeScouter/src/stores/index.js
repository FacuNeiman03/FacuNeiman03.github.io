import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showSearchBar: true,
    isLoggedIn: false,
    userData: '', // Agrega el estado para almacenar los datos del usuario
  },
  mutations: {
    setShowSearchBar(state, value) {
      state.showSearchBar = value;
    },
    setIsLoggedIn(state, value) {
      console.log('valor', value)
      state.isLoggedIn = value;
      localStorage.setItem('isLoggedIn', value)
    },
    setUserData(state, userData) {
      state.userData = userData; // Agrega la mutación para actualizar los datos del usuario
      localStorage.setItem('userData', userData)
    },
    
  },
  actions: {
    updateLoginStatus({ commit }, value) {
      commit('setIsLoggedIn', value);
    },
    updateUserData({ commit }, userData) {
      commit('setUserData', userData); // Agrega la acción para actualizar los datos del usuario
    },
  },
});

export default store;
