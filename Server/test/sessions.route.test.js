import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'


dotenv.config()

describe('Sessions API Routes', () => {
    const requester = supertest('http://localhost:8080');

    describe('/sessions',() => {
        let cookie;
        let userTest
        beforeEach(async function () {
            const connection = await mongoose.connect(process.env.MONGO_TEST_URL)
        })

        it('Debe logearse correctamente al usuario', async () => {
            userTest = {
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

        it('Debe devolver el usuario logeado', async () => {
            const res = await requester.get('/api/sessions/current').set('Cookie', `${cookie.name}=${cookie.value}`)
            expect(res.body.user.email).to.equal(userTest.email)
        })
    })
})