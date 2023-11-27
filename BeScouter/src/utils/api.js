// api.js
import axios from "axios";

const apiKey = "807142397dmsh1a5a96ba51760fbp19ee02jsn90afbf8ee0e9";
//apikey = "bb2e727e0dmsh88532e6028939e7p186918jsna1a69be257ac" ya usada
//apiKey = "cd24ed7ec4msh02e559e9c78103cp1c5bc9jsnddd1be399148" ya usada
//apikey = "688ebc2f99mshbbf816ba77c13fcp1537d2jsn7801f2dc1c26" ya usada
//apikey = "98a621ea95mshb3fc4f596f56163p197190jsnf5dd15049b61" ya usada
//apikey = "807142397dmsh1a5a96ba51760fbp19ee02jsn90afbf8ee0e9"
const baseUrl = "https://footapi7.p.rapidapi.com/";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "X-RapidAPI-Key": apiKey,
  },
});

export async function getTeamDetails(teamId) {
  try {
    const response = await axiosInstance.get(`api/team/${teamId}`);
    return response.data.team;
  } catch (error) {
    throw error;
  }
}

export async function getPlayerDetails(playerId) {
  try {
    const response = await axiosInstance.get(`api/player/${playerId}`);
    return response.data.player;
  } catch (error) {
    throw error;
  }
}

export async function getTeamPlayers(teamId) {
  try {
    const response = await axiosInstance.get(`api/team/${teamId}/players`);
    return response.data.players;
  } catch (error) {
    throw error;
  }
}

export async function getOverallPlayerStatistics(
  playerId,
  tournamentId,
  seasonId
) {
  try {
    const response = await axiosInstance.get(
      `api/player/${playerId}/tournament/${tournamentId}/season/${seasonId}/statistics`
    );
    return response.data.statistics;
  } catch (error) {
    throw error;
  }
}

export async function search(query) {
  try {
    const response = await axiosInstance.get(`api/search/${query}`);
    return response.data.results;
  } catch (error) {
    throw error;
  }
}

export async function getSimilarityPlayer(playerId, tournamentId, seasonId) {
  try {
    var playerDetails = "";
    var playerStatistics = "";
    var player = "";
    playerDetails = await getPlayerDetails(playerId);
    playerStatistics = await getOverallPlayerStatistics(
      playerId,
      tournamentId,
      seasonId
    );

    player = {
      playerDetails,
      playerStatistics,
    };
    return player;
  } catch (error) {
    throw error;
  }
}

export async function getPlayerSeasons(playerId) {
  try {
    const response = await axiosInstance.get(
      `api/player/${playerId}/statistics/season`
    );
    return unifySeasonsWithTournaments(response.data);
  } catch (error) {
    throw error;
  }
}
function unifySeasonsWithTournaments(response) {
  const unifiedData = [];
  for (const uniqueTournamentSeason of response.uniqueTournamentSeasons) {
    const tournamentId = uniqueTournamentSeason.uniqueTournament.id;
    for (const season of uniqueTournamentSeason.seasons) {
      unifiedData.push({ tournamentId: tournamentId, season: season });
    }
  }
  return unifiedData;
}
export async function getPlayerImage(playerId) {
  try {
    const response = await axiosInstance.get(`api/player/${playerId}/image`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getRankedsTeams() {
  try {
    const response = await axiosInstance.get(`api/rankings/uefa/clubs`);
    return response.data.rankings;
  } catch (error) {
    throw error;
  }
}
export async function getTopLeagues() {
  try {
    const response = await axiosInstance.get(`api/rankings/uefa/countries`);
    return response.data.rankings;
  } catch (error) {
    throw error;
  }
}
export async function getManagerDetails(managerId) {
  try {
    const response = await axiosInstance.get(`api/manager/${managerId}`);
    return response.data.manager;
  } catch (error) {
    throw error;
  }
}
export async function getManagerCereerHistory(managerId) {
  try {
    const response = await axiosInstance.get(
      `api/manager/${managerId}/history`
    );
    return response.data.careerHistory;
  } catch (error) {
    throw error;
  }
}
export async function getLeagueDetails(leagueId) {
  try {
    const response = await axiosInstance.get(`api/tournament/${leagueId}`);
    return response.data.uniqueTournament;
  } catch (error) {
    throw error;
  }
}

export async function getTeamImage(teamId) {
  try {
    const response = axiosInstance.get(`api/team/${teamId}/image`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getTeamStatistics(teamId, tournamentId, seasonId) {
  try {
    const response = await axiosInstance.get(
      `api/team/${teamId}/tournament/${tournamentId}/season/${seasonId}/statistics`
    );
    return response.data.statistics;
  } catch (error) {
    throw error;
  }
}

export async function getTeamSeasons(teamId) {
  try {
    const response = await axiosInstance.get(
      `api/team/${teamId}/statistics/seasons`
    );
    return unifySeasonsWithTournaments(response.data);
  } catch (error) {
    throw error;
  }
}

export async function getPlayerTransfers(playerId) {
  try {
    const response = await axiosInstance.get(`api/player/${playerId}/transfer`);
    return response.data.transferHistory;
  } catch (error) {
    throw error;
  }
}

export async function getTeamTransfers(teamId) {
  try {
    const response = await axiosInstance.get(`api/team/${teamId}/transfers`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getManagerImage(managerId) {
  try {
    const response = await axiosInstance.get(`api/manager/${managerId}/image`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
}
