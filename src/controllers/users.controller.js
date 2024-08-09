const userCtrl = {};
const passport = require('passport');
const Usuarios = require('../models/User');
const upload = require('../config/multer');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('usuarios/signup');
};

userCtrl.signup = (req, res) => {
    upload(req, res, async (err) => {
        const errors = [];
        const { nombre, email, pass, conf_pass } = req.body;

        if (err) {
            errors.push({ text: err });
        }

        if (pass != conf_pass) {
            errors.push({ text: 'Las contraseñas no coinciden' });
        }
        if (pass.length < 7) {
            errors.push({ text: 'La contraseña debe tener al menos 7 caracteres' });
        }

        if (errors.length > 0) {
            return res.render('usuarios/signup', {
                errors, nombre, email, pass, conf_pass
            });
        } else {
            const emailUser = await Usuarios.findOne({ email: email });
            if (emailUser) {
                req.flash('error_msg', 'El correo ya está en uso');
                return res.redirect('/usuarios/signup');
            } else {
                const newUser = new Usuarios({
                    nombre, email, pass,
                    profilePicture: req.file ? `/img/profiles/${req.file.filename}` : '/img/default.png'
                });
                newUser.pass = await newUser.encryptPassword(pass);
                await newUser.save();
                req.flash('succ_msg', 'Estás registrado');
                return res.redirect('/usuarios/signin');
            }
        }
    });
};

userCtrl.renderSigninForm = (req, res) => {
    res.render('usuarios/signin');
};

userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/usuarios/signin',
    successRedirect: '/notes',
    failureFlash: true
});

userCtrl.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("succ_msg", "Has cerrado tu sesión");
        res.redirect("/usuarios/signin");
    });
};

module.exports = userCtrl;