export default {
  Yandex2Game: {
    name: "Яндекс #2",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser"
  },
  BeliyListGame: {
    name: "Белый Лист",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser"
  },
  TopSecretGame: {
    name: "Тестируем новые правила",
    ruleset: "Fixed bets",
    maxPlayers: 3,
    ownerId: "BobDylanUser"
  },
  ProSeriesGame: {
    name: "Только для профессионалов (рейтинг 500+)",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    rounds: [{name: 'Round 1'}, {name: 'Round 2'}],
    pendingActions: [{ownerId: 'WinstonChurchillUser', text: 'Waiting for Winston to bet'}]
  }
};
