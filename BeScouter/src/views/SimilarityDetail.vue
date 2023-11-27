<template>
  <div class="similarity-detail bg-dark" style="padding-top: 20px">
    <h2 class="mt-4 mb-4 text-white text-center">Comparación</h2>
    <div class="buttons-container">
      <button
        v-if="!showPlayer1"
        class="btn btn-success"
        @click="toggleShowPlayer1"
      >
        Seleccionar jugador 1
      </button>
      <button v-else class="btn btn-success" @click="clearPlayer1">
        Cambiar jugador 1
      </button>
      <button
        v-if="!showPlayer2"
        class="btn btn-success"
        @click="toggleShowPlayer2"
      >
        Seleccionar jugador 2
      </button>
      <button v-else class="btn btn-success" @click="clearPlayer2">
        Cambiar jugador 2
      </button>
    </div>
    <div class="busqueda-container">
      <div class="busqueda centered text-center" v-if="showPlayer1">
        <form method="post">
          <div class="form-group">
            <input
              type="text"
              id="input1"
              v-model="input1"
              class="form-control"
            />
            <button
              @click.prevent="submitDataPlayer1"
              type="submit"
              class="btn btn-success"
            >
              Buscar
            </button>
          </div>
        </form>
        <div class="mt-3">
          <ul v-if="searchResults1.length > 0" class="results-list">
            <p class="centered">
              <strong>Resultados de la búsqueda 1:</strong>
            </p>
            <li
              class="result-item"
              v-for="(result, index) in searchResults1"
              :key="index"
              @click="clickPlayer1(result)"
            >
              <div>
                <p><strong>Nombre:</strong> {{ result.entity.name }}</p>
                <p><strong>Posición:</strong> {{ result.entity.position }}</p>
                <p><strong>Equipo:</strong> {{ result.entity.team.name }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="player1Seasons.length > 0">
          <p class="centered"><strong>Temporadas jugador 1:</strong></p>
          <ul class="seasons-list">
            <li
              class="season-item"
              v-for="(season, index) in player1Seasons"
              :key="index"
              @click="clickSeasonPlayer1(season)"
            >
              {{ season.season.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="busqueda centered text-center" v-if="showPlayer2">
        <form method="post">
          <div class="form-group">
            <input
              type="text"
              id="input2"
              v-model="input2"
              class="form-control"
            />
            <button
              @click.prevent="submitDataPlayer2"
              type="submit"
              class="btn btn-success"
            >
              Buscar
            </button>
          </div>
        </form>
        <div class="mt-3">
          <ul v-if="searchResults2.length > 0" class="result-list">
            <p class="centered">
              <strong>Resultados de la búsqueda 2:</strong>
            </p>
            <li
              v-for="(result, index) in searchResults2"
              :key="index"
              @click="clickPlayer2(result)"
              class="result-item"
            >
              <div>
                <p><strong>Nombre:</strong> {{ result.entity.name }}</p>
                <p><strong>Posición:</strong> {{ result.entity.position }}</p>
                <p><strong>Equipo:</strong> {{ result.entity.team.name }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="player2Seasons.length > 0">
          <p class="centered"><strong>Temporadas jugador 2:</strong></p>
          <ul class="seasons-list">
            <li
              class="season-item"
              v-for="(season, index) in player2Seasons"
              :key="index"
              @click="clickSeasonPlayer2(season)"
            >
              {{ season.season.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="playersComparation">
      <div class="comparation centered">
        <button
          :disabled="!arePlayersAndSeasonsSelected"
          @click="clickComparePlayersButton"
          class="btn btn-success"
        >
          Comparar Jugadores
        </button>
        <h3
          class="centered mt-4 mb-4"
          v-if="comparationResult"
          :class="resultColorClass"
        >
          {{ this.comparationResult }}%
        </h3>
      </div>
      <div class="playersStatistics-container">
        <div class="player1Statistics">
          <ul v-if="player1 != null">
            <li
              v-for="(value, key) in sortedCommonStats(player1, player2)"
              :key="key"
              class="stat"
            >
              <strong
                >{{ playerStatsTranslation[key] }}:
                {{
                  typeof value === "number" && value % 1 !== 0
                    ? parseFloat(value).toFixed(2)
                    : value
                }}</strong
              >
            </li>
          </ul>
        </div>
        <div class="player2Statistics">
          <ul v-if="player2 != null">
            <li
              v-for="(value, key) in sortedCommonStats(player2, player1)"
              :key="key"
              class="stat"
            >
              <strong
                >{{ playerStatsTranslation[key] }}:
                {{
                  typeof value === "number" && value % 1 !== 0
                    ? parseFloat(value).toFixed(2)
                    : value
                }}</strong
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlayerSeasons, getSimilarityPlayer, search } from "../utils/api";
import { getSimilarity } from "../utils/sistemaSimilitud";
import { playerStatsTranslation } from "../utils/playerStatsTranslation";
export default {
  name: "SimilarityDetail",
  data() {
    return {
      input1: "",
      input2: "",
      ID1: "",
      ID2: "",
      player1: null,
      player2: null,
      player1Seasons: [],
      player2Seasons: [],
      season1Id: "",
      tournament1Id: "",
      season2Id: "",
      tournament2Id: "",
      searchResults1: [],
      searchResults2: [],
      comparationResult: "",
      playerStatsTranslation: playerStatsTranslation,
      showPlayer1: false,
      showPlayer2: false,
    };
  },
  computed: {
    arePlayersAndSeasonsSelected() {
      return (
        this.ID1 !== "" &&
        this.ID2 !== "" &&
        this.tournament1Id !== "" &&
        this.tournament2Id !== "" &&
        this.season1Id !== "" &&
        this.season2Id !== ""
      );
    },
    resultColorClass() {
      const result = parseFloat(this.comparationResult);
      if (result < 50.0) {
        return "color-similitud-0";
      } else if (result >= 50.0 && result < 60.0) {
        return "color-similitud-1";
      } else if (result >= 60.0 && result < 70.0) {
        return "color-similitud-2";
      } else if (result >= 70.0 && result < 80.0) {
        return "color-similitud-3";
      } else if (result >= 80.0 && result < 90.0) {
        return "color-similitud-4";
      } else if (result >= 90.0) {
        return "color-similitud-5";
      }
    },
  },
  methods: {
    sortedCommonStats(player1, player2) {
      if (
        !playerStatsTranslation ||
        !player1 ||
        !player2 ||
        !player1.playerStatistics ||
        !player2.playerStatistics
      ) {
        return {};
      }

      const commonStats = Object.keys(player1.playerStatistics).filter(
        (stat) =>
          player2.playerStatistics.hasOwnProperty(stat) &&
          stat !== "type" &&
          stat !== "id" &&
          playerStatsTranslation.hasOwnProperty(stat)
      );

      return commonStats
        .sort((a, b) => {
          const statA = playerStatsTranslation[a] || "";
          const statB = playerStatsTranslation[b] || "";
          return statA.localeCompare(statB);
        })
        .reduce((sortedStats, stat) => {
          sortedStats[stat] = player1.playerStatistics[stat];
          return sortedStats;
        }, {});
    },
    async submitDataPlayer1() {
      const searchResults = await search(this.input1);
      if (searchResults.length > 0) {
        this.searchResults1 = searchResults.filter(
          (result) => result.type === "player"
        );
      }
      console.log(this.searchResults1);
    },
    async submitDataPlayer2() {
      const searchResults = await search(this.input2);
      if (searchResults.length > 0) {
        this.searchResults2 = searchResults.filter(
          (result) => result.type === "player"
        );
      }
      console.log(this.searchResults2);
    },
    async clickPlayer1(result) {
      this.ID1 = result.entity.id;
      this.player1Seasons = await getPlayerSeasons(this.ID1);
      this.searchResults1 = this.searchResults1.filter(
        (res) => res.entity.id === this.ID1
      );
    },
    async clickPlayer2(result) {
      this.ID2 = result.entity.id;
      this.player2Seasons = await getPlayerSeasons(this.ID2);
      this.searchResults2 = this.searchResults2.filter(
        (res) => res.entity.id === this.ID2
      );
    },
    clickSeasonPlayer1(season) {
      this.season1Id = season.season.id;
      this.tournament1Id = season.tournamentId;
      this.player1Seasons = this.player1Seasons.filter(
        (s) => s.season.id === this.season1Id
      );
    },
    clickSeasonPlayer2(season) {
      this.season2Id = season.season.id;
      this.tournament2Id = season.tournamentId;
      this.player2Seasons = this.player2Seasons.filter(
        (s) => s.season.id === this.season2Id
      );
    },
    async clickComparePlayersButton() {
      await this.comparePlayers();
    },
    async comparePlayers() {
      this.player1 = await getSimilarityPlayer(
        this.ID1,
        this.tournament1Id,
        this.season1Id
      );
      this.player2 = await getSimilarityPlayer(
        this.ID2,
        this.tournament2Id,
        this.season2Id
      );

      this.comparationResult = getSimilarity(this.player1, this.player2);
      console.log(this.comparationResult);
    },
    toggleShowPlayer1() {
      this.showPlayer1 = !this.showPlayer1;
    },
    clearPlayer1() {
      this.input1 = "";
      this.ID1 = "";
      this.player1 = null;
      this.searchResults1 = [];
      this.player1Seasons = [];
      this.season1Id = "";
      this.tournament1Id = "";
    },
    toggleShowPlayer2() {
      this.showPlayer2 = !this.showPlayer2;
    },
    clearPlayer2() {
      this.input2 = "";
      this.ID2 = "";
      this.player2 = null;
      this.searchResults2 = [];
      this.player2Seasons = [];
      this.season2Id = "";
      this.tournament2Id = "";
    },
  },
};
</script>

<style>
.similarity-detail {
  min-height: 81vh;
  margin-bottom: 60px;
}

li {
  list-style-type: none;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
}
strong {
  font-weight: bold;
  color: #ebebeb;
}
p {
  margin: 5px 0;
  color: #ebebeb;
}
.busqueda-container {
  display: flex;
  justify-content: center;
}
.busqueda {
  width: 45%;
  margin: 20px;
}
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.playersStatistics-container {
  display: flex;
}
.player1Statistics,
.player2Statistics {
  flex: 1;
  margin: 10px;
  margin-left: -1.5em;
}

.results-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.result-item {
  background-color: #2f5639;
  color: white;
  border: none;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.result-item:hover {
  background-color: #1d3521;
}

.seasons-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}

.season-item {
  background-color: #2f5639;
  color: white;
  border: none;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.season-item:hover {
  background-color: #1d3521;
}

.btn-success {
  margin-top: 20px;
  background-color: #2f5639 !important; /* !important se usa para asegurarse de que este estilo prevalezca */
  border-color: #2f5639 !important;
}

.btn-success:hover {
  background-color: #1d3521 !important; /* Cambiar el color en el hover */
  border-color: #1d3521 !important;
}

.stat {
  color: white;
  border: solid 2px #2f5639;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.stat:hover {
  background-color: #2f5639;
}

.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.buttons-container button {
  margin-right: 10px;
}

.color-similitud-0 {
  color: rgb(170, 0, 0);
  font-weight: bold;
}

.color-similitud-1 {
  color: rgb(238, 30, 30);
  font-weight: bold;
}

.color-similitud-2 {
  color: orange;
  font-weight: bold;
}

.color-similitud-3 {
  color: rgb(19, 206, 19);
  font-weight: bold;
}

.color-similitud-4 {
  /* */
  color: rgb(0, 121, 0);
  font-weight: bold;
}
.color-similitud-5 {
  /* */
  color: rgb(0, 68, 0);
  font-weight: bold;
  text-shadow: 4px 4px 4px #555, -4px -4px 4px #555;
  animation: electric 2s linear infinite;
  transition: 1s;
}

@keyframes electric {
  0% {
    color: rgb(0, 122, 0);
  }
  50% {
    color: rgb(24, 156, 24);
  }
  100% {
    color: rgb(71, 202, 71);
  }
}
</style>
