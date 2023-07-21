import mongoose from 'mongoose'
import {z} from 'zod'
import { ProductDto } from './product.dtos.js'

export const CartDto = z.object({
    products: z.array(ProductDto)
})

export const Cid = z.object({
    cid: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id))
})