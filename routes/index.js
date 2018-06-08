var express = require('express');
var router = express.Router();
var employees = require('../app/controller/employees');
var assets = require('../app/controller/assets');




module.exports = function (app, passport) {
    app.get('/employees/asset',isLoggedIn, function (req, res) {
        res.render('employee/employees');
    });
    app.get('/login', function (req, res) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/assets', isLoggedIn, assets.addAsset);
    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                var redirect_to = '/';
                if (req.session.redirect_to) {
                    redirect_to = req.session.redirect_to;
                    req.session.redirect_to = '';
                }
                console.log("Redirect to: " + redirect_to);
                return res.redirect(redirect_to);
            });
        })(req, res, next);
    });
    app.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/login');
    });



    app.get('/asset', isLoggedIn, function (req, res) {
        res.render('asset/asset');
    });

    app.get('/category', isLoggedIn, function (req, res, next) {
        res.render('asset/category');
    });

    // Category
    app.get('/admin/assets',isLoggedInReal, assets.getAllAsset);
    app.get('/admin/employees', isLoggedIn,employees.getAllEmployee);
    app.get('/categories', isLoggedIn, assets.getCategory);
    app.get('/manager', isLoggedIn, assets.getManager);
    app.get('/user', isLoggedIn, assets.getUser);
    app.get('/location', isLoggedIn, assets.getLocation);
    app.get('/upcate', isLoggedIn, assets.getAllCategory);
    app.post('/property', isLoggedIn, assets.addProperty);
    app.get('/:cateId/properties', isLoggedInReal, assets.getPropertiesByCate);
    app.get('/properties/:uni_name', isLoggedInReal, assets.getPropertiesByUniName);
    app.delete('/property/:id/category/:cate', isLoggedIn, assets.deleteProperty);
    app.put('/admin/assets/:id', isLoggedIn, assets.updateAsset);
    app.put('/admin/property/:id', isLoggedInReal, assets.updateProperty);
    app.delete('/assets/:id', isLoggedIn, assets.deleteAsset);
    app.get('/property/:id', isLoggedInReal, assets.getPropertyById);
    // Employee
    app.post('/employees', isLoggedIn, employees.addEmployee);
    app.put('/employees/:id', isLoggedIn, employees.editEmployee);
    app.delete('/employees/:id', isLoggedIn, employees.deleteEmployee);


     app.get('/', isLoggedInReal, function (req, res) {
        var role = req.user.role;
        switch (role) {
            case 1:
                res.redirect('asset');
                break;
            case 2:
                res.redirect('/view/asset');
                break;
        }
    });

     //app.get('/test', assets.test);

     // Upload to Import
    app.post('/upload', isLoggedIn, assets.uploadFile)

     app.get('/view/asset', isEmployee, function (req, res) {
         res.render('asset/asset-view');
     })


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated() && req.user.role == 1) return next();
        res.redirect('/login');
    }

    function isEmployee(req, res, next) {
        if(req.isAuthenticated() && req.user.role == 2) return next();
        res.redirect('/login');
    }

    function isLoggedInReal(req, res, next) {
        if (!req.isAuthenticated())  res.redirect('/login');
        else return next();
    }
    // Employee
}