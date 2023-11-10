import participantRepository from "../repositories/participant-repository";

async function createParticipant(name: String, balance: Number){

    return participantRepository.createParticipant(name, balance)
}

async function getParticipants(req: Request, res: Response){
    
}

const participantService = {
    createParticipant,
    getParticipants
}

export default participantService;