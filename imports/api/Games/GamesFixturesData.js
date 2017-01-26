export default {
  // game that is ready to start - "Яндекс #2"
  Yandex: {
    name: "Яндекс #2",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser"
  },
  //game with select opponent
  BeliyList: {
    name: "Белый Лист",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser",
    isStarted: true
  },
  // game with new rule set - "тестируем новые правила"
  TopSecret: {
    name: "Тестируем новые правила",
    ruleset: "Fixed bets",
    maxPlayers: 3,
    ownerId: "BobDylanUser"
  },
  // game with initiator raise
  ProSeries: {
    name: "Только для профессионалов (рейтинг 500+)",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with initiator & opponent raise
  Vitya: {
    name: "Игра у Вити",
    ruleset: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with stake
  IvanHome: {
    name: "У Ивана",
    ruleset: "Classic",
    maxPlayers: 3,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game with vote
  Rambler: {
    name: "Rambler",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // round 1 results
  PeskiVremeni: {
    name: "Антикафе 'Пески Времени'",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // game in progress with 2 rounds
  Shokoladnitsa: {
    name: "Игра в шоколаднице",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  },
  // finished game with 3 rounds
  NulevoyKilometer: {
    name: "Нулевой километр",
    ruleset: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true
  }
};
