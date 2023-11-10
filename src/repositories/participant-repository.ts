import prisma from "../config/database";

async function createParticipant(name: String, balance: Number){
    const participant = await prisma.participant.create({
        data: {
            updatedAt: new Date(),
            name,
            balance
        }
    })

    return participant
}

async function getParticipants(req: Request, res: Response){
    
}

const participantRepository = {
    createParticipant,
    getParticipants
}

export default participantRepository;