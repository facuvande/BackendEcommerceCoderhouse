import config from '../../config.js';

class ProductsFactory{
    static async getDao(){
        switch(config.persistence){
            case "MONGO":
                const {default: ProductService} = await import('../Services/products.service.js')
                return ProductService
                break;
            case "MEMORY":
                const {default: ProductMemoryService} = await import ('../Memory/product.service.js')
                return ProductMemoryService
                break;
            default: 
                throw new Error('Wrong Config')
        }
    }
}

export default ProductsFactory