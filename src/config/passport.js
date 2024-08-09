const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/User');

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'pass'
}, async (email, pass, done) => {
    //Confirmar si el correo coincide
    try {
        const user = await Usuarios.findOne({ email });
        if (!user) {
            return done(null, false, { message: "No se encontró el usuario" });
        } else {
            // Validar contraseña
            const match = await user.matchPass(pass);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Contraseña incorrecta" });
            }
        }
    } catch (error) {
        return done(error);
    }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuarios.findById(id).exec();
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
