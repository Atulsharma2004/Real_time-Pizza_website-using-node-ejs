// This is authentication for giving access to only logged users

function auth(req, res, next){
    if(req.isAuthenticated()){
        return next(); // continue down the middleware chain
    }
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login')
}

module.exports=auth;