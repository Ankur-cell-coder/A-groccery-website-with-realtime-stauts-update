// we have to import env
require('dotenv').config()//by help of this we can ascess all variable inside env file
const express = require('express')

const app = express()

//in this fie everywhere we call app.()
//this app is an instance of express

const ejs = require('ejs')
const path = require('path')

//this session store all our cart information
const session = require('express-session')
//express-flash to store session in database
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3000

//connect mongse with server
const mongoose = require('mongoose')

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



//express-flash use as a middleware
app.use(flash())

//Assets
app.use(express.static('public'))

app.use(express.json())

//global middleware
app.use((req,res,next) => {
    res.locals.session = req.session
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



app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})
