import cron from 'node-cron'
import UsersFactory from '../dao/Factorys/users.factory.js';
import UserRepository from '../repository/user.repository.js';


const Users = await UsersFactory.getDao()
const usersService = new UserRepository(new Users)


export default function initCron(){
    const task = cron.schedule('0 0 */2 * *', async() => {
        // console.log('Ejecutando tarea cada 2 dias')
        await usersService.deleteInactiveUsers();
    })

    task.start();
}

