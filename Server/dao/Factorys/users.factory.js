import config from '../../config.js';

class UsersFactory{
    static async getDao(){
        switch(config.persistence){
            case "MONGO":
                const {default: UsersService} = await import('../Services/users.service.js')
                return UsersService
                break;
            case "MEMORY":
                const {default: UsersMemoryService} = await import ('../Memory/users.service.js')
                return UsersMemoryService
                break;
            default: 
                throw new Error('Wrong Config')
        }
    }
}

export default UsersFactory