// we have to import env
require('dotenv').config()//by help of this we can ascess all variable inside env file
const express = require('express')

const app = express()

//in this fie everywhere we call app.()
//this app is an instance of express

const ejs = require('ejs')
const path = require('path')

const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')

//this session store all our cart information
const session = require('express-session')
//express-flash to store session in database
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

//importing passport which use for login
const passport = require('passport')

//event emitter
const Emitter = require('events')

//databse connection
//everytime same code if used for databse connection

const url = 'mongodb://localhost/realtime';//here realtime is name of databse

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {   //event listner type
    console.log('Database connected...');
}).catch(err => {//if database not connected and it catch some error
    console.log('Connection failed...')
});

//Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'//in which table value should be stored
})

//event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)//here we bind this eventemitter
                                //with app now we can use it anywhere


//configuration for session
//this session libaray work as a middleware
//whole are explain in notes
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } //life of cookies 24 hours
}))



//passport config
const passportInit = require('./app/config/passport')
passportInit(passport) //from here we pass passport which we install using npm to passport.js


app.use(passport.initialize())
app.use(passport.session())//passport work by using session method





//express-flash use as a middleware
app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user//this is for if user login then not show login option
    next() //if we doesnt call next then it never pass to next and always executed
})

//set Template engine
app.use(expressLayout)

app.set('views', path.join(__dirname, '/resources/views'))

app.set('view engine', 'ejs')

//import here
//this is a function because from there we export
//a function so we can easily call this
//whenever a function call it get executed
//and operation related to that start their performance
require('./routes/web')(app)



//this is our server and we pass this server to socket.io
const server = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})


//socket

//import socket.io
// require('socket')  :- this is a function to call this function we pass server
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    //join
    //now we recive data which we emit from client or app.js
    socket.on('join',(orderId) => {
       socket.join(orderId)
    })

})

//listing on eventemitter on orderget updated

eventEmitter.on('orderUpdated',(data) => {
    //inside to pass complete id of that private house
    io.to(`order_${data.id}`).emit('orderUpdated', data)
    //and now we have to lisent this event on client
})

//listing new order
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced',data)
})