import dotenv from 'dotenv'
import { Command } from 'commander'
dotenv.config()

// Configuracion de Commander
const program = new Command()

program
.description('Permite cambiar de persistencia entre MONGO o MEMORY')
.option('-p, --persistence <type>', 'Persistence type: MONGO o MEMORY')
.action((str, options) =>{
    if(str.persistence){
        process.env.PERSISTENCE = str.persistence
    }
})
program.parse()


const config = {
    persistence: process.env.PERSISTENCE,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    mongo_test_url: process.env.MONGO_TEST_URL,
    cookie_secret: process.env.COOKIE_SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
    jwt_token: process.env.JWT_TOKEN,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    mail: {
        host: process.env.MAIL_HOST ?? 'smtp.ethereal.email',
        port: process.env.MAIL_PORT ?? 587,
        auth: {
            user: process.env.MAIL_USER ?? 'madisen26@ethereal.email',
            pass: process.env.MAIL_PASS ?? 'wXJurRPReuJ5x5eCNf'
        }
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    }
}


export default config