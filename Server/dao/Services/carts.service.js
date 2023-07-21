import cartsModel from "../models/carts.model.js";

class CartService{
    #model
    constructor(){
        this.#model = cartsModel;
    }

    async create(entity){
        const {_id} = await this.#model.create(entity)
        return _id
    }
    
    async getWithId(cid){
        const ent = await this.#model.findOne({_id: cid}).populate('products.product')
        return ent
    }

    async addProductToCart(cid, product){
        try {
            const { _id } = product

            const requestedCart = await this.#model.findOne({
                _id: cid,
                products: {
                    $elemMatch: {
                        product: _id
                    }
                }
            })

            if(requestedCart){
                const updatedProduct = await this.#model.findOneAndUpdate(
                    { _id: cid , 'products.product': _id},
                    { $inc: { 'products.$.quantity': 1}},
                    { new: true }
                ).lean()
                
                return updatedProduct
            }else{
                const newProduct = { product: _id, quantity: 1 }

                const addToCart = await this.#model.findOneAndUpdate(
                    {_id: cid}, 
                    {$push: { products: newProduct }},
                    {new: true, upsert: true}    
                )
                return addToCart
            }
        } catch (error) {
            throw error
        }
    }


    async deleteProductToCart(cid, pid){
        try {
            const cart = await this.#model.findOne({ _id: cid });
            if (!cart) {
                throw new Error('El carrito no existe');
            }
            const updatedProducts = cart.products.filter(product => !product.product.equals(pid));
            if (updatedProducts.length === cart.products.length) {
                throw new Error('El producto no existe en el carrito');
            }

            const updatedCart = await this.#model.findOneAndUpdate(
            { _id: cid },
            { products: updatedProducts },
            { new: true }
            );

            if (!updatedCart) {
            throw new Error('No se pudo actualizar el carrito');
            }

            return updatedCart;
        } catch (error) {
            throw error
        }
    }

    async deleteAllProductToCart(cid){
        try {
            const deleteAll = await this.#model.updateOne(
                { _id: cid },
                { $set: { products: [] }},
            )

            return deleteAll
        } catch (error) {
            throw error
        }
    }

    async updateProductToCart(id, products){
        try {
            // Primero , busco el carrito 
            const cart = await this.#model.findOne({_id: id});
            // Verifico que exista el carrito

            if(!cart){
                throw new Error('El carrito no existe')
            }

            const updateResult = await this.#model.updateOne(
                {_id: id},
                { products: products }
            );

            // Verifico que la actualizacion sea exitosa
            if(updateResult.nModified === 0){
                throw new Error('No se pudo actualizar el carrito')
            };
            
            // Finalmente , busco el carrito actualizado usando findOne
            const updatedCart = await this.#model.findOne({ _id: id });

            return updatedCart
        } catch (error) {
            throw error
        }
    }
}

export default CartService