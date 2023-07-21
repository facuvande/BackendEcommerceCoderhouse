import { Router } from "express";
import { faker } from '@faker-js/faker'

const route = Router();

route.get('/', (req, res) =>{
    try {
        const persons = [];
        for(let i = 0 ; i < 100; i++){
            const firstName = faker.person.firstName(); // Rowan Nikolaus
            const lastName = faker.person.lastName();
            const email = faker.internet.email({firstName, lastName})
            const age = faker.number.int(18, 100)
            const password = faker.internet.password({length: 8, memorable: true})
            const cart = faker.string.uuid()
            const role = faker.helpers.arrayElement(['ADMIN', 'USER'])
            
            const data = {
                firstName,
                lastName,
                email,
                age,
                password,
                cart,
                role
            }
            persons.push(data)
        }
        res.send({status: 'sucess', payload: persons})
    } catch (error) {
        next(error)
    }
});


export default route
