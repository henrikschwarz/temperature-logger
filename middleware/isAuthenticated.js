module.exports = (req, res, next) => {
    if (!req.session.loggedIn){
        res.redirect('/401')
        return;
    }
    next()
}