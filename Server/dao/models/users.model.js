import mongoose from "mongoose"
import { cartsCollection } from "./carts.model.js"

const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: String, required: true },
    password: { type: String, required: true },
    cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: cartsCollection,
            default: null,
    }, 
    role: { type: String, required: true, default: 'USER' },
    documents: [
        {
            name: { type: String, required: true },
            reference: { type: String, required: true }
        }
    ],
    last_connection: { type: Date, default: null }
})

usersSchema.pre('findOne', function(){
    this.populate('cart')
})

const usersModel = mongoose.model(usersCollection, usersSchema)
export default usersModel