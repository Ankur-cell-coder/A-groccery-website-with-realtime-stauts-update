//all auth related logic are placed here just like logic related to login
//register all are placed in this file

//importing user registration data from user.js
const User = require('../../models/user')

//import bcrypt which help to change normal password to hsh password
const bcrypt = require('bcrypt')
const passport = require('passport')

//factory function use here
function authController() {
const _getRedirectUrl = (req) => {
  return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
}

  return {
    //here index is key and that function is value
    //this homecontroller get two value as req and response 
    //so we easily use it here
    login(req, res) {
      res.render('auth/login')
    },
    postLogin(req, res, next) {
    
      const { email, password } = req.body //it get all information from body
      //validate request
      if (!email || !password) {
        req.flash('error', 'All fields are required!')
        return res.redirect('/login')
      }

      passport.authenticate('local', (err, user, info) => {//done function is defined call in passport.js
        //err and user and info all three received from passport.js
        //here in info we get those message which we receive from passport.js file
        if (err) {
          req.flash('error', info.message)
          return next(err)
        }
        //if not user with that email
        if (!user) {
          req.flash('error', info.message)
          return res.redirect('/login')

        }
        req.login(user, (err) => {
          if (err) {
            req.flash('error', info.message)
            return next(err)
          }
          //if everythings okey then reirect to their respective page
          return res.redirect(_getRedirectUrl(req))

        })
        })(req,res,next)//this function is called because passport.authentication return a function
    
    },
    register(req, res) {
      res.render('auth/register')
    },
    async postRegister(req, res) { //we make this function asynchronous because we use await inside this
      //it contains all code how data got stored
      const { name, email, password } = req.body //it get all information from body
      //validate request
      if (!name || !email || !password) {
        req.flash('error', 'All fields are mandatory!')
        req.flash('name', name)
        req.flash('email', email)//these are for this that after getting an error all data not get automatically deleted
        return res.redirect('/register')
      }

      ///check if email exist
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash('error', 'Email already exist')
          req.flash('name', name)
          return res.redirect('/register')
        }
      })

      //Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      //create a user
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword
      })

      user.save().then((user) => {
        //login
        return res.redirect('/')
      }).catch(err => {
        req.flash('error', 'Something went wrong')
        return res.redirect('/register')
      })
    },
    logout(req,res){
      req.logout()
      return res.redirect('/login')//after logout redirected to login page
    }

  }

}

//here we exporting homecontroller from web.js file
module.exports = authController