import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: Array,
        default: [],
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String,
        default: 'ADMIN'
    }

})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema)
export default productsModel