export type inputParticipantBody = {
    name: string;
    balance: number;
}

export type inputGameBody = {
    homeTeamName: string;
	awayTeamName: string;
}

export type inputBetBody = {
    homeTeamScore: number;
    awayTeamScore: number;
    amountBet: number;
    gameId: number;
    participantId: number;
}

export type ApplicationError = {
    name: string;
    message: string;
  };