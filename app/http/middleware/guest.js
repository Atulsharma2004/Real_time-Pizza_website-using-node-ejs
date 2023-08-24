function guest(req, res, next){
    if (!req.isAuthenticated()){
        return next()
        }
        else {
            return res.redirect('/'); // redirect to homepage
            }
}

module.exports= guest;