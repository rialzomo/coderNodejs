export const generateDeleteProductErrorInfo = (pid) => {
    return `Se envio un parametro invalido,
    Se necesita un id de producto se recibio  ${pid}`
}

export const generatePIDCIDtErrorInfo = (pid, cid) => {
    return `Se envio un parametro invalido,
    Se necesita un id de producto y un id de carrito se recibio  ${pid} y ${cid}`
}

export const generateDeleteCartErrorInfo = (uid) => {
    return `Se envio un id invalido para eliminar el carrito,
    Se necesita un id existente, se recibido ${uid}`
}

export const generateUpdateCartErrorInfo = (uid) => {
    return `Se envio un id invalido para eliminar el carrito,
    Se necesita un id existente, se recibido ${uid}`
}

export const generateAddProductErrorInfo = () => {
    return `Ocurrio un error al guardar el producto`
}