//this page is contains information which only login user can ascess
function auth(req,res,next) {
    if(req.isAuthenticated())
    {
       return next()
    }
    return res.redirect('/login')
}

module.exports = auth
//import in web.js
