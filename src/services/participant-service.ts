import participantRepository from '../repositories/participant-repository';
import { badRequestError } from '@/errors';

async function createParticipant(name: string, balance: number) {
  return await participantRepository.createParticipant(name, balance);
}

async function getParticipants() {
  const participants = await participantRepository.getParticipants();

  if (participants.length === 0) throw badRequestError('Não tem participantes cadastrados');

  return participants;
}

const participantService = {
  createParticipant,
  getParticipants,
};

export default participantService;
