class UsersMemoryService{
    #users
    constructor(){
        this.#users = [];
    }

    async getAll(){
        return this.#users
    }

    async saveUser(data){
        try {
            const user = { ...data, _id: this.#users.length + 1 }
            this.#users.push(user)
            return user._id            
        } catch (error) {
            throw error
        }
    }

    async findByEmail(email){
        try {
            const userEmail = this.#users.find(user => user.email === email)
            if(userEmail){
                return userEmail
            }
            return false
        } catch (error) {
            throw error
        }
    }

    async findByCart(cid){
        try {
            const userCart = this.#users.find(user => user.cart === cid)
            if(userCart){
                return userCart
            }
            return false
        } catch (error) {
            throw error
        }
    }
}

export default UsersMemoryService