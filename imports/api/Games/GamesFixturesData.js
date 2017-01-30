const startDate = new Date();
startDate.setHours(-1);

export default {
  // game that is ready to start - "Яндекс"
  Yandex: {
    name: "Яндекс",
    rulesetId: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser"
  },
  //game with select opponent
  BeliyList: {
    name: "Белый Лист",
    rulesetId: "Classic",
    maxPlayers: 5,
    ownerId: "AliceRipleyUser",
    isStarted: true,
    startedAt: startDate
  },
  // game with new rule set - "тестируем новые правила"
  TopSecret: {
    name: "Тестируем новые правила",
    rulesetId: "Fixed bets",
    maxPlayers: 3,
    ownerId: "BobDylanUser"
  },
  // game with initiator raise
  ProSeries: {
    name: "Только для профессионалов (рейтинг 500+)",
    rulesetId: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // game with initiator & opponent raise
  VityaJob: {
    name: "Игра у Вити",
    rulesetId: "Classic",
    maxPlayers: 5,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // game with stake
  IvanHome: {
    name: "У Ивана",
    rulesetId: "Classic",
    maxPlayers: 3,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // game with vote
  Rambler: {
    name: "Rambler",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // round 1 results
  PeskiVremeni: {
    name: "Антикафе 'Пески Времени'",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // game in progress with 2 rounds
  Shokoladnitsa: {
    name: "Игра в Шоколаднице",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  },
  // finished game with 3 rounds
  NulevoyKilometer: {
    name: "Нулевой километр",
    rulesetId: "Classic",
    maxPlayers: 4,
    ownerId: "WinstonChurchillUser",
    isStarted: true,
    startedAt: startDate
  }
};
