async function send(event){
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
            alert('usuario registrado')
        })

        setTimeout(() =>{
            window.location.href = "/login"
        }, 3000)
    }else{
        response.text().then((errorMessage) =>{
            console.log(errorMessage)
            if(errorMessage.includes('El email se encuentra registrado') || errorMessage.includes('E11000 duplicate key error collection') || errorMessage.includes('Error, usuario existente')){
                const errorElement = document.createElement('p')
                errorElement.style.color = 'red'
                errorElement.textContent = 'El email se encuentra registrado'
                const alreadySignedElement = document.querySelector('.errorRegister')
                alreadySignedElement.appendChild(errorElement)
            }
        });
    }
}