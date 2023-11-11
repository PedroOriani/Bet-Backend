import prisma from "../config/database"

async function createGame(homeTeamName: string, awayTeamName: string){
    const game = await prisma.game.create({
        data: {
            homeTeamName,
            awayTeamName
        }
    })

    return game
}

async function finishGame(){
    
}

async function getGames(){
    const games = await prisma.game.findMany()

    return games
}   

async function getGameById(id: number){

    const game = await prisma.game.findUnique({
        where: {
            id
        },
        include:{
            bet: true
        }
    })

    return game
}


const gameRepository = {
    createGame,
    finishGame,
    getGames,
    getGameById
}

export default gameRepository