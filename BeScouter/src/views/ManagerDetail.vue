<template>
  <div
    class="container-fluid bg-dark text-light"
    style="min-height: 81vh; margin-bottom: 60px"
  >
    <div class="manager-detail" v-if="managerDetails !== null">
      <div class="center-button">
        <img
          v-if="isLoggedIn && !itemSaved"
          src="../assets/ic_save.png"
          alt="Guardar entrenador"
          class="btn-image btn-save"
          @click="saveItem"
        />
        <img
          v-if="itemSaved"
          src="../assets/ic_saved.png"
          alt="Entrenador guardado"
          class="btn-image btn-save"
          disabled
        />
      </div>
      <div class="text-center">
        <img
          :src="imageSource"
          alt="Manager Image"
          class="manager-image img-fluid rounded-circle"
        />
      </div>
      <div class="detail-item">
        <h2>{{ managerDetails?.name }}</h2>
        <p><strong>Equipo: </strong> {{ managerDetails?.team?.name }}</p>
        <p><strong>País: </strong> {{ managerDetails?.country?.name }}</p>
        <p>
          <strong>Edad: </strong>
          {{ calcularEdadEnAnios(managerDetails?.dateOfBirthTimestamp) }}
        </p>
        <p>
          <strong>Formación favorita: </strong>
          {{ managerDetails?.preferredFormation }}
        </p>
      </div>
      <div class="statistics" v-if="managerDetails.performance">
        <h3>Estadísticas</h3>
        <p>
          <strong>Partidos dirigidos: </strong>
          {{ managerDetails?.performance?.total }}
        </p>
        <p>
          <strong>Partidos ganados: </strong>
          {{ managerDetails?.performance?.wins }}
        </p>
        <p>
          <strong>Partidos perdidos: </strong>
          {{ managerDetails?.performance?.losses }}
        </p>
        <p>
          <strong>Partidos empatados: </strong>
          {{ managerDetails?.performance?.draws }}
        </p>
        <p>
          <strong>Goles a favor: </strong>
          {{ managerDetails?.performance?.goalsScored }}
        </p>
        <p>
          <strong>Goles en contra: </strong>
          {{ managerDetails?.performance?.goalsConceded }}
        </p>
        <p>
          <strong>Total de puntos: </strong>
          {{ managerDetails?.performance?.totalPoints }}
        </p>
        <p>
          <strong>Porcentaje de victorias: </strong>
          {{ calculateWinPercentage() }}%
        </p>
      </div>
      <div class="career-history">
        <button
          v-if="!showManagerCareer"
          @click="getCareerHistory"
          class="btn btn-primary"
        >
          Ver equipos dirigidos
        </button>
        <button v-else @click="toggleShowManagerCareer" class="btn btn-primary">
          Ocultar equipos dirigidos
        </button>
        <ul
          v-if="showManagerCareer && managerCareerHistory.length > 0"
          class="career-history-list"
        >
          <h3 style="margin-top: 30px">Historial de Carrera</h3>
          <li
            v-for="(team, index) in managerCareerHistory"
            :key="index"
            class="career-item"
          >
            <div class="team-info">
              <h4>{{ team?.team?.name }}</h4>
              <p>
                <strong>Fecha inicio: </strong>
                {{ getDateFromTimestamp(team?.startTimestamp) }}
              </p>
              <p>
                <strong>Fecha final: </strong>
                {{ getDateFromTimestamp(team?.endTimestamp) }}
              </p>
            </div>
            <div class="statistics">
              <h4>Estadísticas</h4>
              <p>
                <strong>Partidos dirigidos: </strong>
                {{ team?.performance?.total }}
              </p>
              <p>
                <strong>Partidos ganados: </strong>
                {{ team?.performance?.wins }}
              </p>
              <p>
                <strong>Partidos perdidos: </strong>
                {{ team?.performance?.losses }}
              </p>
              <p>
                <strong>Partidos empatados: </strong>
                {{ team?.performance?.draws }}
              </p>
              <p>
                <strong>Total de puntos: </strong>
                {{ team?.performance?.totalPoints }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getManagerCereerHistory,
  getManagerDetails,
  getManagerImage,
} from "../utils/api";
import { useFirebaseStore } from "../stores/firebaseStore";

