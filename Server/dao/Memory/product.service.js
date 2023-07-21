class ProductMemoryService{
    #products;

    constructor(){
        this.#products = [];
    }

    async save(data){
        try {
            const product = { ...data, _id: this.#products.length + 1 }
            this.#products.push(product)
            return product._id
        } catch (error) {
            throw error       
        }
    }

    async get(){
        return this.#products
    }

    async getAll(query, data){
        try {
            let results = this.#products;
            for (let [key, value] of Object.entries(query)) {
            results = results.filter((product) => product[key] === value);
            }
            if (data.sort) {
            const order = data.order === 'desc' ? -1 : 1;
            results.sort((a, b) => {
                if (a[data.sort] < b[data.sort]) {
                return -1 * order;
                } else if (a[data.sort] > b[data.sort]) {
                return 1 * order;
                } else {
                return 0;
                }
            });
            }
        } catch (error) {
            throw error
        }
    }

    async getWithId(pid){
        try {
            const product = this.#products.find(product => product._id === pid)
            return product
        } catch (error) {
            throw error
        }
    }

    async getWithCode(code){
        try {
            const product = this.#products.find(product => product.code === code)
            return product
        } catch (error) {
            throw error            
        }
    }

    async editProduct(id, newData){
        try {
            const product = this.#products.find(product => product._id === id)
            if(product){
                const index = this.#products.indexOf(product)
                this.#products[index] = { ...product, ...newData }
                return this.#products[index]
            }else{
                throw new Error('El producto no existe')
            }
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id){
        try {
            const productsFiltered = this.#products.filter(product => product._id !== id)
            return productsFiltered
        } catch (error) {
            throw error
        }
    }
}

export default ProductMemoryService