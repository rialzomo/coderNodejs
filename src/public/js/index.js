const socket = io();

socket.emit('product', {})

socket.on('product', data => {
let log = document.getElementById('productsRealTime');
   let products= "";
    data.forEach(product => {
        products = products + 
        '<p>Title: '+`${product.title} </p>`+
            '<p>Description: '+`${product.description} </p>`+
            '<p>Code: '+`${product.code} </p>`+
            '<p>Price: '+`${product.price} </p>`+
            '<p>Status: '+`${product.status} </p>`+
            '<p>Category: '+`${product.category} </p>`+
            '<p>Thumbnail: '+`${product.thumbnail} </p>`+
            '<p>Stock: '+`${product.stock} </p>`+
            '<p>Id: '+`${product._id} </p>`+
            '<br></br>';
    })
    log.innerHTML = products;
})