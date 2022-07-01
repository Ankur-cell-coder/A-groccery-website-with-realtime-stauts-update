
//it is imported from node module folder
import axios from 'axios'
//import noty which is used to show message like item added to cart
import Noty from 'noty'

//import admin.js which help in auto refresh of page
import { initAdmin  } from './admin'

import moment from 'moment'

//this leads to select every buttons from home page and we can easily 
//apply event listner on these buttons
let addToCart = document.querySelectorAll('.add-to-cart')
//here addToCart variable is of type array that so we can loop here


//here we get value to show how many items are in cart on nav bar image of cart
let cartCounter = document.querySelector('#cartCounter')

//make a function updatecart
function updateCart(pizza) {
    //we have to sent request over server 
    //we have to call ajax use library axios 
    axios.post('/update-cart',pizza).then(res => {
        //send response to show total no of items in cart
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',//this leads to green color
            timeout: 1000,
            text: "Item added to cart",
            progressBar: false,
          }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progessBar: false,
        }).show();
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) =>{
        //convert into object beacuse we receive json string from home.ejs
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
     
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout( () => {
        alertMsg.remove()
    },2000)
}





//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
// console.log(order)
order = JSON.parse(order)
let time = document.createElement('small')


function updateStatus(order) {  //here we receive those order which we get from single order page
    statuses.forEach( (status) => {  //whenever status get updated previous all removed and new setup apply
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    //here we run a loop on every status and get their status from single oreder.ejs and update according to them
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);

//socket client site work here
let socket = io()


//join
if(order){
socket.emit('join',`order_${order._id}`)
}

//check whether page is in adminmode or user

let adminAreaPath = window.location.pathname
//console.log(adminAreaPath)
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

//listing event from server.js i.e: - order updated
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order } //copying order into updatedoreder
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder) //this update status function update status
    new Noty({
        type: 'success',//this leads to green color
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
      }).show();
})



