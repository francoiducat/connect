const pg = require('pg');
const { Pool } = require("pg");
const nunjucks = require('nunjucks');
const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require("./db.js");
// Database settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isPgSslActive()
});

// Nunjucks & Express setup
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set("views", __dirname + "/views");
app.set("view engine", "njk");
app.use(require("body-parser").urlencoded({extended: true }));
app.use(require("cookie-parser")());

app.use(require("express-session")({
    secret: "kjsdhfkjhdfkjshdfkjh76876876gf4534!!jjjds%£",
    resave: false,
    saveUninitialized: false
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(function(username, password, callback) {
    db.findUser(username,password,pool)
        .then( user => { callback(null, user.rows[0]) })
        .catch( e => callback(e) );
  }
));

passport.serializeUser(function(user, callback) {
  return callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  return db.getUserById(id,pool)
    .then( user => callback(null,user))
    .catch(e => console.log(e));
});


// Express routes
app.get(
  "/", (req, res) => res.render('index.html'));
app.get(
  "/create-profile", (req, res) => res.render('create-profile'));
app.get(
  "/profile/:id",
  require("connect-ensure-login").ensureLoggedIn("/login"),
  (request, result) => {
    db.getUserById(request.params.id,pool)
      .then( res => {
        result.render("profile",{user : res.rows[0]} );
      })
      .catch(e => {
        console.log(e);
        result.redirect("/create-profile");
      });
});

// ACTIONS
app.post(
  "/authenticate",
    passport.authenticate(
      "local",
      { failureRedirect: "/" }), function(request, result) {
        result.redirect("/profile/" + request.user.id)
      }
);

app.post(
  "/create_user", (request, result) => {
    console.log(request.body);
    db.createUser(request.body,pool)
    .then(res => result.redirect("/profile/" + res.rows[0].id))
    .catch(e => {
      console.log(e);
      result.redirect("/create-profile");
  });
  });


// SERVER Listening
app.listen(3000, () => console.log('Listening on port 3000...'));

function isPgSslActive() {
  if (process.env.SSLPG === "false") {
    return false;
  }
  return true;
}
