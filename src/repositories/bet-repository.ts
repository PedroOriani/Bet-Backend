import prisma from "src/config/database"

async function createBet(gameId: number, participantId: number, homeTeamScore: number, awayTeamScore: number, amountBet: number){
    const bet = await prisma.bet.create({
        data: {
            homeTeamScore,
            awayTeamScore,
            amountBet,
            gameId,
            participantId
        }
    })

    return bet
}

const betRepository = {
    createBet
}

export default betRepository