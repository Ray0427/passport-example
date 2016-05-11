var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(
        function(username, password, done) {
            var user = {
                id: '1',
                username: 'admin',
                password: 'pass'
            }; // 可以配置通过数据库方式读取登陆账号

            if (username !== user.username) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (password !== user.password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }
    ));
    passport.serializeUser(function(user, done) { //保存user对象
        done(null, user); //可以通过数据库方式操作
    });

    passport.deserializeUser(function(user, done) { //删除user对象
        done(null, user); //可以通过数据库方式操作
    });
    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        // failureFlash: true
    }));
    router.get('/login', function(req, res, next) {
        console.log('123')
        res.render('login', { user: req.user });
    });

    /* GET Registration Page */
    router.get('/signup', function(req, res) {
        res.render('register', { message: req.flash('message') });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        // failureFlash: true
    }));

    router.get('/home', isLoggedIn, function(req, res) {
        res.json({ msg: 'welcome to admin' })
    });
    router.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('./login');
    });
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.json({msg:'please login'});
    }
    return router;
}
