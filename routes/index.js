var express = require('express');
var router = express.Router();
var mysql  = require('mysql');
var passport = require('passport');


var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'devpass1',
  port: '3306',
  database: 'CLUBHUB'
});

connection.connect(function (err) {
  if (!err) {

    console.log("Successfully connected to db \n\n");
  } else {

    console.log("Error connecting to db! Y'all fucked now! \n\n" + err);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'ClubHub', message: req.flash('loginMessage')});
});

router.post('/', passport.authenticate('local-login', {
      successRedirect : '/event', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }),
    function(req, res) {
      console.log("hello");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }

  //var party = req.body.code;
  //
  //connection.query("SELECT * FROM event WHERE code=?;", [party], function (rows, err) {
  //
  //  if (err) throw err;
  //
  //  if (rows.length) {
  //
  //    connection.query("", [party], function (rows, err) {
  //
  //
  //    });

});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/event', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/event', function (req, res, next) {

  res.render('eventcheck', { title: "EVENT CHECK-IN!", user: req.user })

});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next(); //,

  // if they aren't redirect them to the home page
  res.redirect('/');
};

router.get('/lol', function(){

  return "COMPLETE! YAaaaaas!";
});

module.exports = router;