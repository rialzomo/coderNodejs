 import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
//import productsRouter from './routes/products.js'
//import cartsRouter from './routes/carts.js'
import __dirname from './utils.js'
//import viewsRoute from './routes/views.js'
import mongoose from "mongoose";
import ProductsManager from "./dao/managers/ProductsManager.js";
import Messagesanager from "./dao/managers/MessagesManager.js";
import sessionsRouter from './routes/sessions.js'
import passport from 'passport';
import config from "./config.js";
import ProductsRouter from "./routes/products.js";
import UsersRouter from "./routes/users.js";
import CartsRouter from "./routes/carts.js";
import ViewsRouter from "./routes/views.js";
import mocksRouter from './routes/mocks.js';
import loggerRouter from './routes/logger.js';
import errorHandler from './handler/ErrorsHandler.js'
import { initializePassport } from './config/passport.js';
import { Server } from "socket.io";
import { addLogger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

const productsManager= new ProductsManager();
const messagesManager= new Messagesanager();
const productsRouter  = new ProductsRouter()
const usersRouter  = new UsersRouter()
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();

const app = express();
const connection = mongoose.connect('mongodb+srv://nodejsBack:Rialzomo06.@clusternodejsback.nhvefdy.mongodb.net/ecommerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion',
            description: 'API Swagger para Coder'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerJSDoc(swaggerOptions)))
app.use(express.static(__dirname+'/public'));
app.use(addLogger);
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

//const connection = mongoose.connect('mongodb+srv://nodejsBack:Rialzomo06.@clusternodejsback.nhvefdy.mongodb.net/ecommerce')
let io = null;

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.json());
app.use(express.static(__dirname + '/public'));
//app.use('/views', viewsRoute);

app.use('/api/products', productsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/logger', loggerRouter);
console.log(config.mongoUrl);
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        //mongoUrl: 'mongodb+srv://nodejsBack:Rialzomo06.@clusternodejsback.nhvefdy.mongodb.net/ecommerce',
        ttl: 3600
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter.getRouter());
app.use('/api/sessions', sessionsRouter);
app.use('/mocks', mocksRouter);
app.use(errorHandler);

const server = app.listen(config.port, ()=> {
    //const server = app.listen(8080, ()=> {
    console.log('Server ON')
});

io = new Server(server);
console.log('io original:'+ io);
io.on('connection', socket => {
    console.log('Socket ON');
    
    socket.on('product', async data => {
        let products = await productsManager.getAll();
        io.emit('product', products);
    })
    socket.on('message', async data => {
        await messagesManager.save(data);
        let menssages = await messagesManager.getAll();
        io.emit('messageLogs', menssages);
    })

    socket.on('authenticated', async data=> {
        let menssages = await messagesManager.getAll();
        io.emit('messageLogs', menssages);
    })
    
})

app.locals.socketio = io;

