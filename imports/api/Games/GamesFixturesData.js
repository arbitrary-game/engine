export default {
  // game that is ready to start - "Яндекс #2"
  Yandex2Game: {
    name: "Яндекс #2",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser"
  },
  //game with select opponent
  BeliyListGame: {
    name: "Белый Лист",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser",
    isStarted: true
  },
  // game with new rule set - "тестируем новые правила"
  TopSecretGame: {
    name: "Тестируем новые правила",
    ruleset: "Fixed bets",
    maxPlayers: 3,
    ownerId: "BobDylanUser"
  },
  // game with initiator raise
  ProSeriesGame: {
    name: "Только для профессионалов (рейтинг 500+)",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with initiator & opponent raise
  Yandex3Game: {
    name: "Yandex #3",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with stake
  IvanHomeGame: {
    name: "У Ивана",
    ruleset: "Classic",
    maxPlayers: 3,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with vote
  RamblerGame: {
    name: "Rambler #1",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // round 1 results
  Rambler2Game: {
    name: "Rambler #2",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  }
};
