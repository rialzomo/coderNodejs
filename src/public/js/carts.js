const form = document.getElementById('logoutForm');
const formVolver = document.getElementById('volverComprar');
const formComprar = document.getElementById('comprar');


form.addEventListener('submit', e=> {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key)=> obj[key]=value);
    fetch('/api/sessions/logout',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            window.location.replace('/login')
        }
    })
})

formComprar.addEventListener('submit', e=> {
    console.log("estoy en la compra")
    e.preventDefault();
    let cartId = formComprar.cartId.value;
    console.log("cartId: " + cartId)
    let token = formComprar.token.value;
    const obj = {};
    
    console.log("token: " +token)
    fetch(`/api/carts/${cartId}/purcharse`,{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            window.location.replace('/compra')
        }
    })

    
})

formVolver.addEventListener('submit', e=> {
    e.preventDefault();
    window.location.replace('/products')
    
})

