import productsModel from "../models/products.model.js";

class ProductService{
    #model
    constructor(){
        this.#model = productsModel;
    }
    
    async save(product){
        return this.#model.create(product);
    }

    async get(){
        return this.#model.find()
    }

    async getAll(query, data){
        return this.#model.paginate(query, {
            page: data.page,
            limit: Number(data.limit),
            sort: data.sort,
            lean: data.lean,
        });
    }
    
    async getWithId(pid){
        return this.#model.findOne({_id: pid})
    }

    async getWithCode(code){
        return this.#model.findOne({code: code});
    }

    async editProduct(id, newData){
        return this.#model.updateOne({_id: id}, newData)
    }

    async deleteProduct(id){
        const product = await this.#model.findOneAndDelete({_id: id});
        return id
    }

    async updateStock(id, newStock){
        const product = await this.#model.findOneAndUpdate({_id: id}, {stock: newStock}, {new: true});
        if(newStock > 0){
            await this.#model.findOneAndUpdate({_id: id}, {status: true}, {new: true});
        }
        return product
    }

    async changeStatusToFalse(id){
        const change = await this.#model.findOneAndUpdate({_id: id}, {status: false}, {new: true});
        return change
    }
}

export default ProductService