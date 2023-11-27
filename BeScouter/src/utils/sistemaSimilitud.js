export function getSimilarity(player1, player2) {
  const attributeWeightsPlayer = {
    accurateChippedPasses: 1.0,
    accurateCrosses: 0.0,
    accurateCrossesPercentage: 1.0,
    accurateFinalThirdPasses: 1.0,
    accurateLongBalls: 0.0,
    accurateLongBallsPercentage: 1.0,
    accurateOppositionHalfPasses: 1.0,
    accurateOwnHalfPasses: 1.0,
    accuratePasses: 0.0,
    accuratePassesPercentage: 1.0,
    aerialDuelsWon: 0.0,
    aerialDuelsWonPercentage: 1.0,
    aerialLost: 1.0,
    appearances: 0.0,
    assists: 1.0,
    attemptPenaltyMiss: 1.0,
    attemptPenaltyPost: 1.0,
    attemptPenaltyTarget: 1.0,
    ballRecovery: 1.0,
    bigChancesCreated: 1.0,
    bigChancesMissed: 1.0,
    blockedShots: 1.0,
    cleanSheet: 0.0,
    clearances: 1.0,
    countRating: 0.0,
    crossesNotClaimed: 1.0,
    directRedCards: 1.0,
    dispossessed: 1.0,
    dribbledPast: 1.0,
    duelLost: 1.0,
    errorLeadToGoal: 1.0,
    errorLeadToShot: 1.0,
    expectedAssists: 1.0,
    expectedGoals: 1.0,
    fouls: 1.0,
    freeKickGoal: 1.0,
    goalConversionPercentage: 1.0,
    goals: 1.0,
    goalsAssistsSum: 1.0,
    goalsConceded: 1.0,
    goalsConcededInsideTheBox: 1.0,
    goalsConcededOutsideTheBox: 1.0,
    goalsFromInsideTheBox: 1.0,
    goalsFromOutsideTheBox: 1.0,
    goalKicks: 0.0,
    groundDuelsWon: 0.0,
    groundDuelsWonPercentage: 1.0,
    headedGoals: 1.0,
    highClaims: 0.0,
    hitWoodwork: 0.0,
    inaccuratePasses: 1.0,
    interceptions: 1.0,
    keyPasses: 1.0,
    leftFootGoals: 1.0,
    matchesStarted: 0.0,
    minutesPlayed: 0.0,
    offsides: 1.0,
    ownGoals: 1.0,
    passToAssist: 1.0,
    penaltiesTaken: 0.0,
    penaltyConceded: 0.0,
    penaltyConversion: 1.0,
    penaltyFaced: 0.0,
    penaltyGoals: 1.0,
    penaltySave: 0.0,
    penaltyWon: 1.0,
    possessionLost: 1.0,
    possessionWonAttThird: 1.0,
    punches: 0.0,
    rating: 1.0,
    redCards: 1.0,
    rightFootGoals: 1.0,
    runsOut: 0.0,
    savedShotsFromInsideTheBox: 0.0,
    savedShotsFromOutsideTheBox: 0.0,
    saves: 0.0,
    savesCaught: 0.0,
    savesParried: 0.0,
    scoringFrequency: 1.0,
    setPieceConversion: 1.0,
    shotFromSetPiece: 1.0,
    shotsFromInsideTheBox: 1.0,
    shotsFromOutsideTheBox: 1.0,
    shotsOffTarget: 1.0,
    shotsOnTarget: 1.0,
    successfulDribbles: 0.0,
    successfulDribblesPercentage: 1.0,
    successfulRunsOut: 1.0,
    tackles: 1.0,
    tacklesWon: 0.0,
    tacklesWonPercentage: 1.0,
    totalAttemptAssist: 1.0,
    totalChippedPasses: 1.0,
    totalContest: 1.0,
    totalCross: 1.0,
    totalDuelsWon: 0.0,
    totalDuelsWonPercentage: 1.0,
    totalLongBalls: 1.0,
    totalOppositionHalfPasses: 1.0,
    totalOwnHalfPasses: 1.0,
    totalPasses: 1.0,
    totalRating: 1.0,
    totalShots: 1.0,
    totwAppearances: 0.0,
    touches: 1.0,
    wasFouled: 1.0,
    yellowCards: 1.0,
    yellowRedCards: 1.0,
  };

  const attributeWeightsGoalkeeper = {
    accurateChippedPasses: 0.0,
    accurateCrosses: 0.0,
    accurateCrossesPercentage: 0.0,
    accurateFinalThirdPasses: 0.0,
    accurateLongBalls: 0.0,
    accurateLongBallsPercentage: 1.0,
    accurateOppositionHalfPasses: 0.0,
    accurateOwnHalfPasses: 0.0,
    accuratePasses: 1.0,
    accuratePassesPercentage: 1.0,
    aerialDuelsWon: 0.0,
    aerialDuelsWonPercentage: 1.0,
    aerialLost: 0.0,
    appearances: 0.0,
    assists: 1.0,
    attemptPenaltyMiss: 0.0,
    attemptPenaltyPost: 0.0,
    attemptPenaltyTarget: 0.0,
    ballRecovery: 0.0,
    bigChancesCreated: 0.0,
    bigChancesMissed: 0.0,
    blockedShots: 0.0,
    cleanSheet: 1.0,
    clearances: 1.0,
    countRating: 1.0,
    crossesNotClaimed: 0.0,
    directRedCards: 1.0,
    dispossessed: 0.0,
    dribbledPast: 0.0,
    duelLost: 0.0,
    errorLeadToGoal: 1.0,
    errorLeadToShot: 1.0,
    expectedAssists: 0.0,
    expectedGoals: 0.0,
    fouls: 1.0,
    freeKickGoal: 0.0,
    goalConversionPercentage: 0.0,
    goals: 0.0,
    goalsAssistsSum: 0.0,
    goalsConceded: 1.0,
    goalsConcededInsideTheBox: 1.0,
    goalsConcededOutsideTheBox: 1.0,
    goalsFromInsideTheBox: 0.0,
    goalsFromOutsideTheBox: 0.0,
    goalKicks: 0.0,
    groundDuelsWon: 0.0,
    groundDuelsWonPercentage: 0.0,
    headedGoals: 0.0,
    highClaims: 1.0,
    hitWoodwork: 0.0,
    inaccuratePasses: 1.0,
    interceptions: 0.0,
    keyPasses: 0.0,
    leftFootGoals: 0.0,
    matchesStarted: 0.0,
    minutesPlayed: 0.0,
    offsides: 0.0,
    ownGoals: 0.0,
    passToAssist: 1.0,
    penaltiesTaken: 0.0,
    penaltyConceded: 1.0,
    penaltyConversion: 0.0,
    penaltyFaced: 0.0,
    penaltyGoals: 0.0,
    penaltySave: 1.0,
    penaltyWon: 0.0,
    possessionLost: 0.0,
    possessionWonAttThird: 0.0,
    punches: 1.0,
    rating: 1.0,
    redCards: 1.0,
    rightFootGoals: 0.0,
    runsOut: 1.0,
    savedShotsFromInsideTheBox: 1.0,
    savedShotsFromOutsideTheBox: 1.0,
    saves: 1.0,
    savesCaught: 1.0,
    savesParried: 1.0,
    scoringFrequency: 0.0,
    setPieceConversion: 0.0,
    shotFromSetPiece: 0.0,
    shotsFromInsideTheBox: 0.0,
    shotsFromOutsideTheBox: 0.0,
    shotsOffTarget: 0.0,
    shotsOnTarget: 0.0,
    successfulDribbles: 0.0,
    successfulDribblesPercentage: 0.0,
    successfulRunsOut: 1.0,
    tackles: 0.0,
    tacklesWon: 0.0,
    tacklesWonPercentage: 0.0,
    totalAttemptAssist: 0.0,
    totalChippedPasses: 0.0,
    totalContest: 0.0,
    totalCross: 0.0,
    totalDuelsWon: 0.0,
    totalDuelsWonPercentage: 1.0,
    totalLongBalls: 0.0,
    totalOppositionHalfPasses: 1.0,
    totalOwnHalfPasses: 1.0,
    totalPasses: 1.0,
    totalRating: 1.0,
    totalShots: 0.0,
    totwAppearances: 0.0,
    touches: 0.0,
    wasFouled: 0.0,
    yellowCards: 0.0,
    yellowRedCards: 0.0,
  };

  const attributeWeightsPlayerVsGoalkeeper = {
    accurateChippedPasses: 0.0,
    accurateCrosses: 0.0,
    accurateCrossesPercentage: 0.0,
    accurateFinalThirdPasses: 0.0,
    accurateLongBalls: 0.0,
    accurateLongBallsPercentage: 0.0,
    accurateOppositionHalfPasses: 0.0,
    accurateOwnHalfPasses: 0.0,
    accuratePasses: 0.0,
    accuratePassesPercentage: 0.0,
    aerialDuelsWon: 0.0,
    aerialDuelsWonPercentage: 0.0,
    aerialLost: 0.0,
    appearances: 0.0,
    assists: 0.0,
    attemptPenaltyMiss: 0.0,
    attemptPenaltyPost: 0.0,
    attemptPenaltyTarget: 0.0,
    ballRecovery: 0.0,
    bigChancesCreated: 0.0,
    bigChancesMissed: 0.0,
    blockedShots: 0.0,
    cleanSheet: 0.0,
    clearances: 0.0,
    countRating: 0.0,
    crossesNotClaimed: 0.0,
    directRedCards: 0.0,
    dispossessed: 0.0,
    dribbledPast: 0.0,
    duelLost: 0.0,
    errorLeadToGoal: 0.0,
    errorLeadToShot: 0.0,
    expectedAssists: 0.0,
    expectedGoals: 0.0,
    fouls: 0.0,
    freeKickGoal: 0.0,
    goalConversionPercentage: 0.0,
    goals: 0.0,
    goalsAssistsSum: 0.0,
    goalsConceded: 0.0,
    goalsConcededInsideTheBox: 0.0,
    goalsConcededOutsideTheBox: 0.0,
    goalsFromInsideTheBox: 0.0,
    goalsFromOutsideTheBox: 0.0,
    goalKicks: 0.0,
    groundDuelsWon: 0.0,
    groundDuelsWonPercentage: 0.0,
    headedGoals: 0.0,
    highClaims: 0.0,
    hitWoodwork: 0.0,
    inaccuratePasses: 0.0,
    interceptions: 0.0,
    keyPasses: 0.0,
    leftFootGoals: 0.0,
    matchesStarted: 0.0,
    minutesPlayed: 0.0,
    offsides: 0.0,
    ownGoals: 0.0,
    passToAssist: 0.0,
    penaltiesTaken: 0.0,
    penaltyConceded: 0.0,
    penaltyConversion: 0.0,
    penaltyFaced: 0.0,
    penaltyGoals: 0.0,
    penaltySave: 0.0,
    penaltyWon: 0.0,
    possessionLost: 0.0,
    possessionWonAttThird: 0.0,
    punches: 0.0,
    rating: 0.0,
    redCards: 0.0,
    rightFootGoals: 0.0,
    runsOut: 0.0,
    savedShotsFromInsideTheBox: 0.0,
    savedShotsFromOutsideTheBox: 0.0,
    saves: 0.0,
    savesCaught: 0.0,
    savesParried: 0.0,
    scoringFrequency: 0.0,
    setPieceConversion: 0.0,
    shotFromSetPiece: 0.0,
    shotsFromInsideTheBox: 0.0,
    shotsFromOutsideTheBox: 0.0,
    shotsOffTarget: 0.0,
    shotsOnTarget: 0.0,
    successfulDribbles: 0.0,
    successfulDribblesPercentage: 0.0,
    successfulRunsOut: 0.0,
    tackles: 0.0,
    tacklesWon: 0.0,
    tacklesWonPercentage: 0.0,
    totalAttemptAssist: 0.0,
    totalChippedPasses: 0.0,
    totalContest: 0.0,
    totalCross: 0.0,
    totalDuelsWon: 0.0,
    totalDuelsWonPercentage: 0.0,
    totalLongBalls: 0.0,
    totalOppositionHalfPasses: 0.0,
    totalOwnHalfPasses: 0.0,
    totalPasses: 0.0,
    totalRating: 0.0,
    totalShots: 0.0,
    totwAppearances: 0.0,
    touches: 0.0,
    wasFouled: 0.0,
    yellowCards: 0.0,
    yellowRedCards: 0.0,
  };

  function isGoalkeeper(player) {
    return player.playerDetails.position === "G";
  }

  function isPercentage(attribute) {
    const aux = new Set([
      "totalRating",
      "rating",
      "countRating",
      "accurateCrossesPercentage",
      "accurateLongBallsPercentage",
      "accuratePassesPercentage",
      "aerialDuelsWonPercentage",
      "goalConversionPercentage",
      "groundDuelsWonPercentage",
      "successfulDribblesPercentage",
      "tacklesWonPercentage",
      "totalDuelsWonPercentage",
      "scoringFrequency",
    ]);
    return aux.has(attribute);
  }

  function getPlayerStatValue(player, attribute) {
    const value = player.playerStatistics[attribute];
    return value % 1 === 0 ? parseFloat(value) : value;
  }

  function getAttributeValue(playerStats, attributeName) {
    return parseFloat(playerStats[attributeName]);
  }

  function calculateAttributeSimilarity(value1, value2, tolerance = 0.01) {
    if (
      (value1 === 0 && value2 === 0) ||
      Math.abs(value1 - value2) < tolerance
    ) {
      return 100.0;
    }

    const maxValue = Math.max(value1, value2);
    const similarity = (Math.min(value1, value2) / maxValue) * 100.0;
    return similarity;
  }

  function calculateRateSimilarity(value1, value2, tolerance = 0.01) {
    const minValue = Math.min(value1, value2);
    const maxValue = Math.max(value1, value2);

    if (maxValue === 0) {
      return 100.0;
    }

    const relativeDifference = Math.abs(value1 - value2) / maxValue;

    if (relativeDifference < tolerance) {
      return 100.0;
    }

    const similarity = Math.max(0, 1 - relativeDifference) * 100.0;
    return similarity;
  }

  const attributeWeights =
    isGoalkeeper(player1) && isGoalkeeper(player2)
      ? attributeWeightsGoalkeeper
      : (isGoalkeeper(player1) && !isGoalkeeper(player2)) ||
        (!isGoalkeeper(player1) && isGoalkeeper(player2))
      ? attributeWeightsPlayerVsGoalkeeper
      : attributeWeightsPlayer;
  let totalAttributes = 0;
  let totalSimilarity = 0.0;

  for (const attribute in attributeWeights) {
    const weight = attributeWeights[attribute];
    if (
      player1.playerStatistics.hasOwnProperty(attribute) &&
      player2.playerStatistics.hasOwnProperty(attribute) &&
      weight > 0
    ) {
      let similarity;
      totalAttributes++;

      let value1 = getPlayerStatValue(player1, attribute);
      let value2 = getPlayerStatValue(player2, attribute);
      if (!isPercentage(attribute)) {
        value1 /= player1.playerStatistics.minutesPlayed;
        value2 /= player2.playerStatistics.minutesPlayed;
        similarity = calculateRateSimilarity(value1, value2);
      } else {
        similarity = calculateAttributeSimilarity(value1, value2);
      }
      totalSimilarity += weight * similarity;
      console.log(`${attribute}: %${similarity}`);
    }
  }
  console.log(`${totalAttributes}`);
  if (totalSimilarity == 0 && totalAttributes == 0) {
    return 0;
  }
  const averageSimilarity = totalSimilarity / totalAttributes;
  return parseFloat(averageSimilarity.toFixed(2));
}
