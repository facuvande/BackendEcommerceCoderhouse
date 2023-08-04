import mongoose from "mongoose"
import { cartsCollection } from "./carts.model.js"

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datatime: { type: Date, required: true },
    amount: { type: Number, required: true},
    purchaser: { type: String, required: true },
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel