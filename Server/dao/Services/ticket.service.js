import ticketModel from "../models/ticket.model.js";
class TicketMemoryService{
    #model
    constructor(){
        this.#model = ticketModel;
    }

    async generateTicket(data){
        const ticket = await this.#model.create(data);
        return ticket;
    }

    async getAll(){
        const allTickets = await this.#model.find()
        return allTickets
    }
}

export default TicketMemoryService