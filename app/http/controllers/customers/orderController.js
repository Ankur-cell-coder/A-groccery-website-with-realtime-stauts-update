//import order.js
const Order = require('../../../models/order')

//this is for formatting date and time 
const moment = require('moment')

function orderController () {
    return {
        store(req,res) {
          //validate request

         const{ phone, address } = req.body

         if(!phone || !address) {
             req.flash('error','All fields are required')
             return res.redirect('/cart')
         }

         const order = new Order({
             customerId: req.user._id,
             items: req.session.cart.items,
             phone,
             address
         })
     order.save().then(result => {
        req.flash('success','Order placed successfully')
        delete req.session.cart //delete cart after placing orders
        return res.redirect('/customer/orders')
     }).catch(err =>{
         req.flash('error', 'Something went wrong')
         return res.redirect('/cart')
     })
        },
       async index(req,res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                {sort: {'createdAt': -1}}) //find all orders related to that customer
            //send these data to frontend

           res.header('Cache-Control','no-cache,private,no-store, must-revalidate,max-stale=0, post-check=0, pre-check=0')
            
            res.render('customers/orders',{ orders: orders, moment: moment })
           
        }
    }
}

//from here exporting
module.exports = orderController
//importing inside routes