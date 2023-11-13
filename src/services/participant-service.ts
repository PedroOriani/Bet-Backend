import participantRepository from "../repositories/participant-repository";


async function createParticipant(name: string, balance: number) {
  return await participantRepository.createParticipant(name, balance);
}

async function getParticipants() {
  return await participantRepository.getParticipants();
}

const participantService = {
  createParticipant,
  getParticipants,
};

export default participantService;
