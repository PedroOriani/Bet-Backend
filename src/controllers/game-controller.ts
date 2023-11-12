import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import gameService from "src/services/game-service";

async function createGame(req: Request, res: Response, next: NextFunction){
    const { homeTeamName, awayTeamName } = req.body

    try{
        const game = await gameService.createGame(homeTeamName, awayTeamName)

        res.status(httpStatus.CREATED).send(game)
    }catch(err){
        next(err)
    }
}

async function finishGame(req: Request, res: Response, next: NextFunction){
    const { homeTeamScore, awayTeamScore } = req.body
    const { id } = req.params

    try{ 
        const game = await gameService.finishGame(homeTeamScore, awayTeamScore, Number(id))

        res.status(httpStatus.OK).send(game)
    }catch(err){
        next(err)
    }
}

async function getGames(req: Request, res: Response, next: NextFunction){

    try{
        const games = await gameService.getGames()

        res.status(httpStatus.OK).send(games)
    }catch(err){
        next(err)
    }
}

async function getGameById(req: Request, res: Response, next: NextFunction){

    try{
        const { id } = req.params

        const game = await gameService.getGameById(Number(id))
    
        res.status(httpStatus.OK).send(game)
    }catch (err){
        next(err)
    }
}

const gameController = {
    createGame,
    finishGame,
    getGames,
    getGameById
}

export default gameController