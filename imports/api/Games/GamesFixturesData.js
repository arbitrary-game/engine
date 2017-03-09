const startDate = new Date();
startDate.setHours(-1);

export default {
  CreatedOneOfThreeGame: {
    name: "Игра создана, игроки 1 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
  },

  CreatedTwoOfThreeGame: {
    name: "Игра создана, игроки 2 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
  },

  CreatedThreeOfThreeGame: {
    name: "Игра создана, игроки 3 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
  },

  CreatedTwoOfFiveGame: {
    name: "Игра создана, игроки 2 из 5",
    rulesetId: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser",
  },

  StartedChooseOpponentGame: {
    name: "Игра запущена, выбор оппонента",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetBetGame: {
    name: "Игра запущена, выбор пари",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetRaiseGame: {
    name: "Игра запущена, принятие пари",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetIncreasedRaiseGame: {
    name: "Игра запущена, принятие повышеного пари",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetStakeZeroOfThreeGame: {
    name: "Игра запущена, выбор ставки 0 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetStakeOneOfThreeGame: {
    name: "Игра запущена, выбор ставки 1 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetStakeTwoOfThreeGame: {
    name: "Игра запущена, выбор ставки 2 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetVoteZeroOfThreeGame: {
    name: "Игра запущена, выбор кандидата 0 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetVoteOneOfThreeGame: {
    name: "Игра запущена, выбор кандидата 1 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetVoteTwoOfThreeGame: {
    name: "Игра запущена, выбор кандидата 2 из 3",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedSetRoundTwoChooseOpponentGame: {
    name: "Игра запущена, раунд 2, выбор оппонента",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  FinishedGame: {
    name: "Игра закончена",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedKickInvoiceGame: {
    name: "Игра запущена, предложение исключить игрока 1 из 2",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedPlayerKickedFinishedGame: {
    name: "Игра запущена, игрок исключен, конец игры",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedPlayerKickedInProgressGame: {
    name: "Игра запущена, игрок исключен, раунд сначала",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedPlayerLeaveGame: {
    name: "Игра запущена, игрок вышел, раунд сначала",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  StartedKickInvoiceAndLeaveGame: {
    name: "Игра запущена, предложение исколючить и сразу выход",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "AliceRipleyUser",
    startedAt: startDate,
  },

  CreatedX2ModeGame: {
    name: "Игра создана, режим X2",
    rulesetId: "X2",
    maxPlayers: 3,
    ownerId: "BobDylanUser",
  },
};
