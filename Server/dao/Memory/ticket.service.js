class TicketService{
    #tickets;
    constructor(){
        this.#tickets = [];
    }

    async generateTicket(data){
        try {
            const ticket = { ...data, _id: this.#tickets.length + 1 }
            this.#tickets.push(ticket)
            return ticket._id
        } catch (error) {
            throw error       
        }
    }

    async getAll(){
        return this.#tickets
    }
}

export default TicketService;