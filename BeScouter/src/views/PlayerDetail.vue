<template>
  <div class="container-fluid bg-dark text-light" style="margin-bottom: 60px">
    <div class="player-detail" v-if="playerDetails != null">
      <div class="center-button">
        <img
          v-if="isLoggedIn && !itemSaved"
          src="../assets/ic_save.png"
          alt="Guardar jugador"
          class="btn-image btn-save"
          @click="saveItem"
        />
        <img
          v-if="itemSaved"
          src="../assets/ic_saved.png"
          alt="Jugador guardado"
          class="btn-image btn-save"
          disabled
        />
      </div>
      <div class="detail-item" style="margin-top: 20px">
        <div v-if="imageSource != null" class="text-center">
          <img
            :src="imageSource"
            alt="Player Image"
            class="player-image img-fluid rounded-circle"
          />
        </div>
        <h2>{{ playerDetails?.name }}</h2>
        <p v-if="playerDetails?.shirtNumber">
          <strong>Número de camiseta: </strong> {{ playerDetails?.shirtNumber }}
        </p>
        <p v-if="playerDetails?.dateOfBirthTimestamp">
          <strong>Edad:</strong>
          {{ calcularEdadEnAnios(playerDetails?.dateOfBirthTimestamp) }}
        </p>
        <p v-if="playerDetails?.dateOfBirthTimestamp">
          <strong>Fecha de nacimiento:</strong>
          {{ getDateFromTimestamp(playerDetails?.dateOfBirthTimestamp) }}
        </p>
        <p><strong>País: </strong> {{ playerDetails?.country?.name }}</p>
        <p v-if="playerDetails?.proposedMarketValueRaw">
          <strong>Valor de mercado: </strong>
          <span
            >€{{
              playerDetails?.proposedMarketValueRaw?.value.toLocaleString()
            }}</span
          >
        </p>
        <p><strong>Altura:</strong> {{ playerDetails?.height }} cm</p>
        <p>
          <strong>Pie favorito:</strong>
          {{ getFavouriteFoot(playerDetails?.preferredFoot) }}
        </p>
        <p>
          <strong>Posicion:</strong> {{ mapPosition(playerDetails?.position) }}
        </p>
        <p
          v-if="
            playerDetails?.team?.name &&
            playerDetails?.team?.name?.toUpperCase() != 'NO TEAM'
          "
        >
          <strong>Equipo: </strong> {{ playerDetails?.team?.name }}
        </p>
        <p v-if="playerDetails?.contractUntilTimestamp">
          <strong>Contrato: </strong>
          {{ getDateFromTimestamp(playerDetails?.contractUntilTimestamp) }}
        </p>
      </div>
      <div class="statistics">
        <button class="btn btn-primary" @click="getSeasons">
          {{ showStatistics ? "Ocultar estadísticas" : "Ver estadísticas" }}
        </button>
        <ul
          v-if="showStatistics && seasons.length > 0"
          style="margin-top: 20px"
        >
          <h3>Temporadas</h3>
          <li
            v-for="(season, key) in seasons"
            :key="key"
            @click="getStatistics(season)"
            class="season-item"
          >
            <p><strong>Temporada: </strong>{{ season.season.name }}</p>
          </li>
        </ul>
        <table
          class="table table-bordered table-hover my-custom-table"
          v-if="
            showStatistics && statistics && Object.keys(statistics).length > 0
          "
        >
          <thead class="thead-light">
            <tr>
              <th class="table-header">Estadística</th>
              <th class="table-header">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="key in sortedStatistics(statistics)"
              :key="key"
              v-if="key !== 'type' && key !== 'id'"
            >
              <td>{{ playerStatsTranslation[key] }}</td>
              <td>
                {{
                  typeof statistics[key] === "number" &&
                  statistics[key] % 1 !== 0
                    ? parseFloat(statistics[key]).toFixed(2)
                    : statistics[key]
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="player-transfers">
        <div class="center-button">
          <button class="btn btn-primary" @click="getPlayerTransfers">
            {{
              showTransfers
                ? "Ocultar historial de transferencias"
                : "Historial de transferencias"
            }}
          </button>
        </div>
        <div
          class="transfers"
          v-if="showTransfers && playerTransfers.length > 0"
          style="margin-top: 30px; width: 35%; margin: 0 auto"
        >
          <h3>Historial de transferencias</h3>
          <ul>
            <li
              v-for="(transfer, index) in playerTransfers"
              :key="index"
              class="transfer-item"
              @click="redirectToTeamDetail(transfer?.transferTo?.id)"
            >
              <p>
                <strong>Desde: </strong
                >{{ getTeamName(transfer?.fromTeamName) }}
              </p>
              <p><strong>A: </strong>{{ getTeamName(transfer?.toTeamName) }}</p>
              <p>
                <strong>Precio: </strong>
                {{
                  getTransferValue(
                    transfer?.transferFeeDescription,
                    transfer?.type
                  )
                }}
              </p>
              <p>
                <strong>Fecha: </strong>
                {{ getDateFromTimestamp(transfer?.transferDateTimestamp) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPlayerImage,
  getPlayerDetails,
  getPlayerSeasons,
  getOverallPlayerStatistics,
  getPlayerTransfers,
} from "../utils/api";
import { playerStatsTranslation } from "../utils/playerStatsTranslation";
import { useFirebaseStore } from "../stores/firebaseStore";

export default {
  name: "PlayerDetail",
  data() {
    return {
      playerId: "",
      playerDetails: null,
      imageSource: null,
      seasons: [],
      statistics: "",
      tournamentId: "",
      seasonId: "",
      playerStatsTranslation: playerStatsTranslation,
      playerTransfers: [],
      firebase: useFirebaseStore(),
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
    "$route.params.id": "fetchPlayerData",
  },
  methods: {
    async fetchPlayerData() {
      // Recuperar el nuevo ID del jugador de la ruta
      const newPlayerId = this.$route.params.id;

      // Solo vuelvas a cargar los datos si el ID ha cambiado
      if (newPlayerId !== this.playerId) {
        this.playerId = newPlayerId;
        this.showStatistics = false; // Reset the visibility of statistics
        this.showTransfers = false; // Reset the visibility of transfers
        this.getData();
      }
    },
    async getData() {
      try {
        this.playerDetails = await getPlayerDetails(this.playerId);
        await this.convertToImage();
      } catch (error) {
        console.error("Error occurred: ", error);
      }
    },
    async convertToImage() {
      try {
        const response = await getPlayerImage(this.playerId);
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
    redirectToTeamDetail(teamId) {
      this.$router.push({ path: `/team/${teamId}` });
    },
    sortedStatistics(stats) {
      if (!playerStatsTranslation || !stats) {
        return [];
      }

      const commonStats = Object.keys(stats).filter(
        (stat) =>
          stat !== "type" && stat !== "id" && playerStatsTranslation[stat]
      );

      return commonStats.sort((a, b) => {
        if (playerStatsTranslation[a] && playerStatsTranslation[b]) {
          const statA = playerStatsTranslation[a].toLowerCase();
          const statB = playerStatsTranslation[b].toLowerCase();

          if (statA < statB) {
            return -1;
          }
          if (statA > statB) {
            return 1;
          }
          return 0;
        }
        return 0;
      });
    },

    getDateFromTimestamp(timestamp) {
      const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses son de 0 a 11
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    getFavouriteFoot(foot) {
      switch (foot) {
        case "Left":
          return "Izquierdo";
        case "Right":
          return "Derecho";
        case "Both":
          return "Ambidiestro";
      }
    },
    async getSeasons() {
      this.seasons = await getPlayerSeasons(this.playerId);
      console.log("temporadas: " + JSON.stringify(this.seasons));
      this.toggleStatistics();
    },
    async getStatistics(season) {
      this.tournamentId = season.tournamentId;
      this.seasonId = season.season.id;
      this.statistics = await getOverallPlayerStatistics(
        this.playerId,
        this.tournamentId,
        this.seasonId
      );
      this.seasons = this.seasons.filter((s) => s.season.id == this.seasonId);
      console.log(this.playerStatistics);
    },
    redirectToSimilarityDetail() {
      this.$router.push({ path: "/compare" });
    },
    async getPlayerTransfers() {
      this.playerTransfers = await getPlayerTransfers(this.playerId);
      console.log(this.playerTransfers);
      this.toggleTransfers();
    },
    async saveItem() {
      const userId = localStorage.getItem("userData");
      const item = {
        id: this.playerDetails.id,
        name: this.playerDetails.name,
        type: "player",
      };
      try {
        await this.firebase.addToSavedList(userId, item);
        this.itemSaved = true;
      } catch (error) {
        throw error;
      }
    },
    toggleStatistics() {
      this.showStatistics = !this.showStatistics;
    },
    toggleTransfers() {
      this.showTransfers = !this.showTransfers;
    },
  },
  created() {
    this.playerId = this.$route.params.id;
    this.getData();
  },
};
</script>

<style scoped>
.player-detail {
  width: 70%;
  margin: 0 auto; /* Centra el elemento en el contenedor */
  padding: 20px;
  border-radius: 5px;
}

.detail-item,
.statistics {
  text-align: center;
}

.statistics ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.statistics li {
  background-color: #2f5639;
  color: white;
  border: none;
  text-align: center;
  max-width: 400px; /* Ancho máximo ajustado según tus necesidades */
  margin: 0 auto 10px;
  overflow: hidden;
  white-space: nowrap; /* Evita el salto de línea */
  text-overflow: ellipsis; /* Agrega puntos suspensivos (...) si el texto es demasiado largo */
}

.statistics li h3 {
  margin: 5px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.statistics table {
  width: 70%;
  background-color: #2f5639;
  margin: 0 auto;
}

.statistics table th,
.statistics table td {
  color: white;
  background-color: #2f5639;
}

.statistics table tbody tr:hover {
  background-color: #1d3521;
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

.player-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 20px;
}

.center-button {
  text-align: center;
  margin-top: 20px;
}

.btn-save {
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.btn-primary {
  background-color: #2f5639 !important; /* !important se usa para asegurarse de que este estilo prevalezca */
  border-color: #2f5639 !important;
}

.btn-primary:hover {
  background-color: #1d3521 !important; /* Cambiar el color en el hover */
  border-color: #1d3521 !important;
}

.player-transfers {
  text-align: center;
  margin-bottom: 30px;
}
.season-item {
  cursor: pointer;
  transition: 0.2s;
}

.season-item:hover {
  background-color: #1d3521;
  transition: 0.2s;
}

.transfer-item {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #2f5639; /* Cambia el color de fondo para los elementos li */
  border-radius: 5px;
  cursor: pointer;
}

.transfer-item:hover {
  background-color: #1d3521; /* Cambia el color de fondo en el hover */
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
