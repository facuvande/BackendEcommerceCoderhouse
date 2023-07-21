import mongoose from 'mongoose'
import {z} from 'zod'

export const ProductDto = z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    thumbnail: z.unknown().optional(),
    code: z.string(),
    stock: z.number(),
    status: z.boolean().optional()
})

export const Pid = z.object({
    pid: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id))
})