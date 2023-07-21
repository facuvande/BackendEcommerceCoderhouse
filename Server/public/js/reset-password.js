document.getElementById('send_reset_password').addEventListener('submit', async function(event){
    event.preventDefault()

    const $email = document.getElementById('email');
    const email = $email.value

    const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
            email
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if(response.redirected){
        window.location.replace(response.url)
    }
    if(response.ok){
        Swal.fire({
            icon: 'success',
            title: 'Se ha enviado un correo electronico',
            text: 'Hemos enviado un correo electronico para verificar que seas el usuario, porfavor ingresar al email y seguir las instrucciones antes de 1 hora.'
        })

        setTimeout(() => {
            window.location.href = '/login'
        }, 4000)
    }else{
        const responseData = await response.json()
        const errorElement = document.createElement('p')
                errorElement.style.color = 'red'
                errorElement.textContent = responseData.error
                const alreadySignedElement = document.querySelector('.errorRegister')
                alreadySignedElement.appendChild(errorElement)
    }
})