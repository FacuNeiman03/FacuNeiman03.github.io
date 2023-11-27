<template>
  <div>
    <h1>Lista de Jugadores</h1>
    <div>
      <label for="teamId">ID del Equipo:</label>
      <input type="text" id="teamId" v-model="teamId" />
      <button @click="loadPlayers">Cargar Jugadores</button>
    </div>
    <ul>
      <li v-for="player in players" :key="player.id">
        <div class="player-card">
          <h2>{{ player.name }} - {{ player.jerseyNumber }}</h2>
          <p>{{ playerPosition(player.position) }}</p>
          <!-- Utilizamos la computed property para mostrar el valor formateado -->
          <p>{{ formatMarketValue(player.proposedMarketValue) }}</p>
        </div>
      </li>
    </ul>

    <h1>Lista de Usuarios</h1>
    <ul v-if="usersLoaded">
      <li v-for="user in userList" :key="user.user_id">
        {{ user.full_name }} - {{ user.email }}
      </li>
    </ul>
    <p v-else>Cargando usuarios...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getTeamPlayers } from "../utils/api";
import { useFirebaseStore } from "../stores/firebaseStore";

export default {
  name: "Listado",
  setup() {
    const players = ref([]);
    const teamId = ref("");
    const firebaseStore = useFirebaseStore();
    const usersLoaded = ref(false);

    const loadPlayers = async () => {
      try {
        const teamPlayers = await getTeamPlayers(teamId.value);
        const playersData = teamPlayers.map(
          (playerDetails) => playerDetails.player
        );

        // Ordena los jugadores por jerseyNumber antes de asignarlos
        playersData.sort((a, b) => a.jerseyNumber - b.jerseyNumber);

        players.value = playersData;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const playerPosition = (position) => {
      switch (position) {
        case "F":
          return "Delantero";
        case "G":
          return "Arquero";
        case "D":
          return "Defensor";
        case "M":
          return "Volante";
        default:
          return "Desconocido";
      }
    };

    const formatMarketValue = (value) => {
      if (typeof value === "number") {
        if (value < 1000000) {
          return `€${(value / 1000).toFixed(0)} mil`;
        } else {
          return `€${(value / 1000000).toFixed(1)} millones`;
        }
      } else {
        return "Desconocido";
      }
    };

    // Llama a la acción para obtener la lista de usuarios cuando se monta el componente
    onMounted(async () => {
      try {
        await firebaseStore.getUsers();
        console.log("Lista de usuarios:", firebaseStore.userList);
        usersLoaded.value = true;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });
    return {
      players,
      teamId,
      userList: firebaseStore.userList, // Utiliza la lista de usuarios de la tienda de Pinia
      loadPlayers,
      playerPosition,
      formatMarketValue,
      usersLoaded, // Agregamos la computed property al retorno
    };
  },
};
</script>

<style scoped>
/* Estilos CSS para tu componente */
.player-card {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px;
}
</style>
