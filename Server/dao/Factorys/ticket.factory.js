import config from '../../config.js';

class TicketFactory{
    static async getDao(){
        switch(config.persistence){
            case "MONGO":
                const {default: TicketService} = await import('../Services/ticket.service.js')
                return TicketService
                break;
            case "MEMORY":
                const {default: TicketMemoryService} = await import ('../Memory/ticket.service.js')
                return TicketMemoryService
                break;
            default: 
                throw new Error('Wrong Config')
        }
    }
}

export default TicketFactory