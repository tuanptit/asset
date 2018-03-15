var Employee = require('../model/employee');

exports.addEmployee = function (req, res) {
    var mEmployee = new Employee({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email
    });
    Employee.findOne({
        username: req.body.username
    }, function (err, obj) {
        if (err) {
            res.json({
                code: 0
            })
        } else if (obj) {
            res.json({
                code: 1,
                result: 'username exits'
            });
        } else {
            mEmployee.save(function (err) {
                if (err) {
                    res.json({
                        code: 2
                    })
                } else {
                    res.json({
                        code: 3,
                        result: 'success'
                    })
                }
            })
        }
    });
}

exports.getAllEmployee = function (req, res) {
    Employee.find({
        username: {'$ne': 'admin'}
    }, function (err, employees) {
        var list = [];
        for (var i = 0; i < employees.length; i++) {
            var tmp = {
                id: employees[i]._id,
                username : employees[i].username,
                name : employees[i].name,
                address : employees[i].address,
                email : employees[i].email,
                phone : employees[i].phone,
                password : employees[i].password,
                role : employees[i].role
            }
            list.push(tmp);
        }
        res.json({
            code: 1,
            result: list
        })
    })
}
exports.editEmployee = function (req, res) {
    Employee.findOne({
        _id: req.params.id
    }, function (err, em) {
        if (err) {
            res.json({
                status: 'fail',
                message: err.message
            });
        } else if (!em) {
            res.json({
                status: 'fail',
                message: 'not found'
            });
        } else {
            em.username = req.body.username;
            em.name = req.body.name;
            em.phone = req.body.phone;
            em.email = req.body.email;
            em.address = req.body.address;
            em.role = req.body.role;
            if(req.body.password !=null){
                em.password = req.body.password;
            }
            console.log(em);
            em.save(function (err) {
                if (err) {
                    res.json({
                        status: 'fail',
                        message: err.message
                    });
                } else {
                    res.json({
                        status: 'success'
                    });
                }
            })
        }
    })
}
exports.getEmployeePage = function (req, res) {
    res.render('admin/asset', {});
}

exports.deleteEmployee = function (req, res) {
    var em = req.params.id;
    Employee.remove({
        _id: em
    }, function (err) {
        if (err) {
            res.json({
                status: 'fail',
                message: err
            });
        } else {
            res.json({
                status: 'success'
            });
        }
    });
}