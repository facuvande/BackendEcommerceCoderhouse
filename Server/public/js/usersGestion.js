const $tbody = document.getElementById('tbody');
const $fragment = document.createDocumentFragment()
const $article = document.getElementById('article')
const $form = document.getElementById('crud-form')

document.addEventListener('submit', async e=>{
    if(e.target === $form){
        e.preventDefault()

        if(!e.target.id.value){
            
            const form = document.getElementById('crud-form');
            const formData = new FormData(form);
            
            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    body: formData,
                })

                if(!response.ok) {
                    const p = document.getElementById('producto-id')
                    p.innerText = `Error ${response.status}: ${response.statusText}`
                }else{
                    const p = document.getElementById('producto-id')
                    p.innerText = `Producto agregado correctamente`
                    setTimeout(() =>{
                        p.innerText = ``
                        location.reload()
                    }, 2000)
                }
            } catch (error) {
                let message = error.statusText || 'Ocurrio un error';
                const p = document.getElementById('producto-id')
                p.insertAdjacentHTML("afterend", `<p><b>Error: ${message} intenta mas tarde</b></p>`)
            }
        }
    }
})

document.addEventListener('click', async e =>{
    if(e.target.matches('.delete')){
        const id = e.target.parentElement.parentElement.dataset.id
        let isDelete = confirm(`Estas seguro de eliminar el usuario con id ${id}?`)

        if(isDelete){
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE',
                    headers: {},
                })

                if(!response.ok){
                    const p = document.getElementById('producto-id')
                    p.innerText = `Ocurrio un error al eliminar el producto`
                }
                location.reload()
            } catch (error) {
                Toastify({
                    text: 'Ocurrio un error, vuelva a intentarlo mas tarde.',
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
    }

    if(e.target.matches('.change-role')){
        const id = e.target.parentElement.parentElement.dataset.id
        let isDelete = confirm(`Estas seguro que desea cambiar el rol al usuario con id ${id}?`)

        if(isDelete){
            try {
                const response = await fetch(`/api/users/premium/${id}`, {
                    method: 'POST',
                    headers: {},
                })

                if(!response.ok){
                    const p = document.getElementById('producto-id')
                    p.innerText = `Ocurrio un error al modificar el rol del usuario`
                }
                location.reload()
            } catch (error) {
                Toastify({
                    text: 'Ocurrio un error, vuelva a intentarlo mas tarde.',
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
    }
})

async function buscarUser(event){
    event.preventDefault()
    const $tbody = document.getElementById('tbodyUser')
    const $input = document.getElementById('emailBusqueda').value.toLowerCase()
    
    if($input === ''){
        return;
    }
    
    const response = await fetch(`/api/users/${$input}`, {
        method: 'GET',
        headers: {},
    })

    
    if(response.ok){
        const data = await response.json()
        $tbody.innerHTML = ``
        $tbody.innerHTML = `
            <tr data-id=${data._id}>
                <td data-label="Nombre">${data.firstName}</td>
                <td data-label="Apellido">${data.lastName}</td>
                <td data-label="Email">${data.email}</td>
                <td data-label="Edad">${data.age}</td>
                <td data-label="Rol">${data.role}</td>
                <td data-label="Ult. conexion">${data.last_connection}</td>
                <td data-label="Opciones">
                    <button class="change-role">Editar Rol</button>
                    <button class="delete">Eliminar</button>
                </td>
            </tr>
        `
    }else{
        $tbody.innerHTML = ``
        $tbody.innerHTML = `
            <tr>
                <td data-label="Nombre">No se encontro el usuario</td>
            </tr>
        `
    }
}

function limpiarHtml(){
    $tbody.innerHTML = ``
}