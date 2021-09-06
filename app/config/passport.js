//export local strategy which we install
const LocalStrategy = require('passport-local').Strategy

//this is for we check whether email exist in databse or not
const User = require('../models/user')

//this is for checking password correct or not
const bcrypt = require('bcrypt')


function init(passport) {
    //here we create an instance of localstrategy which is show as new passport
    //and pass two parameter first is an object :- which is our username
    //second parameter is function which is arrow function
    //in function all parameter recived which we type on login page
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

        //login 

        //check if email exists

        const user = await User.findOne({ email: email })

        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        //now match password with database
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in successfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })

    }))

    //when user get login then we need to store something data which show that
    //user is login at this moment or not
    //to do that we generally store username of user
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
  

}





//this is file that so this must be a module 
//that so we also need to export this
module.exports = init
