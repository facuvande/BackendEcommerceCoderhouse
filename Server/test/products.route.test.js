import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'


dotenv.config()
describe('Products API Routes', () => {
    const requester = supertest('http://localhost:8080');
    describe('/products', () => {
        let cookie;
        let idProduct;
        beforeEach(async function () {
            const connection = await mongoose.connect(process.env.MONGO_TEST_URL)
            await mongoose.connection.db.collection('products').deleteMany({})
        })

        it('Debe logearse correctamente al usuario', async () => {
            const userTest = {
                email: 'AdminCoder2023@gmail.com',
                password: 'AdminCoder23Proyecto'
            }
            const login = await requester.post('/api/auth/login').send(userTest)
            const sessionCookie = login.headers['set-cookie'][0];

            cookie = {
                name: sessionCookie.split('=')[0],
                value: sessionCookie.split('=')[1].split(';')[0]
            };
        })

        it('Debe devolver un array de products', async () => {
            const res = await requester.get('/api/products').set('Cookie', `${cookie.name}=${cookie.value}`)
            idProduct = res.body.payload[0]._id
            expect(res.body.payload).to.be.an('array')
        })

        it('Debe devolver solo un usuario por id', async () => {
            const res = await requester.get(`/api/products/${idProduct}`).set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(res.body).to.be.an('object')
        })
    })
})