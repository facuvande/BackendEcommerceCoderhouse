export default class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }

    async save(product) {
        try {
            const result = await this.dao.save(product);
            return result
        } catch (error) {
            throw error
        }
    }

    async getAll(query, data) {
        try {
            const result = await this.dao.getAll(query, data);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getWithId(pid){
        const result = await this.dao.getWithId(pid);
        return result;
    }

    async getWithCode(code){
        const result = await this.dao.getWithCode(code);
        return result
    }

    async editProduct(idProduct, newData){
        const result = await this.dao.editProduct(idProduct, newData);
        return result;
    }

    async deleteProduct(idProduct){
        const result = await this.dao.deleteProduct(idProduct);
        return result;
    }
}