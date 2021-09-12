// const { json } = require("express")

function cartController() {
    return {
      index(req,res) {
           res.render('customers/cart')
      },
      update(req,res) { //this update function used to update cart infromation
        //which is used inside web.js

       //check whether cart is empty or not
       //create a cart and add cart value to that
       if(!req.session.cart) {
         req.session.cart = {
           items : {},
           totalQty: 0,
           totalPrice: 0
         }
        
        }
        let cart = req.session.cart
         //check if items does not exist in cart
         //if items already simply increase its value
        if(!cart.items[req.body._id]) {
          cart.items[req.body._id] ={
            item: req.body,
            qty: 1
          }
          cart.totalQty = cart.totalQty + 1
          cart.totalPrice = cart.totalPrice + req.body.price
        }else{
          cart.items[req.body._id].qty = cart.items[req.body._id].qty +1 
          cart.totalQty = cart.totalQty+1
          cart.totalPrice = cart.totalPrice + req.body.price
        }
       

        return res.json({ totalQty:req.session.cart.totalQty })
      }
      
    }

}

module.exports = cartController
