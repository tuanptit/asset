var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var Employee = require('./model/employee')

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        Employee.findById(id)
            .exec(function (err, user) {
                done(err, user);
            });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            Employee.findOne({
                username: username
            }, function (err, user) {
                if (err){
                    return done(err);
                }

                if (!user){
                    return done(null, false, req.flash('loginMessage', 'Tên đăng nhập không tồn tại'));
                }

                if (user.password != password)
                    return done(null, false, req.flash('loginMessage', 'Mật khẩu sai'));
                return done(null, user);
            });
        }));
}
