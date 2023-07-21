async function login(event){
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if(response.redirected){
        window.location.replace(response.url)
    }
    if(response.ok){
        return response.json()
    }
    // response.json().then(d => {
    //     const errorElement = document.createElement('p')
    //     errorElement.textContent = 'Email o contrasena incorrectos'
    //     const errorCamp = document.querySelector('.errorLogin');
    //     errorCamp.appendChild(errorElement)
    // })
}