
//it is imported from node module folder
import axios from 'axios'

//import noty which is used to show message like item added to cart
import Noty from 'noty'

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