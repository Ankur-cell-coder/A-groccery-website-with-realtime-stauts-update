//all auth related logic are placed here just like logic related to login
//register all are placed in this file

//factory function use here
function authController() {
    return {
      //here index is key and that function is value
      //this homecontroller get two value as req and response 
      //so we easily use it here
      login(req,res) {
           res.render('auth/login')
      },
      register(req,res) {
        res.render('auth/register')
      }
      
    }

}

//here we exporting homecontroller from web.js file
module.exports = authController