export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getAll(){
        const result = await this.dao.getAll()
        return result
    }

    async saveUser(data){
        const result = this.dao.saveUser(data);
        return result
    }

    async findByEmail(email){
        const result = await this.dao.findByEmail(email)
        return result;
    }

    async findByCart(cid){
        const result = await this.dao.findByCart(cid)
        return result
    }

    async findById(uid){
        const result = await this.dao.findById(uid)
        return result
    }

    async changeRole(email){
        const result = await this.dao.changeRole(email)
        return result
    }

    async uploadDocuments(userId, documents, description){
        const result = await this.dao.uploadDocuments(userId, documents, description);
        return result
    }

    async areDocumentsUploaded(user){
        const result = await this.dao.areDocumentsUploaded(user);
        return result
    }
    
}