//importing data from database we create a models
const Menu = require('../../models/menu')

//factory function use here
function homeController() {
    return {
      //here index is key and that function is value
      //this homecontroller get two value as req and response 
      //so we easily use it here
      //this method is call whenever we go to our home page
      async index(req,res) {


        //if we need every data from database we call find method
        //inside then we pass a function which get all data
        //whenever it get executed
          //  Menu.find().then(function(pizzas){
          //   console.log(pizzas)
          //   return res.render('home',{ pizzas:pizzas})
          //     })
            //in frontend we recive first pizzas which contains 
            //information of every pizzas which pass inside function
         

           //another method to fetch all data information is async await
           //whenever we use await at that time function should be asynchoronous
           //that so we make this function async
           const pizzas = await Menu.find()
           return res.render('home',{ pizzas:pizzas})
         
      },
      async search(req,res) {
        console.log(req.body.item_name);
         
         if(req.body.item_name){
         var pizzas = await Menu.find({name:req.body.item_name})
         }
         else
         {
          var pizzas= await Menu.find();
         }
      
       return res.render('home',{ pizzas:pizzas});
      }
      
    }

}

//here we exporting homecontroller from web.js file
module.exports = homeController
