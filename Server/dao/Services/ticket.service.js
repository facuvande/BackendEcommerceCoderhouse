import ticketModel from "../models/ticket.model.js";

class TicketMemoryService{
    #model
    constructor(){
        this.#model = ticketModel;
    }

    async generateTicket(data){
        console.log(data)
        const { _id } = await this.#model.create(data);
        return _id;
    }

    async getAll(){
        const allTickets = await this.#model.find()
        return allTickets
    }
}

export default TicketMemoryService