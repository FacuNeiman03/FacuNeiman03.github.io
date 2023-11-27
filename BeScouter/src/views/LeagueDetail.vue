<template>
  <div class="league-detail-container bg-dark d-flex align-items-center justify-content-center">
    <div class="league-detail card text-white bg-dark p-4" v-if="leagueDetails != null">
      <div class="detail-item">
        <h2 class="mb-2"> {{ leagueDetails?.name }} </h2>
        <p class="mb-2"><strong>País: </strong> {{ leagueDetails?.category?.name }} </p>
        <p class="mb-2"><strong>Temporada: </strong> {{ getYearFromTimestamp(leagueDetails?.startDateTimestamp) }}/{{ getYearFromTimestamp(leagueDetails?.endDateTimestamp) }} </p>
      </div>
      <div class="title-holder mt-4">
        <h4>Actual Campeón</h4>
        <p class="mb-2"><strong>{{ leagueDetails?.titleHolder?.name }}</strong></p>
        <p class="mb-2"><strong>Cantidad de títulos: </strong>{{ leagueDetails?.titleHolderTitles }} </p>
      </div>
      <div class="most-title-team mt-4">
        <h4>Equipo más ganador</h4>
        <ul class="list-unstyled">
          <li v-for="(team, index) in leagueDetails?.mostTitlesTeams" :key="index" class="mb-3" style="background-color: #2F5639;">
            <p class="mb-2"><strong> {{ team.name }} </strong></p>
            <p class="mb-2"><strong>Cantidad de títulos: </strong> {{ leagueDetails?.mostTitles }} </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getLeagueDetails } from '../utils/api'

export default {
  name: 'LeagueDetail',
  data() {
    return {
      leagueId: '',
      leagueDetails: null,
    }
  },
  watch: {
    '$route.params.id': 'fetchLeagueData',
  },
  methods: {
    async fetchLeagueData() {
      // Recuperar el nuevo ID del jugador de la ruta
      const newLeagueId = this.$route.params.id;

      // Solo vuelvas a cargar los datos si el ID ha cambiado
      if (newLeagueId !== this.managerId) {
        this.managerId = newLeagueId;
        this.getData();
      }
    },
    async getData() {
      if (this.leagueId !== '') {
        this.leagueDetails = await getLeagueDetails(this.leagueId)
      }
      console.log(this.leagueDetails)
    },
    getYearFromTimestamp(timestamp) {
      const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos
      return date.getFullYear(); // Obtener el año de la fecha
    },
  },
  created() {
    this.leagueId = this.$route.params.id
    this.getData()
  },
}
</script>

<style scoped>
.league-detail-container {
    display: flex;
    justify-content: center;
    align-items: center; /* Agregado para centrar verticalmente */
    min-height: 89vh;
}

.league-detail {
    width: 100%;
    padding: 20px;
}
.detail-item,
.title-holder,
.most-title-team {
    text-align: center;
    margin-bottom: 30px;
}

h2 {
    text-align: center;
}

h4 { /* Cambiado de h3 a h4 */
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
    max-width: 300px;
    margin: 0 auto;
}

.card {
  border: none !important;
}
</style>
