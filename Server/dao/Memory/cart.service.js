class CartMemoryService{
    #carts = []

    async create(data){
        const CartCreated = { ...data, _id: this.#carts.length + 1 }
        this.#carts.push(CartCreated)
        return CartCreated._id
    }

    async getWithId(cid){
        const cart = this.#carts.find(cart => cart._id === cid)
        return cart
    }

    async addProductToCart(cid, product){
        try {
            const requestedCart = this.#carts.find(cart => cart._id === cid)
            if(requestedCart){
                const productExists = requestedCart.products.find(prod => prod.product._id === product._id)
                if(productExists){
                    productExists.quantity++
                }else{
                    requestedCart.products.push({ product, quantity: 1 })
                }
                return requestedCart
            }else{
                const newCart = { _id: cid, products: [{ product, quantity: 1 }] }
                this.#carts.push(newCart)
                return newCart
            }
        } catch (error) {
            throw error
        }
    }

    async deleteProductToCart(cid, pid){
        try {
            const requestedCart = this.#carts.find(cart => cart._id === cid)
            if(requestedCart){
                const productExists = requestedCart.products.find(prod => prod.product._id === pid)
                if(productExists){
                    if(productExists.quantity > 1){
                        productExists.quantity--
                    }else{
                        requestedCart.products = requestedCart.products.filter(prod => prod.product._id !== pid)
                    }
                }else{
                    throw new Error('El producto no existe')
                }
            }else{
                throw new Error('El carrito no existe')
            }
        } catch (error) {
            throw error
        }
    }

    async deleteAllProductToCart(cid){
        try {
            const requestedCart = this.#carts.find(cart => cart._id === cid)
            if(requestedCart){
                requestedCart.products = []
            }else{
                throw new Error('El carrito no existe')
            }
        } catch (error) {
            throw error
        }
    }

    async updateProductToCart(cid, products){
        try {
            const requestedCart = this.#carts.find(cart => cart._id === cid)
            if(requestedCart){
                requestedCart.products = products
            }else{
                throw new Error('El carrito no existe')
            }
        } catch (error) {
            throw error
        }
    }

}

export default CartMemoryService