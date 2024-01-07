const form = document.getElementById('logoutForm');
const formRol = document.getElementById('rolForm');
const formDelete = document.getElementById('deleteForm');

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

formDelete.addEventListener('submit', e=> {
    e.preventDefault();
    let idUser = formDelete.userId.value;
    let token = formDelete.token.value;
    const obj = {};
    console.log("idUser: " + idUser)
    console.log("token: " +token)
    fetch(`/api/users/${idUser}`,{
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            console.log("cambio exitoso")
            window.location.replace(`/api/users/${idUser}`)
        }
    })
})

formRol.addEventListener('submit', e=> {
    e.preventDefault();
    let idUser = formRol.userId.value;
    let token = formRol.token.value;
    console.log("idUser: " + idUser)
    console.log("token: " +token)
    fetch(`/api/users/premium/${idUser}`,{
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(result=> {
        console.log(result.status);
        if (result.status === 200) {
            console.log("cambio exitoso")
            window.location.replace(`/api/users/${idUser}`)
        }
    })
})