import usersModel from "../models/users.model.js";

class UsersService{
    #model
    constructor(){
        this.#model = usersModel;
    }

    async getAll(){
        const allUsers = await this.#model.find()
        return allUsers
    }

    async saveUser(data){
        const { _id } = await this.#model.create(data);
        return _id;
    }

    async findByEmail(email){
        const userEmail = await this.#model.findOne({email: email})
        return userEmail;
    }

    async findByCart(cid){
        const userCart = await this.#model.findOne({cart: cid})
        return userCart
    }

    async findById(uid){
        const user = await this.#model.findOne({_id: uid})
        return user
    }

    async changePassword(newPassword, email){
        const change = await this.#model.findOneAndUpdate({email: email}, {password: newPassword}, {new: true});
        return change
    }

    async changeRole(email){
        const {role} = await this.findByEmail(email);
        let newRole;
        // Si el rol del usuario es PREMIUM entonces va a ser el nuevo rol USER, sino es PREMIUM
        (role === 'PREMIUM') ? newRole = 'USER' : newRole = 'PREMIUM'
        const changeRole = await this.#model.findOneAndUpdate({email: email}, {role: newRole})
        return newRole
    }

    async uploadDocuments(userId, documents, description){
        const user = await this.findById(userId);

        const existingDocumentIndex = user.documents.findIndex(doc => doc.name === description)

        if(existingDocumentIndex !== -1){
            user.documents[existingDocumentIndex] = {
                name: description,
                reference: documents[0].path
            }
        }else{
            user.documents.push({
                name: description,
                reference: documents[0].path
            })
        }

        const loadDocuments = await this.#model.updateOne({ _id: userId }, { documents: user.documents })
        return 'ok';
    }

    async areDocumentsUploaded(user){
        const areUploaded = user.documents.length < 3 ? false : true;
        return areUploaded;
    }
}

export default UsersService