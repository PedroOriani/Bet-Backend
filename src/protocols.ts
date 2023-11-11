export type inputParticipantBody = {
    name: string;
    balance: number;
}

export type inputGameBody = {
    homeTeamName: string;
	awayTeamName: string;
}

export type ApplicationError = {
    name: string;
    message: string;
  };