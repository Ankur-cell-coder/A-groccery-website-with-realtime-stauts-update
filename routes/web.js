// create a function named any just like initroutes here 
// and place all routes inside this function

//this app is not define in this web.js
//every file is a module in node project
//this function can receive any parameters 
//so we pass app as a parameters to this function

const homeController = require('../app/http/controllers/homeController')
//here we exporting 
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')

const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

//middleware
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


function initRoutes(app) {//now we can call app.()
    // app.get('/', (req, res) => {
    //     res.render('home')
    // })

    //whenever a function call its parameter get initialized
    // in get method we got a request and response which is initialized
    //with homecontroller here and imported in homecontroller
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/cart', cartController().index)//bd m isko change karenge cart se index ko
    app.post('/update-cart', cartController().update)//this update function is declare in controller.js
    app.post('/',homeController().search)
    //customer routes
    //in below function auth is used because these are only ascessed by login user
    app.post('/orders',auth, orderController().store)
    app.get('/customer/orders',auth,orderController().index)
    app.get('/customer/orders/:id',auth,orderController().show)//here :id denotes this is dynamic
    
   
     //Admin routes
    app.get('/admin/orders',admin,adminOrderController().index)

    //order status routes
    app.post('/admin/order/status',admin,statusController().update)


    
}

//from here we export this function
//and import it to server.js
//it's a function so in server.js we receive a function
module.exports = initRoutes