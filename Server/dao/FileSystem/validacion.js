const productKeys = ['title', 'description', 'code', 'price', 'stock', 'category', 'status'];

function validar(data, keys){
    const dataKeys = Object.keys(data);
    
    return(
        keys.every((key) => dataKeys.includes(key)) &&
        dataKeys.every((key) => keys.includes(key))
    )
}

function validarParcial(data, keys){
    const dataKeys = Object.keys(data);
    return(
        dataKeys.length <= keys.length &&
        dataKeys.every((key) => keys.includes(key))
    )
}

export function validarProducto(maybeProducto){
    return validar(maybeProducto, productKeys)
}

export function validarProductoParcial(maybeProductoParcial){
    return validarParcial(maybeProductoParcial, productKeys)
}