<template>
  <div id="app">
    <header>
      <SearchBar v-if="store.state.showSearchBar" />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <Footer v-if="store.state.showSearchBar" />
    </footer>
  </div>
</template>

<script setup>
import SearchBar from './components/SearchBar.vue';
import Footer from './components/Footer.vue'
import store from './stores/index';
</script>

<style scoped>
header {
  line-height: 1.5;
  background-color: #f8f9fa; /* Match the background color of your navbar */
}

/* Reset some default styles */
body, html {
  margin: 0;
  font-family: josefin_sans;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'josefin_sans';
}

.wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

/* Additional styling for your SearchBar if needed */
</style>
