const form = document.getElementById('logoutForm');
const formCart = document.getElementById('goToCart');
const formAddCart = document.getElementById('addCartForm');
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

formCart.addEventListener('submit', e=> { 
    console.log("Estoy en go to cart")
    e.preventDefault();
    let dato = formCart.cartId.value;
    //let dato = formCart.cartId.value;
    if(dato != null && dato != undefined ){
        window.location.replace(`/carts/${dato}`);
    }
        
})

formAddCart.addEventListener('submit', e=> {
    e.preventDefault();
    let cartId = formCart.cartId.value;
    let productId = formAddCart.productId.value;
    let token = formCart.token.value;
    const obj = {};
    console.log("cartId: " + cartId)
    console.log("productId: " +productId)
    console.log("token: " +token)
    fetch(`/api/carts/${cartId}/product/${productId}`,{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            console.log("voy a cargar el producto otra vez")
            window.location.replace('/products')
        }
    })
})