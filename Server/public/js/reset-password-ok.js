const passwordInput = document.getElementById('password');
const repeatPasswordInput = document.getElementById('password-repeat');
const submitButton = document.querySelector('button[type="submit"]');
const errorContainer = document.querySelector('.errorRegister');
const form = document.getElementById('send_reset_password');

function handlePasswordChange() {
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    if (password === repeatPassword) {
        submitButton.disabled = false;
        errorContainer.textContent = ''; // Limpiar mensaje de error
    } else {
        submitButton.disabled = true;
        errorContainer.textContent = 'Las contraseñas no coinciden'; // Mostrar mensaje de error
    }
}

async function handleSubmit(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const password = passwordInput.value;
    const currentUrl = window.location.href
    const parsedUrl = new URL(currentUrl)

    const pathname = parsedUrl.pathname
    const token = pathname.slice(pathname.lastIndexOf('/') + 1)


    const response = await fetch(`/api/auth/reset-password-ok/${token}`, {
        method: 'POST',
        body: JSON.stringify({
            password
        }),
        headers: {
        'Content-Type': 'application/json',
        }
    })
    if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'El password ha sido cambiado con exito',
            html: `<a href="/login">Click aqui para ingresar</a>`
        })

        setTimeout(() => {
            window.location.href = '/login'
        }, 4000)
    } else {
        // Solicitud no exitosa
        const responseData = await response.json()
        const errorElement = document.createElement('p')
                errorElement.style.color = 'red'
                errorElement.textContent = responseData.error
                const alreadySignedElement = document.querySelector('.errorRegister')
                alreadySignedElement.appendChild(errorElement)
    }
}
passwordInput.addEventListener('input', handlePasswordChange);
repeatPasswordInput.addEventListener('input', handlePasswordChange);
form.addEventListener('submit', handleSubmit);
