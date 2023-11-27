<template>
  <div class="navbar text-light p-3">
    <div class="d-flex align-items-center">
      <img
        src="../assets/logo_blanco.png"
        alt="Logo"
        class="logo-icon"
        @click="redirectToHome"
      />
      <a class="navbar-item mb-0" @click="redirectToHome"> Inicio </a>
      <a
        class="navbar-item mb-0"
        @click="redirectToComparePlayers"
        style="margin-left: 20px"
      >
        Comparar
      </a>
    </div>
    <div class="auth-container">
      <div class="search-auth-container position-relative">
        <div class="input-group">
          <input
            type="text"
            class="form-control search-input"
            v-model="input"
            @keyup.enter="submitSearch"
          />
          <button class="btn-buscar btn-light" @click="submitSearch">
            Buscar
          </button>
        </div>
        <transition name="fade">
          <div v-if="showResults" class="search-results position-absolute">
            <button class="close-button btn btn-light" @click="closeResults">
              &times; Cerrar
            </button>
            <ul class="list-group w-100 result-container">
              <li
                v-for="(result, index) in searchResults"
                :key="index"
                class="list-group-item"
              >
                <div
                  v-if="result.type === 'player'"
                  @click="redirectToPlayerDetail(result.entity.id)"
                  class="item-search"
                >
                  <p class="text-black">Jugador: {{ result?.entity?.name }}</p>
                  <p class="text-black">
                    Posicion: {{ mapPosition(result?.entity?.position) }}
                  </p>
                </div>
                <div
                  v-else-if="result?.type === 'team'"
                  @click="redirectToTeamDetail(result.entity.id)"
                  class="item-search"
                >
                  <p class="text-black">Equipo: {{ result?.entity?.name }}</p>
                  <p class="text-black">
                    Pais: {{ result?.entity?.country?.name }}
                  </p>
                </div>
                <div
                  v-else-if="result?.type === 'uniqueTournament'"
                  @click="redirectToLeagueDetail(result.entity.id)"
                >
                  <p>Torneo: {{ result?.entity?.name }}</p>
                  <p>Pais: {{ result?.entity?.category?.name }}</p>
                </div>
                <div
                  v-else-if="result?.type === 'manager'"
                  @click="redirectToManagerDetail(result.entity.id)"
                >
                  <p>Entrenador: {{ result?.entity?.name }}</p>
                  <p>
                    Equipo:
                    {{
                      result?.entity?.team
                        ? result?.entity?.team?.name
                        : "Sin equipo"
                    }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="auth-buttons">
        <button
          v-if="!isLoggedIn"
          class="btn btn-light btn-login"
          @click="redirectToLogin"
        >
          Iniciar Sesión
        </button>
        <button
          v-else
          class="btn btn-light btn-login"
          @click="redirectToConfiguration"
        >
          Configuración
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { search } from "../utils/api";
import store from "../stores/index";

export default {
  name: "SearchBar",
  data() {
    return {
      input: "",
      showResults: false,
      searchResults: [],
    };
  },
  computed: {
    isLoggedIn() {
      return store.state.isLoggedIn;
    },
  },
  methods: {
    async submitSearch() {
      await this.searchData();
    },
    async searchData() {
      const results = await search(this.input);
      this.searchResults = results.filter((result) =>
        ["player", "team"].includes(result.type)
      );
      this.showResults = true;
      console.log(this.searchResults);
    },
    redirectToHome() {
      this.$router.push({ path: "/home" });
      console.log("Bienvenido a TheWelcome");
    },
    redirectToLogin() {
      this.$router.push({ path: "/login" });
      console.log("Iniciando sesión");
    },
    redirectToComparePlayers() {
      this.$router.push({ path: "/compare" });
    },
    handleResultClick(result) {
      console.log("Resultado seleccionado:", result);
      this.showResults = false;
    },
    mapPosition(position) {
      switch (position) {
        case "G":
          return "Portero";
        case "D":
          return "Defensor";
        case "M":
          return "Mediocampista";
        case "F":
          return "Delantero";
        default:
          return "Desconocido";
      }
    },
    redirectToPlayerDetail(playerId) {
      this.$router.push({ path: `/player/${playerId}` });
      this.closeResults();
    },
    redirectToTeamDetail(teamId) {
      this.$router.push({ path: `/team/${teamId}` });
      this.closeResults();
    },
    redirectToLeagueDetail(leagueId) {
      this.$router.push({ path: `/league/${leagueId}` });
      this.closeResults();
    },
    redirectToManagerDetail(managerId) {
      this.$router.push({ path: `/manager/${managerId}` });
      this.closeResults();
    },
    redirectToConfiguration() {
      this.$router.push({ path: "/configuration" });
    },
    closeResults() {
      this.showResults = false;
      this.input = "";
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #3f734c;
  padding: 5px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-icon {
  width: 90px;
  height: 90px;
  margin-right: 10px;
  cursor: pointer;
  flex-shrink: 0;
}
.navbar-title {
  margin: 0;
}

.btn-login {
  background-color: #3f734c !important;
  border: #ebebeb solid 2px !important;
  color: #ebebeb !important;
  transition: 0.2s;
}

.btn-login:hover {
  box-shadow: 1px 1px 1px;
  transition: 0.2s;
}
.search-auth-container {
  display: flex;
  align-items: center;
}
.btn-buscar {
  background-color: #ebebeb !important;
  color: #3f734c !important;
  transition: 0.2s;
}

.btn-buscar:hover {
  background-color: #d3d4d5 !important;
  transition: 0.2s;
}

.auth-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 6px 10px;
  border: 2px solid #ebebeb;
  background-color: #3f734c;
  border-radius: 5px;
  margin-right: 5px;
  color: #ebebeb !important;
}

.search-input:focus {
  background-color: #3f734c !important;
  border: 2px solid #ebebeb;
}

.search-input::placeholder {
  color: #ebebeb;
}

.close-button {
  position: relative;
  top: -7px; /* Ajusta la posición vertical según sea necesario */
  left: 5px;
  padding: 5px 10px; /* Ajuste del tamaño del botón */
  font-size: 16px; /* Ajuste del tamaño del texto */
  cursor: pointer;
  border: none;
  background: #f8f9fa; /* Color de fondo */
  color: #000;
  border-radius: 5px;
  z-index: 1; /* Ajusta este valor según sea necesario, debe ser mayor que el z-index de .search-results */
}

.search-results {
  top: calc(100% + 10px); /* Ajuste para evitar la superposición */
  left: 0;
  right: 0;
  z-index: 1; /* Ajusta este valor según sea necesario, debe ser menor que el z-index de .navbar */
}

.result-container {
  max-height: 200px;
  overflow-y: scroll;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.btn-light {
  padding: 6px 10px;
  background-color: #f8f9fa;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
  white-space: nowrap !important; /* Evita el salto de línea en el botón */
}

.btn-light:hover {
  background-color: #d3d4d5;
}

.list-group-item {
  background-color: #f8f9fa;
  border: none;
  margin-bottom: 5px;
  width: calc(
    100% - 20px
  ); /* Resta 20px para permitir el espacio del margen y el borde */
  padding: 10px; /* Agrega algún espacio interno para mejorar la apariencia */
}

.list-group-item p {
  margin: 0; /* Elimina el margen interno de los párrafos dentro de los elementos li */
}

.list-group-item .fw-bold {
  color: #000; /* Color del texto en negrita */
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
.navbar-item {
  font-size: 20px;
  margin-left: 20px;
}

.navbar-item:hover {
  color: #c9c8c8 !important;
}

.w-100 {
  width: 100%;
}

.item-search {
  cursor: pointer;
}
</style>
