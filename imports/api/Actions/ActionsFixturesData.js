export default {
  StartedSetBetAliceChooseOpponentAction: { gameId: "StartedSetBetGame", playerId: "StartedSetBetAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetBetBobPlayer" },

  StartedSetRaiseAliceChooseOpponentAction: { gameId: "StartedSetRaiseGame", playerId: "StartedSetRaiseAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetRaiseBobPlayer" },
  StartedSetRaiseAliceRaiseAction: { gameId: "StartedSetRaiseGame", playerId: "StartedSetRaiseAlicePlayer", type: "Raise", amount: 15 },

  StartedSetIncreasedRaiseAliceChooseOpponentAction: { gameId: "StartedSetIncreasedRaiseGame", playerId: "StartedSetIncreasedRaiseAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetIncreasedRaiseBobPlayer" },
  StartedSetIncreasedRaiseAliceRaiseAction: { gameId: "StartedSetIncreasedRaiseGame", playerId: "StartedSetIncreasedRaiseAlicePlayer", type: "Raise", amount: 15 },
  StartedSetIncreasedRaiseBobRaiseAction: { gameId: "StartedSetIncreasedRaiseGame", playerId: "StartedSetIncreasedRaiseBobPlayer", type: "Raise", amount: 25 },

  StartedSetStakeZeroOfThreeAliceChooseOpponentAction: { gameId: "StartedSetStakeZeroOfThreeGame", playerId: "StartedSetStakeZeroOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetStakeZeroOfThreeBobPlayer" },
  StartedSetStakeZeroOfThreeAliceRaiseAction: { gameId: "StartedSetStakeZeroOfThreeGame", playerId: "StartedSetStakeZeroOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetStakeZeroOfThreeBobRaiseAction: { gameId: "StartedSetStakeZeroOfThreeGame", playerId: "StartedSetStakeZeroOfThreeBobPlayer", type: "Raise", amount: 15 },

  StartedSetStakeOneOfThreeAliceChooseOpponentAction: { gameId: "StartedSetStakeOneOfThreeGame", playerId: "StartedSetStakeOneOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetStakeOneOfThreeBobPlayer" },
  StartedSetStakeOneOfThreeAliceRaiseAction: { gameId: "StartedSetStakeOneOfThreeGame", playerId: "StartedSetStakeOneOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetStakeOneOfThreeBobRaiseAction: { gameId: "StartedSetStakeOneOfThreeGame", playerId: "StartedSetStakeOneOfThreeBobPlayer", type: "Raise", amount: 15 },
  StartedSetStakeOneOfThreeAliceStakeAction: { gameId: "StartedSetStakeOneOfThreeGame", playerId: "StartedSetStakeOneOfThreeAlicePlayer", type: "Stake", amount: 20 },

  StartedSetStakeTwoOfThreeAliceChooseOpponentAction: { gameId: "StartedSetStakeTwoOfThreeGame", playerId: "StartedSetStakeTwoOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetStakeTwoOfThreeBobPlayer" },
  StartedSetStakeTwoOfThreeAliceRaiseAction: { gameId: "StartedSetStakeTwoOfThreeGame", playerId: "StartedSetStakeTwoOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetStakeTwoOfThreeBobRaiseAction: { gameId: "StartedSetStakeTwoOfThreeGame", playerId: "StartedSetStakeTwoOfThreeBobPlayer", type: "Raise", amount: 15 },
  StartedSetStakeTwoOfThreeAliceStakeAction: { gameId: "StartedSetStakeTwoOfThreeGame", playerId: "StartedSetStakeTwoOfThreeAlicePlayer", type: "Stake", amount: 20 },
  StartedSetStakeTwoOfThreeBobStakeAction: { gameId: "StartedSetStakeTwoOfThreeGame", playerId: "StartedSetStakeTwoOfThreeBobPlayer", type: "Stake", amount: 30 },

  StartedSetVoteZeroOfThreeAliceChooseOpponentAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetVoteZeroOfThreeBobPlayer" },
  StartedSetVoteZeroOfThreeAliceRaiseAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetVoteZeroOfThreeBobRaiseAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeBobPlayer", type: "Raise", amount: 15 },
  StartedSetVoteZeroOfThreeAliceStakeAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeAlicePlayer", type: "Stake", amount: 20 },
  StartedSetVoteZeroOfThreeBobStakeAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeBobPlayer", type: "Stake", amount: 30 },
  StartedSetVoteZeroOfThreeWinstonStakeAction: { gameId: "StartedSetVoteZeroOfThreeGame", playerId: "StartedSetVoteZeroOfThreeWinstonPlayer", type: "Stake", amount: 30 },

  StartedSetVoteOneOfThreeAliceChooseOpponentAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetVoteOneOfThreeBobPlayer" },
  StartedSetVoteOneOfThreeAliceRaiseAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetVoteOneOfThreeBobRaiseAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeBobPlayer", type: "Raise", amount: 15 },
  StartedSetVoteOneOfThreeAliceStakeAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeAlicePlayer", type: "Stake", amount: 20 },
  StartedSetVoteOneOfThreeBobStakeAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeBobPlayer", type: "Stake", amount: 30 },
  StartedSetVoteOneOfThreeWinstonStakeAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeWinstonPlayer", type: "Stake", amount: 30 },
  StartedSetVoteOneOfThreeAliceVoteAction: { gameId: "StartedSetVoteOneOfThreeGame", playerId: "StartedSetVoteOneOfThreeAlicePlayer", type: "Vote", candidateId: "StartedSetVoteOneOfThreeBobPlayer" },

  StartedSetVoteTwoOfThreeAliceChooseOpponentAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetVoteTwoOfThreeBobPlayer" },
  StartedSetVoteTwoOfThreeAliceRaiseAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeAlicePlayer", type: "Raise", amount: 15 },
  StartedSetVoteTwoOfThreeBobRaiseAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeBobPlayer", type: "Raise", amount: 15 },
  StartedSetVoteTwoOfThreeAliceStakeAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeAlicePlayer", type: "Stake", amount: 20 },
  StartedSetVoteTwoOfThreeBobStakeAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeBobPlayer", type: "Stake", amount: 30 },
  StartedSetVoteTwoOfThreeWinstonStakeAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeWinstonPlayer", type: "Stake", amount: 30 },
  StartedSetVoteTwoOfThreeAliceVoteAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeAlicePlayer", type: "Vote", candidateId: "StartedSetVoteTwoOfThreeBobPlayer" },
  StartedSetVoteTwoOfThreeBobVoteAction: { gameId: "StartedSetVoteTwoOfThreeGame", playerId: "StartedSetVoteTwoOfThreeBobPlayer", type: "Vote", candidateId: "StartedSetVoteTwoOfThreeBobPlayer" },

  StartedSetRoundTwoChooseOpponentAliceChooseOpponentAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentAlicePlayer", type: "ChooseOpponent", opponentId: "StartedSetRoundTwoChooseOpponentBobPlayer" },
  StartedSetRoundTwoChooseOpponentAliceRaiseAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentAlicePlayer", type: "Raise", amount: 15 },
  StartedSetRoundTwoChooseOpponentBobRaiseAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentBobPlayer", type: "Raise", amount: 15 },
  StartedSetRoundTwoChooseOpponentAliceStakeAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentAlicePlayer", type: "Stake", amount: 20 },
  StartedSetRoundTwoChooseOpponentBobStakeAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentBobPlayer", type: "Stake", amount: 30 },
  StartedSetRoundTwoChooseOpponentWinstonStakeAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentWinstonPlayer", type: "Stake", amount: 30 },
  StartedSetRoundTwoChooseOpponentAliceVoteAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentAlicePlayer", type: "Vote", candidateId: "StartedSetRoundTwoChooseOpponentBobPlayer" },
  StartedSetRoundTwoChooseOpponentBobVoteAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentBobPlayer", type: "Vote", candidateId: "StartedSetRoundTwoChooseOpponentBobPlayer" },
  StartedSetRoundTwoChooseOpponentWinstonVoteAction: { gameId: "StartedSetRoundTwoChooseOpponentGame", playerId: "StartedSetRoundTwoChooseOpponentWinstonPlayer", type: "Vote", candidateId: "StartedSetRoundTwoChooseOpponentAlicePlayer" },

  FinishedAliceChooseOpponentAction: { gameId: "FinishedGame", playerId: "FinishedAlicePlayer", type: "ChooseOpponent", opponentId: "FinishedBobPlayer" },
  FinishedAliceRaiseAction: { gameId: "FinishedGame", playerId: "FinishedAlicePlayer", type: "Raise", amount: 450 },
  FinishedBobRaiseAction: { gameId: "FinishedGame", playerId: "FinishedBobPlayer", type: "Raise", amount: 450 },
  FinishedAliceStakeAction: { gameId: "FinishedGame", playerId: "FinishedAlicePlayer", type: "Stake", amount: 20 },
  FinishedBobStakeAction: { gameId: "FinishedGame", playerId: "FinishedBobPlayer", type: "Stake", amount: 30 },
  FinishedWinstonStakeAction: { gameId: "FinishedGame", playerId: "FinishedWinstonPlayer", type: "Stake", amount: 30 },
  FinishedAliceVoteAction: { gameId: "FinishedGame", playerId: "FinishedAlicePlayer", type: "Vote", candidateId: "FinishedBobPlayer" },
  FinishedBobVoteAction: { gameId: "FinishedGame", playerId: "FinishedBobPlayer", type: "Vote", candidateId: "FinishedBobPlayer" },
  FinishedWinstonVoteAction: { gameId: "FinishedGame", playerId: "FinishedWinstonPlayer", type: "Vote", candidateId: "FinishedAlicePlayer" },

  StartedKickInvoiceAliceKickAction: { gameId: "StartedKickInvoiceGame", playerId: "StartedKickInvoiceAlicePlayer", type: "Kick", opponentId: "StartedKickInvoiceBobPlayer", decision: true },

  StartedPlayerKickedFinishedAliceKickAction: { gameId: "StartedPlayerKickedFinishedGame", playerId: "StartedPlayerKickedFinishedAlicePlayer", type: "Kick", opponentId: "StartedPlayerKickedFinishedBobPlayer", decision: true },
  StartedPlayerKickedFinishedWinstonKickAction: { gameId: "StartedPlayerKickedFinishedGame", playerId: "StartedPlayerKickedFinishedWinstonPlayer", type: "Kick", opponentId: "StartedPlayerKickedFinishedBobPlayer", decision: true },

  StartedPlayerKickedInProgressAliceKickAction: { gameId: "StartedPlayerKickedInProgressGame", playerId: "StartedPlayerKickedInProgressAlicePlayer", type: "Kick", opponentId: "StartedPlayerKickedInProgressBobPlayer", decision: true },
  StartedPlayerKickedInProgressWinstonKickAction: { gameId: "StartedPlayerKickedInProgressGame", playerId: "StartedPlayerKickedInProgressWinstonPlayer", type: "Kick", opponentId: "StartedPlayerKickedInProgressBobPlayer", decision: true },
  StartedPlayerKickedInProgressFranklinKickAction: { gameId: "StartedPlayerKickedInProgressGame", playerId: "StartedPlayerKickedInProgressFranklinPlayer", type: "Kick", opponentId: "StartedPlayerKickedInProgressBobPlayer", decision: true },

  StartedPlayerLeaveAliceLeaveAction: { gameId: "StartedPlayerLeaveGame", playerId: "StartedPlayerLeaveAlicePlayer", type: "Leave" },

  StartedKickInvoiceAndLeaveAliceKickAction: { gameId: "StartedKickInvoiceAndLeaveGame", playerId: "StartedKickInvoiceAndLeaveAlicePlayer", type: "Kick", opponentId: "StartedKickInvoiceAndLeaveBobPlayer", decision: true },
  StartedKickInvoiceAndLeaveAliceLeaveAction: { gameId: "StartedKickInvoiceAndLeaveGame", playerId: "StartedKickInvoiceAndLeaveAlicePlayer", type: "Leave" },
};
