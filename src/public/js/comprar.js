const form = document.getElementById('logoutForm');
const formVolver = document.getElementById('volver');

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


formVolver.addEventListener('submit', e=> { 
    e.preventDefault();
    window.location.replace('/products')
})
