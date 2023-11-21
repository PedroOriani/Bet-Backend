import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app';
import prisma from '../../src/config/database';
import { createParticipant, getParticipantById, updateBalance } from '../factories/participant-factory';
import { createFinishedGame, createGame } from '../factories/game-factory';
import { createBet, createBetWithScores, getBetById } from '../factories/bet-factory';

const api = supertest(app);

describe('POST /games', () => {
  beforeEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.game.deleteMany();
    await prisma.participant.deleteMany();
  });

  it('Should return status 201 and return a object when there is a valid data', async () => {
    const validBody = {
      homeTeamName: faker.location.city(),
      awayTeamName: faker.location.city(),
    };

    const { status, body } = await api.post('/games').send(validBody);
    expect(status).toBe(httpStatus.CREATED);
    expect(body).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      homeTeamName: validBody.homeTeamName,
      awayTeamName: validBody.awayTeamName,
      homeTeamScore: 0,
      awayTeamScore: 0,
      isFinished: false,
    });
  });
});

describe('GET /games', () => {
  beforeEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.game.deleteMany();
    await prisma.participant.deleteMany();
  });

  it('Should return status 400 and when there is no game', async () => {
    const { status, text } = await api.get('/games');
    expect(status).toBe(httpStatus.BAD_REQUEST);
    expect(text).toBe('{"message":"Não tem jogos cadastrados"}');
  });

  it('Should return status 200 and return a object', async () => {
    await createGame();
    await createGame();

    const { status, body } = await api.get('/games');
    expect(status).toBe(httpStatus.OK);
    expect(body).toHaveLength(2);
  });
});

