import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'


dotenv.config()
describe('Carts API Routes', () => {
    const requester = supertest('http://localhost:8080');
    describe('/carts', () => {
        let cookie;
        let idProduct;
        let idCart;
        beforeEach(async function () {
            const connection = await mongoose.connect(process.env.MONGO_TEST_URL)
            await mongoose.connection.db.collection('carts').deleteMany({})
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

        it('Debe crear un carrito correctamente', async () => {
            const res = await requester.post('/api/carts').set('Cookie', `${cookie.name}=${cookie.value}`)
            idCart = res.body.id
            expect(res.body).to.be.an('object')
        })

        it('Debe traer un carrito por id', async () => {
            const res = await requester.get(`/api/carts/${idCart}`).set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(res.body).to.be.an('object')
        })

        it('No debe finalizar el proceso de compra con el carrito vacio', async () => {
            const res = await requester.post(`/api/carts/${idCart}/purchase`).set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(res.body.status).to.equal('error')
        })

    })

})