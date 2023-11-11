import { notFoundError } from "../errors/not-found-error"
import gameRepository from "../repositories/game-repository"

async function createGame(homeTeamName: string, awayTeamName: string){
    return await gameRepository.createGame(homeTeamName, awayTeamName)
}

async function finishGame(){

}

async function getGames(){
    const games = await gameRepository.getGames()

    if (games.length === 0) throw notFoundError()

    return games
}

async function getGameById(id: number){
    const game = await gameRepository.getGameById(id)

    if (!game) throw notFoundError()

    return game
}

const gameService = {
    createGame,
    finishGame,
    getGames,
    getGameById
}

export default gameService