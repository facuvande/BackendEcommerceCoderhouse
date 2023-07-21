import mongoose from "mongoose";
import {z} from 'zod'
import { ProductDto } from "./product.dtos.js";

export const UserDto = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255),
    email: z.string().email(),
    age: z.number().refine((value) => value >= 1 && value <= 100),
    password: z.string(),
    cart: z.array(ProductDto).optional(),
    role: z.enum(['ADMIN', 'USER']).optional(),
})

// z.string().refine(id => mongoose.Types.ObjectId.isValid(id))