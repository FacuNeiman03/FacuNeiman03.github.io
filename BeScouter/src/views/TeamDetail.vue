<template>
  <div
    class="container-fluid bg-dark text-light min-vh-100"
    style="margin-bottom: 60px"
  >
    <div class="team-detail" v-if="teamDetail != null">
      <div class="center-button">
        <img
          v-if="isLoggedIn && !itemSaved"
          src="../assets/ic_save.png"
          alt="Guardar equipo"
          class="btn-image btn-save"
          @click="saveItem"
        />
        <img
          v-if="itemSaved"
          src="../assets/ic_saved.png"
          alt="Equipo guardado"
          class="btn-image btn-save"
          disabled
        />
      </div>
      <div class="detail-item">
        <img
          :src="imageSource"
          alt="logoEquipo"
          class="team-logo"
          style="margin-top: 20px"
        />
        <h2>{{ teamDetail.name }}</h2>
        <p><strong>País: </strong> {{ teamDetail.country?.name }}</p>
        <p v-if="teamDetail.foundationDateTimestamp">
          <strong>Fecha de fundación: </strong>
          {{ getDateFromTimestamp(teamDetail.foundationDateTimestamp) }}
        </p>
        <p v-if="teamDetail.manager?.name">
          <strong>Entrenador: </strong> {{ teamDetail.manager?.name }}
        </p>
        <p v-if="teamDetail.venue?.stadium?.name">
          <strong>Estadio: </strong> {{ teamDetail.venue?.stadium?.name }} -
          {{ teamDetail.venue?.stadium?.capacity.toLocaleString() }}
        </p>
        <p v-if="teamDetail.tournament?.name">
          <strong>Torneo: </strong> {{ teamDetail.tournament?.name }}
        </p>
      </div>
      <div class="centered-content" style="margin-bottom: 20px">
        <button v-if="!showPlayers" @click="getPlayers" class="btn btn-success">
          Ver jugadores
        </button>
        <button v-else class="btn btn-success" @click="togglePlayerVisibility">
          Ocultar jugadores
        </button>
      </div>
      <div class="team-players" style="margin-top: 20px">
        <ul v-show="showPlayers && teamPlayers.length > 0" class="list-group">
          <h2>Jugadores</h2>
          <li
            v-for="(player, index) in teamPlayers"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div
              class="player-info"
              @click="redirectToPlayerDetail(player?.player?.id)"
            >
              <h3>{{ player.player.name }}</h3>
              <p>
                <strong>Posicion: </strong>
                {{ mapPosition(player?.player?.position) }}
              </p>
              <p>
                <strong>Numero de Camiseta: </strong>
                {{ player?.player?.shirtNumber }}
              </p>
              <p>
                <strong>Valor de Mercado: </strong>
                {{
                  player?.player?.proposedMarketValueRaw?.value.toLocaleString()
                }}
                <span>{{
                  player?.player?.proposedMarketValueRaw?.currency
                }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="team-statistics">
        <div class="center-button">
          <button
            v-if="!showStatistics"
            @click="getSeasons"
            class="btn btn-success"
          >
            Ver estadisticas
          </button>
          <button
            v-else
            @click="toggleStatisticsVisibility"
            class="btn btn-success"
          >
            Ocultar estadisticas
          </button>
        </div>
        <div class="team-seasons">
          <ul
            v-if="showStatistics && teamSeasons.length > 0"
            class="list-group"
          >
            <h2>Temporadas</h2>
            <li
              v-for="(season, index) in teamSeasons"
              :key="index"
              @click="clickSeason(season)"
              class="list-group-item"
            >
              <p>{{ season.season.name }}</p>
            </li>
          </ul>
        </div>
        <div
          class="season-statistics"
          v-if="showStatistics && seasonStatistics !== null"
        >
          <table class="table my-custom-table table-bordered table-hover">
            <thead class="thead-light">
              <tr>
                <th class="table-header">Estadística</th>
                <th class="table-header">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(value, key) in sortedStatistics(seasonStatistics)"
                :key="key"
              >
                <td>{{ teamStatsTranslation[key] }}</td>
                <td>{{ formatStatisticValue(value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="transfers-container"
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        "
      >
        <button
          v-if="!showTransfers"
          class="btn btn-success"
          @click="getTeamTransfers"
        >
          Ver transferencias
        </button>
        <button
          v-else
          class="btn btn-success"
          @click="toggleTransfersVisibility"
        >
          Ocultar transferencias
        </button>
        <div
          class="transfers-content"
          style="
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-top: 20px;
            width: 100%;
          "
        >
          <div
            class="incorporaciones"
            style="flex: 0 0 48%; margin-bottom: 20px; text-align: center"
          >
            <ul
              v-show="showTransfers && teamTransfers?.transfersIn?.length > 0"
              class="list-group mx-auto"
            >
              <h3>Altas</h3>
              <li
                v-for="(transfer, index) in teamTransfers?.transfersIn"
                :key="index"
                class="list-group-item"
                @click="redirectToPlayerDetail(transfer?.player?.id)"
              >
                <h5 class="mt-1">
                  {{ transfer.player.name }}
                </h5>
                <p>
                  <strong>Desde: </strong>
                  {{ getTeamName(transfer.fromTeamName) }}
                </p>
                <p>
                  <strong>Precio: </strong>
                  {{
                    getTransferValue(
                      transfer.transferFeeDescription,
                      transfer.type
                    )
                  }}
                </p>
                <p>
                  <strong>Fecha: </strong>
                  {{ getTransferDate(transfer.transferDateTimestamp) }}
                </p>
              </li>
            </ul>
          </div>
          <div
            class="salidas"
            style="flex: 0 0 48%; margin-bottom: 20px; text-align: center"
          >
            <ul
              v-if="showTransfers && teamTransfers?.transfersOut?.length > 0"
              class="list-group mx-auto"
            >
              <h3>Bajas</h3>
              <li
                v-for="(transfer, index) in teamTransfers.transfersOut"
                :key="index"
                class="list-group-item"
                @click="redirectToPlayerDetail(transfer?.player?.id)"
              >
                <h5 class="mt-1">
                  {{ transfer.player.name }}
                </h5>
                <p>
                  <strong>A: </strong>
                  {{ getTeamName(transfer.toTeamName) }}
                </p>
                <p>
                  <strong>Precio: </strong>
                  {{
                    getTransferValue(
                      transfer.transferFeeDescription,
                      transfer.type
                    )
                  }}
                </p>
                <p>
                  <strong>Fecha: </strong>
                  {{ getTransferDate(transfer.transferDateTimestamp) }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTeamDetails,
  getTeamPlayers,
  getTeamImage,
  getTeamSeasons,
  getTeamStatistics,
  getTeamTransfers,
} from "../utils/api";
import { teamStatsTranslation } from "../utils/teamStatsTranslation";
import { useFirebaseStore } from "../stores/firebaseStore";

export default {
  name: "TeamDetail",
  data() {
    return {
      teamId: "",
      teamDetail: null,
      imageSource: null,
      teamPlayers: [],
      teamSeasons: [],
      seasonStatistics: null,
      seasonId: null,
      tournamentId: null,
      teamStatsTranslation: teamStatsTranslation,
      teamTransfers: null,
      firebase: useFirebaseStore(),
      showPlayers: false,
      showStatistics: false,
      showTransfers: false,
      itemSaved: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  watch: {
    '$route.params.id': 'fetchTeamData',
  },
  methods: {
    async fetchTeamData() {
      // Recuperar el nuevo ID del jugador de la ruta
      const newTeamId = this.$route.params.id;

      // Solo vuelvas a cargar los datos si el ID ha cambiado
      if (newTeamId !== this.teamId) {
        this.teamId = newTeamId;
        this.showPlayers = false
        this.showStatistics = false
        this.showTransfers = false
        this.getData();
      }
    },
    getTeamName(name) {
      switch (name.toUpperCase()) {
        case "NO TEAM":
          return "Sin Equipo";
        case "RETIRED":
          return "-";
        default:
          return name;
      }
    },
    getTransferValue(value, type) {
      switch (type) {
        case 1:
          return "Cesión";
        case 2:
          return "Fin de Cesión";
        case 3:
          switch (value) {
            case "Unknown":
              return "?";
            case "Free":
              return "Libre";
            case "-":
              return "Libre";
            default:
              return value;
          }
        case 4:
          return "Retiro";
        default:
          return "?";
      }
    },
    getTransferDate(timestamp) {
      const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses son de 0 a 11
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    sortedStatistics(statistics) {
      if (!this.teamStatsTranslation) {
        return {};
      }

      const commonStats = Object.keys(statistics).filter(
        (stat) =>
          stat !== "type" && stat !== "id" && this.teamStatsTranslation[stat]
      );

      const translatedStatistics = commonStats.map((key) => ({
        key,
        translatedKey: this.teamStatsTranslation[key],
        value: statistics[key],
      }));

      translatedStatistics.sort((a, b) => {
        const nameA = a.translatedKey.toUpperCase();
        const nameB = b.translatedKey.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });

      const sortedStatistics = {};
      translatedStatistics.forEach((item) => {
        sortedStatistics[item.key] = item.value;
      });

      return sortedStatistics;
    },
    async getData() {
      try {
        this.teamDetail = await getTeamDetails(this.teamId);
        await this.convertToImage();
      } catch (error) {
        console.error("Error occurred: ", error);
      }
    },
    async getPlayers() {
      this.teamPlayers = await getTeamPlayers(this.teamId);
      this.sortPlayersByShirtNumber();
      this.togglePlayerVisibility();
    },
    async getSeasons() {
      this.teamSeasons = await getTeamSeasons(this.teamId);
      console.log(this.teamSeasons);
      this.toggleStatisticsVisibility();
    },
    async clickSeason(season) {
      this.seasonId = season?.season?.id;
      this.tournamentId = season?.tournamentId;
      if (this.teamId !== null) {
        this.seasonStatistics = await getTeamStatistics(
          this.teamId,
          this.tournamentId,
          this.seasonId
        );
      }
      this.teamSeasons = this.teamSeasons.filter(
        (s) => s.season.id === this.seasonId
      );
    },
    async getTeamTransfers() {
      this.teamTransfers = await getTeamTransfers(this.teamId);
      console.log(this.teamTransfers);
      this.toggleTransfersVisibility();
      console.log(this.teamTransfers);
    },
    calcularEdadEnAnios(timestamp) {
      const fechaNacimiento = new Date(timestamp * 1000);
      const diferencia = Date.now() - fechaNacimiento.getTime();
      const edad = new Date(diferencia);
      const edadEnAnios = Math.abs(edad.getUTCFullYear() - 1970);
      return edadEnAnios;
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
    formatStatisticValue(value) {
      return typeof value === "number" && value % 1 !== 0
        ? parseFloat(value).toFixed(2)
        : value;
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
    sortPlayersByShirtNumber() {
      this.teamPlayers.sort((a, b) => {
        return a.player.shirtNumber - b.player.shirtNumber;
      });
    },
    redirectToPlayerDetail(playerId) {
      this.$router.push({ path: `/player/${playerId}` });
    },
    async convertToImage() {
      try {
        const response = await getTeamImage(this.teamId);
        const imageUrl = URL.createObjectURL(response.data);
        this.imageSource = imageUrl;
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
      }
    },
    async saveItem() {
      const userId = localStorage.getItem("userData");
      const item = {
        id: this.teamDetail.id,
        name: this.teamDetail.name,
        type: "team",
      };
      try {
        await this.firebase.addToSavedList(userId, item);
        this.itemSaved = true;
      } catch (error) {
        throw error;
      }
    },
    togglePlayerVisibility() {
      this.showPlayers = !this.showPlayers;
    },
    toggleStatisticsVisibility() {
      this.showStatistics = !this.showStatistics;
      this.seasonStatistics = null;
    },
    toggleTransfersVisibility() {
      this.showTransfers = !this.showTransfers;
    },
  },
  created() {
    this.teamId = this.$route.params.id;
    this.getData();
  },
};
</script>

<style scoped>
.team-detail {
  width: 100%;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  color: white;
}

.centered-content {
  margin-top: 20px;
}

.center-button {
  text-align: center;
  margin-top: 20px;
}

.team-logo {
  width: 180px;
  height: 180px;
  object-fit: cover;
  margin-bottom: 10px;
}

.list-group {
  margin-top: 20px;
}

.list-group-item {
  margin-bottom: 15px;
}

.list-group-item,
.team-players .list-group-item {
  background-color: #2f5639;
  color: white;
  border: none;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto 10px;
  overflow: hidden;
  cursor: pointer;
}

.list-group-item:hover {
  background-color: #1d3521 !important; /* Cambiar el color en el hover */
  border-color: #1d3521 !important;
}

.btn-save {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.list-group-item h2,
.team-players .list-group-item h3 {
  margin: 5px 0;
}

.list-group-item p,
.team-players .list-group-item p {
  margin: 3px 0;
}

.list-group-item span,
.team-players .list-group-item span {
  font-weight: bold;
}

.btn-success {
  background-color: #2f5639 !important; /* !important se usa para asegurarse de que este estilo prevalezca */
  border-color: #2f5639 !important;
}

.btn-success:hover {
  background-color: #1d3521 !important; /* Cambiar el color en el hover */
  border-color: #1d3521 !important;
}

.my-custom-table {
  width: 70%;
  background-color: #2f5639;
  margin: 0 auto;
}

.my-custom-table th,
.my-custom-table td {
  color: white;
  background-color: #2f5639;
}

.my-custom-table tbody tr:hover {
  background-color: #1d3521;
}

.table-header {
  background-color: #1d3521 !important;
}
</style>
