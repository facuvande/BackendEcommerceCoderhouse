import mongoose from "mongoose"

export const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    },
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)
export default cartsModel