async function deleteProduct(event){
    const cartItemElement = event.target.closest('.cart-item')

    const productId = cartItemElement.dataset.id;

    const response = await fetch(`/api/carts/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if(response.ok){
        Toastify({
            text: "Producto eliminado correctamente",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
        setTimeout(() => {
            window.location.reload();
        }, 2000)
    }else{
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

async function clearAllItems() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    try {
        const result = await swalWithBootstrapButtons.fire({
            title: 'Esta seguro que desea eliminar el carrito?',
            text: "Luego de presionar aceptar no se puede volver atras!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        });
    
        if (result.isConfirmed) {
            const response = await fetch(`/api/carts/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
            });
    
            if (response.ok) {
            window.location.reload();
            } else {
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu carrito esta a salvo :)',
            'error'
            );
        }
        } catch (error) {
            console.log(error);
        }
}

async function purchase(event){
    try {
        if(!document.querySelector('.cart-item')){
            throw new Error('No hay productos en el carrito');
        }

        window.location.href = '/api/carts/purchase'
    } catch (error) {
        Toastify({
            text: 'Ocurrio un error, revise los items del carrito y vuelva a intentarlo mas tarde.',
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