import prisma from "@/config/database";


async function createBet(
  gameId: number,
  participantId: number,
  homeTeamScore: number,
  awayTeamScore: number,
  amountBet: number,
) {
  const bet = await prisma.bet.create({
    data: {
      homeTeamScore,
      awayTeamScore,
      amountBet,
      gameId,
      participantId,
    },
  });

  return bet;
}

async function updateBet(betId: number, result: string, amountWon: number) {
  const bet = await prisma.bet.update({
    where: {
      id: betId,
    },
    data: {
      status: result,
      amountWon: amountWon,
      updatedAt: new Date(),
    },
  });

  return bet;
}

const betRepository = {
  createBet,
  updateBet,
};

export default betRepository;
