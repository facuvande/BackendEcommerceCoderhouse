import usersModel from "../models/users.model.js";

class UsersService{
    #model
    constructor(){
        this.#model = usersModel;
    }

    async getAll(){
        const allUsers = await this.#model.find({}, 'firstName lastName email age cart role last_connection profileImg')
        return allUsers
    }

    async saveUser(data){
        const { _id } = await this.#model.create(data);
        return _id;
    }

    async savePaymentId(email, payment, items){
        const user = await this.findByEmail(email);

        user.paymentsHistory.push({ fecha: new Date() ,...payment });

        // Retorna el usuario guardado
        const save = await user.save();
        console.log(save)
        return save;
    }

    async savePaymentHistory(email, payment){
        const user = await this.findByEmail(email);

        const pagoExist = user.paymentsHistory.find(pay => pay.id === payment.id);
        if(pagoExist){
            pagoExist.status = payment.collection_status,
            pagoExist.paymentType = payment.payment_type,
            pagoExist.payment_id = payment.payment_id,
            pagoExist.paymentMerchantOrder_id = payment.merchant_order_id
        }else{
            return {error: 'No existe ningun pago con ese id'};
        }

        const save = await user.save();

        return save.paymentsHistory;
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

    async uploadProfile(user, data){

        if(data.file == 'undefined'){
            const updatedUser = await this.#model.findOneAndUpdate(
                { email: user },
                { $set : { firstName: data.firstName, lastName: data.lastName } },
                { returnOriginal: false }
            )
            return updatedUser
        }else{
            console.log(data.file)
            const updatedUser = await this.#model.findOneAndUpdate(
                { email: user },
                { $set : { firstName: data.firstName, lastName: data.lastName, profileImg: data.file } },
                { returnOriginal: false }
            )
            return updatedUser
        }
    }

    async deleteUser(uid){
        const user = await this.#model.findByIdAndDelete(uid)
        return user
    }
}

export default UsersService