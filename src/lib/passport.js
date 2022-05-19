const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require("../database");
passport.use('local.signup', new  LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, user, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?', [user]);
  if (rows.length > 0) {
    const user = rows[0];
    if (user.password == password) {
      
        done(null, user, req.flash('success', 'BIENVENIDO ' + user.nombreusuario + ' '+user.apellidopusuario + ' ' + user.apellidomusuario));
      
    } else {
        done(null, false, req.flash('message', 'CONTRASEÑA INCORRECTA'));
      
    }
  } else {
    return done(null, false, req.flash('error', 'EL USUARIO NO EXISTE'));
  }

}));

passport.serializeUser((user, done) => {
    done(null, user.clvusuario);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE clvusuario = ?', [id]);
    done(null, rows[0]);
  });