var mysql  = require('mysql');
var passport = require('passport');
var rdioConfig = {
    clientId: '6vf5zcbggrgqpclheu7fxx6quy',
    clientSecret: 'YFzeLCxuvGwOUuXI5NAWqA'
};
var Rdio = require('rdio')({
    rdio: rdioConfig
});

var rdio = new Rdio(); //{/*tokens*/}, {/*options*/}

// app/routes.js
module.exports = function(app, passport) {

  var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'devpass1',
    port: '3306',
    database: 'CLUBHUB'
  });



    app.get('/auth', function (req, res){

        res.redirect('https://www.rdio.com/oauth2/authorize?response_type=code&client_id=' + rdioConfig.clientId + '&redirect_uri=http://localhost:3000/locator');
    });

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
    app.get('/', function(req, res) {

       res.render('login.ejs');
    });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

      res.render('login.ejs');
  });

  // process the login form
  app.post('/', passport.authenticate('local-login', {
        successRedirect : '/usergate', // redirect to the secure profile section
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
          res.redirect('/');

      });

    app.get('/usergate', function(req, res) {

        connection.query("SELECT utype FROM users WHERE username=?", [req.user.username], function(err, rows) {
            req.user.utype = rows[0].utype;
            if (req.user.utype == 'D') {
                res.redirect('/auth');
            } else {
                res.redirect('/locator');
            }

        });

    });

    app.get('/auth', function(req, res) {

        rdio.getAccessToken({
            code: request.query.code,
            redirect: 'http://localhost:3000/auth'
        }, function(err) {
            if (err) {
                return reply(err);
            }
            console.log("DJ Auth")
            reply.redirect('/locate');
        });
    });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs');
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/locator', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // LOCATOR SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/locator', isLoggedIn, function(req, res) {
    res.render('locator.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

    app.post('/locator', function(req, res) {

        connection.query("UPDATE users SET eventcode=? WHERE username=?", [req.body.eventcode, req.user.username], function(err, rows) {

            if (err) throw err;

        });

        // render the page and pass in any flash data if it exists
        res.render('locator.ejs');
    });

    app.get('/nowplaying', function(req, res) {
        // render the page and pass in any flash data if it exists
        

        res.render('nowplaying.ejs');
    });

    app.post('/nowplaying', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('nowplaying.ejs');
    });

    app.get('/hot', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('hot.ejs');
    });

    app.post('/hot', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('hot.ejs');
    });

    app.get('/bio', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('bio.ejs');
    });

    app.post('/bio', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('bio.ejs');
    });


  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}