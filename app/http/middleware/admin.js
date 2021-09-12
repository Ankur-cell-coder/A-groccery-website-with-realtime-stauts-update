//this middleware is for that only admin can ascess page which use this middleware
function admin (req,res,next) {
   // console.log(req.user.role)
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }
    

    return res.redirect('/')
}

module.exports = admin