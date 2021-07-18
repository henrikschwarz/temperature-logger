var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render('login', {title: "Login"});
})

router.post('/login', function(req, res) {
  if (req.body["username"] === process.env.ADMIN_USERNAME &&
    req.body["password"] === process.env.ADMIN_PASSWORD){
      global.loggedIn = true;
      res.redirect('/');
    }
  else {
    res.render("/login", {title: "Login", error: "Wrong password or username."})
  }
})

router.get("/logout", function(req, res){
  global.loggedIn = false;
  res.redirect("/");
})

module.exports = router;