describe('GET /games/:id', () => {
  beforeEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.game.deleteMany();
    await prisma.participant.deleteMany();
  });

  it('Should return status 404 and when there is no game', async () => {
    const { status } = await api.get(`/games/2`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should return status 200 and return a object', async () => {
    const participant = await createParticipant();
    const game = await createGame();

    const bet = await createBet(game.id, participant.id, participant.balance - 100);

    const { status, body } = await api.get(`/games/${game.id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      id: game.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      homeTeamName: game.homeTeamName,
      awayTeamName: game.awayTeamName,
      homeTeamScore: game.homeTeamScore,
      awayTeamScore: game.awayTeamScore,
      isFinished: false,
      bets: [
        {
          id: bet.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          homeTeamScore: bet.homeTeamScore,
          awayTeamScore: bet.awayTeamScore,
          amountBet: bet.amountBet, // representado em centavos, ou seja, R$ 10,00 -> 1000
          gameId: game.id,
          participantId: participant.id,
          status: 'PENDING', // podendo ser PENDING, WON ou LOST
          amountWon: null, // nulo quando a aposta ainda está PENDING; number caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
        },
      ],
    });
  });
});

describe('POST /games/:id/finish', () => {
  beforeEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.game.deleteMany();
    await prisma.participant.deleteMany();
  });

  it('Should return status 400 when gameId doesnt exist', async () => {
    const invalidBody = {
      homeTeamScore: faker.number.int({ min: 1, max: 10 }),
      awayTeamScore: faker.number.int({ min: 1, max: 10 }),
    };

    const { status } = await api.post(`/games/1/finish`).send(invalidBody);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should return status 400 when game is finished', async () => {
    const game = await createFinishedGame();

    const validBody = {
      homeTeamScore: faker.number.int({ min: 1, max: 10 }),
      awayTeamScore: faker.number.int({ min: 1, max: 10 }),
    };

    const { status, text } = await api.post(`/games/${game.id}/finish`).send(validBody);
    expect(status).toBe(httpStatus.BAD_REQUEST);
    expect(text).toBe('{"message":"O jogo já foi finalizado"}');
  });

  it('Should return status 201 and return a object when there is a valid data', async () => {
    const game = await createGame();

    const validBody = {
      homeTeamScore: faker.number.int({ min: 1, max: 10 }),
      awayTeamScore: faker.number.int({ min: 1, max: 10 }),
    };

    const { status, body } = await api.post(`/games/${game.id}/finish`).send(validBody);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      homeTeamName: game.homeTeamName,
      awayTeamName: game.awayTeamName,
      homeTeamScore: validBody.homeTeamScore,
      awayTeamScore: validBody.awayTeamScore,
      isFinished: true,
    });
  });

  it('Should update bet when there is a valid data and the score is correct', async () => {
    const participant = await createParticipant();
    const game = await createGame();
    const bet = await createBet(game.id, participant.id, participant.balance - 100);

    const validBody = {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
    };

    const { status } = await api.post(`/games/${game.id}/finish`).send(validBody);
    expect(status).toBe(httpStatus.OK);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const betUpdated = await getBetById(bet.id);

    expect(betUpdated.status).toEqual('WON');
  });

  it('Should update bet when there is a valid data and the score is incorrect', async () => {
    const participant = await createParticipant();
    const game = await createGame();
    const bet = await createBet(game.id, participant.id, participant.balance - 100);

    const validBody = {
      homeTeamScore: bet.homeTeamScore + 1,
      awayTeamScore: bet.awayTeamScore,
    };

    const { status } = await api.post(`/games/${game.id}/finish`).send(validBody);
    expect(status).toBe(httpStatus.OK);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const betUpdated = await getBetById(bet.id);

    expect(betUpdated.status).toEqual('LOST');
  });

  it('Should update balance when there is a valid data and the score is correct', async () => {
    const participant = await createParticipant();
    const game = await createGame();
    const newBalance = faker.number.int({ min: 100, max: 200 });
    const bet = await createBet(game.id, participant.id, participant.balance - newBalance);
    await updateBalance(participant.id, newBalance);

    const validBody = {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
    };
    const amountWon = Math.floor(bet.amountBet * 0.7);
    const { status } = await api.post(`/games/${game.id}/finish`).send(validBody);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const participantUpdated = await api.get(`/participants`);
    expect(status).toBe(httpStatus.OK);
    expect(participantUpdated.body[0].balance).toBe(newBalance + amountWon);
  });

  it('must update the balance of the participant who got the result correct (1 correct & 1 wrong)', async () => {
    const participantCorrect = await createParticipant();
    const participantWrong = await createParticipant();
    const game = await createGame();
    const newBalance = faker.number.int({ min: 100, max: 200 });
    const betCorrect = await createBet(game.id, participantCorrect.id, participantWrong.balance - newBalance);
    const betWrong = await createBet(game.id, participantWrong.id, participantWrong.balance - newBalance);
    await updateBalance(participantCorrect.id, newBalance);
    await updateBalance(participantWrong.id, newBalance);

    const validBody = {
      homeTeamScore: betCorrect.homeTeamScore,
      awayTeamScore: betCorrect.awayTeamScore,
    };

    const amountWon = Math.floor(
      (betCorrect.amountBet / betCorrect.amountBet) * (betCorrect.amountBet + betWrong.amountBet) * 0.7,
    );

    await api.post(`/games/${game.id}/finish`).send(validBody);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const participantCorrectUpdated = await getParticipantById(participantCorrect.id);
    const participantWrongUpdated = await getParticipantById(participantWrong.id);
    expect(participantCorrectUpdated.balance).toBe(newBalance + amountWon);
    expect(participantWrongUpdated.balance).toBe(newBalance);
  });

  it('must update the balance of the participant who got the result correct (2 corrects)', async () => {
    const participantOne = await createParticipant();
    const participantTwo = await createParticipant();
    const game = await createGame();
    const newBalance = faker.number.int({ min: 100, max: 200 });
    const betOne = await createBet(game.id, participantOne.id, participantOne.balance - newBalance);
    const betTwo = await createBetWithScores(
      game.id,
      participantTwo.id,
      participantTwo.balance - newBalance,
      betOne.homeTeamScore,
      betOne.awayTeamScore,
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await updateBalance(participantOne.id, newBalance);
    await updateBalance(participantTwo.id, newBalance);

    const validBody = {
      homeTeamScore: betOne.homeTeamScore,
      awayTeamScore: betOne.awayTeamScore,
    };

    const amountWonOne = Math.floor(
      (betOne.amountBet / (betOne.amountBet + betTwo.amountBet)) * (betOne.amountBet + betTwo.amountBet) * 0.7,
    );
    const amountWonTwo = Math.floor(
      (betTwo.amountBet / (betOne.amountBet + betTwo.amountBet)) * (betOne.amountBet + betTwo.amountBet) * 0.7,
    );

    await api.post(`/games/${game.id}/finish`).send(validBody);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const participantOneUpdated = await getParticipantById(participantOne.id);
    const participantTwoUpdated = await getParticipantById(participantTwo.id);

    expect(participantOneUpdated.balance).toBe(newBalance + amountWonOne);
    expect(participantTwoUpdated.balance).toBe(newBalance + amountWonTwo);
  });
});
