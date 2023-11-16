export type InputParticipantBody = {
  name: string;
  balance: number;
};

export type InputGameBody = {
  homeTeamName: string;
  awayTeamName: string;
};

export type InputBetBody = {
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
};

export type ApplicationError = {
  name: string;
  message: string;
};
