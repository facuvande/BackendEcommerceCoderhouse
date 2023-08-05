async function register(event){
    event.preventDefault();

    const nombre = document.getElementById('form-firstName').value;
    const apellido = document.getElementById('form-lastName').value;
    const email = document.getElementById('form-email').value;
    const edad = document.getElementById('form-age').value;
    const password = document.getElementById('form-password').value;  

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            firstName: nombre,
            lastName: apellido,
            email,
            age: edad,
            password
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if(response.ok){
        response.json().then((d) =>{
            Toastify({
                text: "Usuario registrado correctamente",
                duration: 3000,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();
        })

        setTimeout(() =>{
            window.location.href = "/login"
        }, 3000)
    }else{
        response.text().then((errorMessage) =>{
            const message = JSON.parse(errorMessage)
            if(errorMessage.includes('El email se encuentra registrado') || errorMessage.includes('E11000 duplicate key error collection') || errorMessage.includes('Error, usuario existente')){
                const errorElement = document.createElement('p')
                errorElement.style.color = 'red'
                errorElement.textContent = 'El email se encuentra registrado'
                const alreadySignedElement = document.querySelector('.errorRegister')
                alreadySignedElement.innerHTML = ''
                alreadySignedElement.appendChild(errorElement)
            }else{
                const errorElement = document.createElement('p')
                errorElement.style.color = 'red'
                errorElement.textContent = message.error
                const alreadySignedElement = document.querySelector('.errorRegister')
                alreadySignedElement.innerHTML = ''
                alreadySignedElement.appendChild(errorElement)
            }
        });
    }
}
