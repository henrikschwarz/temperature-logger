/* middleware for letting the templates check if the user is logged in. */
module.exports = (req, res, next) => {
    if (req.session.loggedIn){
        //res.locals.user = req.session.user;
        res.locals.authenticated = true;
    } else {
        res.locals.authenticated = false;
    }
    next();
}