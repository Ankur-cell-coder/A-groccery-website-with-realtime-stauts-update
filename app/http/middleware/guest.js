//this file is mainly for that when we get login or register 
//then we does not have an option to go on login page or register page


//here guest is middleware so it accept req,res,next
function guest (req,res,next){
    if(!req.isAuthenticated()){
        return next()
    }
    return res.redirect('/')
}


module.exports = guest