export default {
  name: "ManagerDetail",
  data() {
    return {
      managerId: "",
      managerDetails: null,
      managerCareerHistory: [],
      firebase: useFirebaseStore(),
      imageSource: null,
      showManagerCareer: false,
      itemSaved: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  watch: {
    '$route.params.id': 'fetchManagerData',
  },
  methods: {
    async fetchManagerData() {
      // Recuperar el nuevo ID del jugador de la ruta
      const newManagerId = this.$route.params.id;

      // Solo vuelvas a cargar los datos si el ID ha cambiado
      if (newManagerId !== this.managerId) {
        this.managerId = newManagerId;
        this.showManagerCareer = false
        this.getData();
      }
    },
    async getData() {
      if (this.managerId !== "") {
        this.managerDetails = await getManagerDetails(this.managerId);
        await this.convertToImage();
        if (!this.managerDetails.team) {
          this.managerDetails.team = { name: "Sin equipo" };
        }
      }
      console.log(this.managerDetails);
    },
    async convertToImage() {
      try {
        const response = await getManagerImage(this.managerId);
        const imageUrl = URL.createObjectURL(response.data);
        this.imageSource = imageUrl;
        console.log("image url: ", imageUrl);
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
      }
    },
    calcularEdadEnAnios(timestamp) {
      const fechaNacimiento = new Date(timestamp * 1000);
      const diferencia = Date.now() - fechaNacimiento.getTime();
      const edad = new Date(diferencia);
      const edadEnAnios = Math.abs(edad.getUTCFullYear() - 1970);
      return edadEnAnios;
    },
    getDateFromTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      };
      const formattedDate = date.toLocaleDateString("es-ES", options);

      return formattedDate;
    },
    calculateWinPercentage() {
      const { wins, total } = this.managerDetails.performance;
      if (total > 0) {
        return ((wins / total) * 100).toFixed(2);
      }
    },
    async getCareerHistory() {
      this.managerCareerHistory = await getManagerCereerHistory(this.managerId);
      this.toggleShowManagerCareer();
    },
    async saveItem() {
      const userId = localStorage.getItem("userData");
      const item = {
        id: this.managerDetails.id,
        name: this.managerDetails.name,
        type: "manager",
      };
      try {
        await this.firebase.addToSavedList(userId, item);
        this.itemSaved = true;
      } catch (error) {
        throw error;
      }
    },
    toggleShowManagerCareer() {
      this.showManagerCareer = !this.showManagerCareer;
    },
  },
  async created() {
    this.managerId = this.$route.params.id;
    await this.getData();
  },
};
</script>

<style scoped>
.manager-detail {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.detail-item,
.statistics,
.career-history {
  text-align: center;
  margin-bottom: 30px;
}

h2,
h3 {
  text-align: center;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

.team-info {
  margin-bottom: 20px;
}

.team-info p {
  margin-bottom: 5px;
}

.statistics {
  margin-bottom: 30px;
}

.statistics h3 {
  margin-bottom: 10px;
}

li {
  margin-bottom: 30px;
}

.btn-primary {
  background-color: #2f5639 !important;
  border-color: #2f5639 !important;
}

.btn-primary:hover {
  background-color: #1d3521 !important;
  border-color: #1d3521 !important;
}

.save-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.manager-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
}

.career-history-list {
  padding: 0;
}

.career-item {
  background-color: #2f5639;
  width: 40%; /* ajusta este valor según tus necesidades */
  padding: 15px;
  margin: 0 auto;
  border-radius: 5px;
  margin-bottom: 20px;
}

.center-button {
  align-content: center;
  text-align: center;
  margin-bottom: 20px;
}

.btn-save {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
