import nodemailer from 'nodemailer';

export default class MailManager {
    constructor() {
    }
    

    sendMailProduct = async (email, idProduct) => {
        let mensaje = `<div>
        <h1>El producto con id: ${idProduct} fue eliminado</h1></div>`;
        //let mensaje = "<div><h1>El producto con id: " + idProduct + "fue eliminado</h1></div>";
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'ri.zorry@gmail.com',
                pass: 'ldej tbiv bruc uojz'
            }
        })

        const result = await transport.sendMail({
            from: 'ri.zorry@gmail.com',
            to: email,
            subject: 'Aviso Importante - Eliminacion de Producto',
            html: mensaje,
            
        })
    }

    sendMailCompra = async (email, ticket) => {
        
        let mensaje = `<div>
        <h1>Gracias por su compra</h1>
        <h2>Ticket:</h2>
    <div>
            <p>Codigo: ${ticket.code}</p>
            <p>Monto: ${ticket.amount}</p>
            <p>tiempo: ${ticket.purchase_datetime}</p>
            <p>email: ${ticket.purchase}</p>
    </div>`;
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: 'ri.zorry@gmail.com',
                pass: 'ldej tbiv bruc uojz'
            }
        })

        const result = await transport.sendMail({
            from: 'ri.zorry@gmail.com',
            to: email,
            subject: 'Aviso de Compra Realizada',
            html: mensaje,
            
        })
    }
}