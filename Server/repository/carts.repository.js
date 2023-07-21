export default class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    async create(){
        const result = await this.dao.create()
        return result
    }

    async getWithId(cid){
        const result = await this.dao.getWithId(cid);
        return result;
    }

    async addProductToCart(cid, product){
        const result = await this.dao.addProductToCart(cid, product);
        return result;
    }

    async deleteProductToCart(cid, pid){
        const result = await this.dao.deleteProductToCart(cid, pid);
        return result
    }

    async deleteAllProductToCart(cid){
        const result = await this.dao.deleteAllProductToCart(cid);
        return result
    }

    async updateProductToCart(id, products){
        const result = await this.dao.updateProductToCart(id, products);
        return result
    }
}