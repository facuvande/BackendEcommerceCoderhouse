import config from '../../config.js';

class CartsFactory{
    static async getDao(){
        switch(config.persistence){
            case "MONGO":
                const {default: CartService} = await import('../Services/carts.service.js')
                return CartService
                break;
            case "MEMORY":
                const {default: CartMemoryService} = await import ('../Memory/cart.service.js')
                return CartMemoryService
                break;
            default: 
                throw new Error('Wrong Config')
        }
    }
}

export default CartsFactory