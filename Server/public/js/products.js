const query = new URLSearchParams(window.location.search)

const categorySelect = document.getElementById('category-select')
const availableSwitch = document.getElementById('available-switch');
const sortSelect = document.getElementById('category-price');

function setPrev(){
    const previusPage = Number(query.get('page')) - 1
    query.set('page', previusPage)
    window.location.search = query.toString()
}

function setNext(){
    const NextPage = Number(query.get('page')) + 1
    query.set('page', NextPage)
    window.location.search = query.toString()
}

function setPage(page){
    query.set('page', page)
    window.location.search = query.toString()
}

function setCategory(cat){
    if(!cat){
        query.delete('category')
        
    }else{
        query.set('category', cat)  
    }
    window.location.search = query.toString()
}

function setPrice(price){
    if(!price){
        query.delete('sort')
    }else{
        if(price && (price == 'asc' || price == 'desc')){
            query.set('sort', price)
        }
    }
    window.location.search = query.toString()

}

function setStatus(status){
    if(!status){
        query.delete('status')
    }else{
        query.set('status', true)
    }
    window.location.search = query.toString()
}

document.addEventListener('click', e =>{
    if(e.target.matches('.verDetalles')){
        const id = e.target.parentElement.parentElement.parentElement.dataset.id
        const redirectUrl = `products/${id}`
        window.location.href = redirectUrl
    }

    if(e.target.matches('.addToCart')){
        const productId = (e.target.parentElement.parentElement.parentElement.dataset.id)
        saveProduct(productId)
    }
})

async function saveProduct(pid){
    const response = await fetch(`/api/carts/product/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(response.ok){
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }else{
        const responseData = await response.json();
        Toastify({
            text: 'Ocurrio un error, porfavor intentarlo mas tarde',
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #D71313, #B31312)",
            },
        }).showToast();
    }

}

document.addEventListener('DOMContentLoaded', function(e){
    const query = new URLSearchParams(window.location.search);
    const page = Number(query.get('page'));

    if(page < 1){
        const activePage = document.querySelector(`#page-1`);
        activePage.classList.add('active');
    }else{
        const activePage = document.querySelector(`#page-${page}`);
        activePage.classList.add('active');
    }
})