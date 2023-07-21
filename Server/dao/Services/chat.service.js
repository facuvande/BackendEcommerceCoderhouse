import messagesModel from '../models/messages.model.js'

class ChatService {
    #model
    constructor(){
        this.#model = messagesModel;
    }

    async addMessage(data){
        return this.#model.create(data);
    }
}

export default ChatService 