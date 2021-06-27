module.exports = (req, res, next) => {
    if (!global.loggedIn){
        res.redirect('/401')
        return;
    }
    next()
}