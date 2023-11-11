import prisma from "../config/database";

async function createParticipant(name: string, balance: number){
    const participant = await prisma.participant.create({
        data: {
            name,
            balance
        }
    })

    return participant
}

async function getParticipants(){
    const participants = await prisma.participant.findMany();
    
    return participants
}

const participantRepository = {
    createParticipant,
    getParticipants
}

export default participantRepository;