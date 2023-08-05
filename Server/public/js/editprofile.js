const saveButton = document.getElementById('saveChangesButton');
saveButton.addEventListener('click', updateUserInfo);

async function updateUserInfo(event){
    event.preventDefault();

    const form = document.getElementById('perfilForm');
    const formData = new FormData(form);
    const response = await fetch('/api/users/updateProfile', {
        method: 'POST',
        body: formData
    })

    if(response.ok){
        Toastify({
            text: "Perfil actualizado correctamente",
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
        }, 3000)
    }else{
        Toastify({
            text: "Ocurrio un error al actualizar el perfil",
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