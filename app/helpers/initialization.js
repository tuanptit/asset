var Employee = require('../model/employee');
var Category = require('../model/category');
module.exports = function () {
    Employee.findOne({
        username: 'admin'
    }, function (err, em) {
        if(!err && !em) {
            var admin = new Employee({
                username: 'admin',
                role: 1,
                password: 'admin'
            })
            admin.save();
        }
    });

    Category.findOne({
        uni_name: 'equipment'
    }, function (err, cate) {
        if(!err && ! cate) {
            var cate = new Category({
                name: 'Hệ thống thiết bị',
                uni_name: 'equipment'
            });
            cate.save();
        }
    });

    Category.findOne({
        uni_name: 'manager'
    }, function (err, cate) {
        if(!err && ! cate) {
            var cate = new Category({
                name: 'Đơn vị quản lý',
                uni_name: 'manager'
            });
            cate.save();
        }
    });

    Category.findOne({
        uni_name: 'user'
    }, function (err, cate) {
        if(!err && ! cate) {
            var cate = new Category({
                name: 'Đơn vị sử dụng',
                uni_name: 'user'
            });
            cate.save();
        }
    });

    Category.findOne({
        uni_name: 'location'
    }, function (err, cate) {
        if(!err && ! cate) {
            var cate = new Category({
                name: 'Vị trí lắp đặt',
                uni_name: 'location'
            });
            cate.save();
        }
    });

}