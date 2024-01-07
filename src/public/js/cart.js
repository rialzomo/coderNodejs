const form = document.getElementById('addCartForm');
const cartId = document.getElementById('cartId');
const formCart = document.getElementById('goToCart');
form.addEventListener('submit', e=> {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    console.log("cartId: " + cartId)
    console.log("productId: " + data.productId)
    fetch('/api/carts/${cartId}/product/${data.productId}',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            console.log("voy a cargar el producto otra vez")
            //window.location.replace('/products')
        }
    })
})

formCart.addEventListener('submit', e=> {
    console.log("Estoy en go to cart")
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    console.log("cart: " + data.cartId)
    data.forEach((value, key)=> obj[key]=value);
    fetch('/api/carts/${cartId}',{
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result=> {
        console.log("pase por este lugar")
        console.log(result.status);
        if (result.status === 200) {
            window.location.replace('/cart')
        }
    })
})
