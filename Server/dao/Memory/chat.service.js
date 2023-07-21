class ChatService {
    #chat
    constructor(){
        this.#chat = [];
    }

    async addMessage(data){
        try {
            const message = { ...data, _id: this.#chat.length + 1 }
            this.#chat.push(message)
            return message._id
        } catch (error) {
            throw error       
        }
    }
}

export default ChatService