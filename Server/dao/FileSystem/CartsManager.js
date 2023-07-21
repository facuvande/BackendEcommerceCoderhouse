import fs from 'fs'
import ProductManager from './ProductManager.js';

export default class CartsManager {
    constructor(path) {
    this.path = path;
    this.products = this.readFile();
    }

    readFile() {
        try {
            const data = JSON.parse(fs.readFileSync(`./${this.path}`, "utf-8"));
            return data;
        } catch (error) {
            return []
        }
    }
    
    writeData(data) {
        let dataString = JSON.stringify(data);
        fs.writeFileSync(`./${this.path}`, dataString);
    }

    // Carrito
    async createCart() {  
        //Creo la variable utilizando this.readfile
        const carritosCargados = await this.getCarts();
        let id = 0;
        id = carritosCargados.length > 0 ? carritosCargados[carritosCargados.length - 1].id + 1 : 1;
        
        const nuevoCarrito = [...carritosCargados, {id: id, products: []}]
        const datosStr = JSON.stringify(nuevoCarrito)
        
        await fs.promises.writeFile(this.path, datosStr)
        return id
    }

    async getCarts(){
        try {
            const data = await fs.promises.readFile(this.path)
            return JSON.parse(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return []
        }
    }

    async getCartsById(id){
        const allCarts = await this.getCarts()
        try {
            const cartATraer = allCarts.find((c) => c.id === id);
            if(cartATraer == undefined){
                return
            }else{
                return cartATraer
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getCartProductsById(id){
        const selectCart = await this.getCartsById(id)
        try { 
            return selectCart.products
        } catch (error) {
            return
        }
        
    }

    async addProductToCart(productId, cartId){
        const allCarts = await this.getCarts()
        // Traemos el carrito con la id pasada
        const selectCart = await this.getCartsById(cartId);
        // Corroboramos que exista el producto
        const selectProduct = productManager.getProductsById(productId)
        if((selectProduct == undefined) || (selectCart == undefined)){
            return
        }
        const productExiste = selectCart.products.some(obj => obj.id === productId);
        let datos = {id: productId, quantity: 1}
        
        let objectToEdit = allCarts.find(obj => obj.id === cartId);

        if(productExiste){
            const productToEdit = objectToEdit.products.find(obj => obj.id === productId)
            productToEdit.quantity++
        }else{
            objectToEdit.products.push(datos);
        }

        
        let index = allCarts.findIndex(obj => obj.id === cartId);
        allCarts.splice(index, 1, objectToEdit);

        const datosStr = JSON.stringify(allCarts)
        await fs.promises.writeFile(this.path, datosStr)

        return productId
    }
}


const productManager = new ProductManager('./data/products.json')
