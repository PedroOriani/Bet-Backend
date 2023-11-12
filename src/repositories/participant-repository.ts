import prisma from '../config/database';

async function createParticipant(name: string, balance: number) {
  const participant = await prisma.participant.create({
    data: {
      name,
      balance,
    },
  });

  return participant;
}

async function getParticipants() {
  const participants = await prisma.participant.findMany();

  return participants;
}

async function getParticipantById(id: number) {
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
  });

  return participant;
}

async function updateParticipantBalance(participantId: number, newBalance: number) {
  const participantUpdated = await prisma.participant.update({
    where: {
      id: participantId,
    },
    data: {
      balance: newBalance,
      updatedAt: new Date(),
    },
  });

  return participantUpdated;
}

const participantRepository = {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipantBalance,
};

export default participantRepository;
