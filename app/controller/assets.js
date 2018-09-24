var Asset = require('../model/asset');
var Category = require('../model/category');
var Property = require('../model/property');
var Category = require('../model/category');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var async = require('async');

exports.addAsset = function (req, res) {
    var mAsset = new Asset({
        username: req.body.username,
        package: req.body.package,
        unit: req.body.unit,
        year: req.body.year,
        serial_number: req.body.serial,
        brand: req.body.brand,
        country: req.body.country,
        status: req.body.status,
        note: req.body.note,
        quantity: req.body.quantity
    });
    var category = req.body.category;
    var manager = req.body.manager;
    var use = req.body.use;
    var location = req.body.location;
    var route = req.body.route;
    var system = req.body.system;

    if(category!=null && category!="") {
        mAsset.category = new ObjectId(category);
    }
    if(manager!=null && manager!="") {
        mAsset.manager =  new ObjectId(manager);
    }

    if(use!=null && use!="") {
        mAsset.use = new ObjectId(use);
    }
    if(location!=null && location!="") {
        mAsset.location = new ObjectId(location);
    }

    if(route!=null && route!="") {
        mAsset.route = new ObjectId(route);
    }
    if(system!=null && system!="") {
        mAsset.system = new ObjectId(system);
    }
    Asset.findOne({
        $and: [
            {
                serial_number: req.body.serial
            },
            {
                serial_number: {
                    $ne: ""
                }
            }
        ]
    }, function (err, obj) {
        if (err) {
            res.json({
                code: 0
            })
        } else if (obj) {
            res.json({
                code: 1,
                result: 'serial number exits'
            });
        } else {
            mAsset.save(function (err) {
                if (err) {
                    console.log(err)
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
    })
}

exports.getAllAsset = function (req, res) {
    Asset.find().populate('manager').populate('use').populate('location')
        .populate('route').populate('system').populate('category').exec(function (err, assets) {
        var list = [];
        console.log(assets)
        for (var i = 0; i < assets.length; i++) {
            var tmp = {
                username: assets[i].username,
                category: {
                    name: '',
                    id:''
                },
                package: assets[i].package,
                unit: assets[i].unit,
                year: assets[i].year,
                serial_number: assets[i].serial_number,
                brand: assets[i].brand,
                country: assets[i].country,
                manager:{
                 name: '',
                 id: ''
                },
                use: {
                    name:'',
                    id:''
                },
                location: {
                    name: '',
                    id: ''
                },

                route: {
                    name:'',
                    id:''
                },

                system: {
                    name: '',
                    id:''
                },

                status: assets[i].status,
                note: assets[i].note,
                id: assets[i].id,
                quantity: assets[i].quantity,
                history: assets[i].history
            }

            // if(tmp.status == 1){
            //     tmp.status = "<span class='label label-success'>Active</span>"
            // } else if( tmp.status == 2) {
            //     tmp.status = "<span class='label label-warning'>Maintenance</span>"
            // } else if(tmp.status == 3) {
            //     tmp.status= "<span class='label label-danger'>Warranty</span>"
            // } else {
            //     tmp.status= "<span class='label label-info'>Unuse</span>"
            // }
            // if(assets[i].category!=null) {
            //     tmp.category.name = assets[i].category.name;
            //     tmp.category.id = assets[i].category._id;
            // }
            if(assets[i].manager!=null) {
                tmp.manager.name = assets[i].manager.name;
                tmp.manager.id = assets[i].manager._id;
            }
            if(assets[i].use!=null) {
                tmp.use.name = assets[i].use.name;
                tmp.use.id = assets[i].use._id;
            }
            if(assets[i].location!=null ) {
                tmp.location.name = assets[i].location.name;
                tmp.location.id = assets[i].location._id;
            }
            if(assets[i].route!=null ) {
                tmp.route.name = assets[i].route.name;
                tmp.route.id = assets[i].route._id;
            }
            if(assets[i].system!=null) {
                tmp.system.name = assets[i].system.name;
                tmp.system.id = assets[i].system._id;
            }
            list.push(tmp);
        }
        res.json({
            code: 1,
            result: list
        })
    })
}
var cate = require('../../config/asset_category');
var manager = require('../../config/asset_manager');
var user = require('../../config/asset_user');
var location = require('../../config/asset_installed');

exports.getCategory = function (req, res) {
    Property.find({})
}


exports.getManager = function (req, res) {
    var list_manager = manager.manager;
    res.json({
        category: list_manager
    });
}

exports.getUser = function (req, res) {
    var list_user = user.user;
    res.json({
        category: list_user
    });
}

exports.getLocation = function (req, res) {
    var list_location = location.location;
    res.json({
        category: list_location
    });
}

exports.getAllCategory = function (req, res) {
    Category.find({}, function (err, cates) {
        var list = [];
        for (var i = 0; i < cates.length; i++) {
            var tmp = {
                name: cates[i].name,
                id: cates[i].id
            }
            list.push(tmp);
        }
        res.json({
            code: 1,
            result: list
        })
    });
}

exports.getPropertyById = function (req, res) {
    Property.findOne({
        _id: req.params.id
    }, function (err, pro) {
        if(err || !pro) {
            res.json({
                code: 0,
                result: err
            })
        } else if( !err && pro) {
            res.json({
                code: 1,
                result: pro
            })
        }
    })
}
exports.addProperty = function (req, res) {
    insertProperty(req.body.name, req.body.category, function (err, province) {
        if (err) {
            res.json({
                status: 'fail',
                message: err
            });
        } else {
            res.json({
                status: 'success',
                result: province
            });
        }
    });
}
exports.getPropertiesByCate = function (req, res) {
    Category.findOne({
        _id: req.params.cateId
    }, function (err, category) {
        if (!category || err) {
            res.json({
                status: 'fail'
            });
        } else {
            Property.find({
                _id: {
                    $in: category.properties
                }
            }).exec(function (err, pros) {
                if (err) {
                    res.json({
                        status: 'fail'
                    });
                } else {
                    var properties = [];
                    for (var i = 0; i < pros.length; i++) {
                        properties.push({
                            id: pros[i]._id,
                            name: pros[i].name
                        });
                    }
                    res.json({
                        status: 'success',
                        category: category,
                        result: properties
                    });
                }
            });
        }
    });
}

exports.getAllPropertiesAndCate = function (req, res) {
    Category.find({},
        function (err, categories) {
            if (!categories || err) {
                res.json({
                    status: 'fail'
                });
            } else {
                var result = [];
                async.eachSeries(categories,
                    function (mCategory, callback ) {
                        async.waterfall([
                            function (cb) {
                                Property.find({
                                    _id: mCategory.properties
                                }, function (err, list) {
                                    if(!err){
                                        console.log(list)
                                        cb(null, list)
                                    }
                                })
                            }
                        ],function (err, list) {
                            var tmp = {};
                            tmp.category = mCategory;
                            tmp.properties = list;
                            result.push(tmp);
                            callback();
                        })
                    }, function (err) {
                        if(!err) {
                            res.json({
                                code: 1,
                                result: result
                            })
                        }
                    });
            }
        });
}

exports.getPropertiesByUniName = function (req, res) {
    Category.findOne({
        uni_name: req.params.uni_name
    }, function (err, category) {
        if (!category || err) {
            console.log('aaaaa');
            console.log(err)
            res.json({
                status: 'fail'
            });
        } else {
            Property.find({
                _id: {
                    $in: category.properties
                }
            }).exec(function (err, pros) {
                if (err) {
                    res.json({
                        status: 'fail'
                    });
                } else {
                    var properties = [];
                    for (var i = 0; i < pros.length; i++) {
                        properties.push({
                            id: pros[i]._id,
                            name: pros[i].name
                        });
                    }
                    res.json({
                        status: 'success',
                        category: category,
                        result: properties
                    });
                }
            });
        }
    });
}
exports.deleteProperty = function (req, res) {
    var property_id = req.params.id;
    var cate_id = req.params.cate
    console.log(cate_id)
    Property.remove({
        _id: property_id
    }, function (err) {
        if (err) {
            res.json({
                status: 'fail',
                message: err.message
            });
        }
        else {
            Category.update({
                _id: cate_id
            }, {
                $pull: {
                    properties: new ObjectId(property_id)
                }
            }, function (err) {
                if (err) {
                    res.json(500, {message: "Could not remove user from admin list"});
                } else {
                    res.json({
                        status: 'success'
                    });
                }
            })
        }
    })
}
exports.updateProperty = function (req, res) {

    Property.findOne({
        _id: req.params.id
    }, function (err, property) {
        if(err) {
            res.json({
                status: '1',
                message: err
            })
        } else if(!property) {
            res.json({
                status: '2',
                message: 'not found'
            })
        } else {
            var name = req.body.name;
            property.name = name;
            property.save(function (err, pro) {
                if(err) {

                    res.json({
                        status: '3',
                        message: err.message
                    });
                } else {
                    res.json({
                        status: 'success',
                        result: pro
                    });
                }
            })
        }
    })
}

exports.updateAsset = function (req, res) {
    Asset.findOne({
        _id: req.params.id
    }, function (err, asset) {
        if (err) {
            res.json({
                status: '1',
                message: err.message
            });
        } else if (!asset) {
            res.json({
                status: '2',
                message: 'not found'
            });
        } else {
            Asset.findOne({
                $and: [
                    {
                        serial_number: req.body.serial_number
                    },
                    {
                        serial_number: {
                            $ne: ""
                        }
                    },
                    {
                        _id: {
                            $ne: ObjectId(req.params.id)
                        }
                    }
                ]
            }, function (err, asset1) {
                if (err) {
                    res.json({
                        status: '3',
                        message: err.message
                    });
                }
                if (!err && asset1) {
                    res.json({
                        status: '4',
                        message: 'bi trung'
                    });
                } else if (!err && !asset1) {
                    var mAsset = {
                        username: req.body.username,
                        category:req.body.category,
                        package: req.body.package,
                        unit: req.body.unit,
                        year: req.body.year,
                        serial_number: req.body.serial_number,
                        brand: req.body.brand,
                        country: req.body.country,
                        manager: req.body.manager,
                        use: req.body.use,
                        location: req.body.location,
                        status: req.body.status,
                        note: req.body.note,
                        quantity: req.body.quantity,
                        route: req.body.route,
                        system: req.body.system,
                        history: []
                    };

                    var time = moment();
                    var time_now = time.format('HH:mm:ss YYYY-MM-DD');
                    if (asset.username != mAsset.username) {
                        console.log('1');
                        asset.history.push({
                            name: asset.username + "->" + mAsset.username,
                            date: time_now,
                            code: 1,
                            user: req.user.username
                        });
                    }
                    if (asset.category != mAsset.category) {
                        console.log('1');
                        asset.history.push({
                            name: asset.category + "->" + mAsset.category,
                            date: time_now,
                            code: 2,
                            user: req.user.username
                        });
                    }
                    if (asset.manager != mAsset.manager) {
                        console.log('1');
                        asset.history.push({
                            name: asset.manager + "->" + mAsset.manager,
                            date: time_now,
                            code: 3,
                            user: req.user.username
                        });
                    }
                    if (asset.route != mAsset.route) {
                        console.log('route');
                        asset.history.push({
                            name: asset.route + "->" + mAsset.route,
                            date: time_now,
                            code: 66,
                            user: req.user.username
                        });
                    }

                    if (asset.system != mAsset.system) {
                        console.log('system');
                        asset.history.push({
                            name: asset.system + "->" + mAsset.system,
                            date: time_now,
                            code: 88,
                            user: req.user.username
                        });
                    }

                    if (asset.use != mAsset.use) {
                        asset.history.push({
                            name: asset.use + "->" + mAsset.use,
                            date: time_now,
                            code: 4,
                            user: req.user.username
                        });
                    }

                    if (asset.location != mAsset.location) {
                        console.log('1');
                        asset.history.push({
                            name: asset.location + "->" + mAsset.location,
                            date: time_now,
                            code: 5,
                            user: req.user.username
                        });
                    }

                    if (asset.package != mAsset.package) {
                        console.log('1');
                        asset.history.push({
                            name: asset.package + "->" + mAsset.package,
                            date: time_now,
                            code: 6,
                            user: req.user.username
                        });
                    }

                    if (asset.unit != mAsset.unit) {
                        console.log('1');
                        asset.history.push({
                            name: asset.unit + "->" + mAsset.unit,
                            date: time_now,
                            code: 7,
                            user: req.user.username
                        });
                    }

                    if (asset.quantity != mAsset.quantity) {
                        console.log('1');
                        asset.history.push({
                            name: asset.quantity + "->" + mAsset.quantity,
                            date: time_now,
                            code: 8,
                            user: req.user.username
                        });
                    }

                    if (asset.year != mAsset.year) {
                        console.log('1');
                        asset.history.push({
                            name: asset.year + "->" + mAsset.year,
                            date: time_now,
                            code: 9,
                            user: req.user.username
                        });
                    }

                    if (asset.serial_number != mAsset.serial_number) {
                        console.log('1');
                        asset.history.push({
                            name: asset.serial_number + "->" + mAsset.serial_number,
                            date: time_now,
                            code: 10,
                            user: req.user.username
                        });
                    }

                    if (asset.brand != mAsset.brand) {
                        console.log('1');
                        asset.history.push({
                            name: asset.brand + "->" + mAsset.brand,
                            date: time_now,
                            code: 11,
                            user: req.user.username
                        });
                    }

                    if (asset.country != mAsset.country) {
                        console.log('1');
                        asset.history.push({
                            name: asset.country + "->" + mAsset.country,
                            date: time_now,
                            code: 12,
                            user: req.user.username
                        });
                    }

                    if (asset.status != mAsset.status) {

                        asset.history.push({
                            name: asset.status + "->" + mAsset.status,
                            date: time_now,
                            code: 13,
                            user: req.user.username
                        });
                    }

                    if (asset.note != mAsset.note) {
                        asset.history.push({
                            name: asset.note + "->" + mAsset.note,
                            date: time_now,
                            code: 14,
                            user: req.user.username
                        });
                    }

                    asset.username = mAsset.username;
                    asset.category = mAsset.category;
                    asset.package = mAsset.package;
                    asset.unit = mAsset.unit;
                    asset.year = mAsset.year;
                    asset.brand = mAsset.brand;
                    asset.country = mAsset.country;
                    asset.manager = mAsset.manager;
                    asset.use = mAsset.use;
                    asset.location = mAsset.location;
                    asset.status = mAsset.status;
                    asset.note = mAsset.note;
                    asset.quantity = mAsset.quantity;
                    asset.serial_number = mAsset.serial_number;
                    asset.route = mAsset.route;
                    asset.system = mAsset.system;
                    console.log(asset)
                    asset.save(function (err, newAsset) {
                        if (err) {
                            console.log(err)
                            res.json({
                                status: '5',
                                message: err.message
                            });
                        } else {
                            res.json({
                                status: 'success',
                                result: newAsset
                            });
                        }
                    });
                } else {
                    res.json({
                        status: '5',
                        message: 'ko xac dinh'
                    });
                }
            });
        }
    })
}


exports.deleteAsset = function (req, res) {
    var assetId = req.params.id;
    Asset.remove({
        _id: assetId
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

exports.uploadFile = function (req, res) {
    var XLSX = require('xlsx')
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            res.json({error_code: 1, err_desc: err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({error_code: 2, err_desc: "No file passed"});
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            var workbook = XLSX.readFile(req.file.path);
            var sheet_name_list = workbook.SheetNames;
            var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var result = [];
            async.eachSeries(data,
                function (mAsset, callback) {
                    async.waterfall([
                        function (cb) {
                            insertAsset(mAsset, function (err, asset) {
                                cb(null, asset)
                            })
                        },
                        function (asset, cb) {
                            Asset.findOne({
                                serial_number: asset.serial_number
                            }, function (err, sAsset) {
                                if (!err && !sAsset && asset.username !="" && asset.username!=null) {
                                    asset.save(function (err, newAsset) {
                                        cb(null, newAsset, sAsset)
                                    })
                                } else {
                                    cb(null,null,sAsset)
                                }
                            });
                        }
                    ], function (err, newAsset, sAsset) {
                        if(newAsset) {
                            result.push({
                                code: 0,
                                status: newAsset.username+": Thêm tài sản thành công"
                            })
                        } else if(sAsset)  {
                            result.push({
                                code: 1,
                                status: "LỖI - "+sAsset.serial_number+" Serial Number đã tồn tại"
                            })
                        }
                        callback();
                    })
                }, function (err) {
                    if (err) {
                        res.json({
                            status: 'fail',
                            message: err
                        });
                    } else {
                        res.json({
                            status: 'success',
                            result: result
                        });
                    }
                })

        } catch (e) {
            console.log(e)
            res.json({error_code: 5, err_desc: "Corupted excel file"});
        }
    })
}


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },


    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

var insertAsset = function (mAsset, callback) {
    var newAsset = new Asset({
        username: "",
        package: "",
        unit: "",
        year: "",
        serial_number: "",
        brand: "",
        country: "",
        status: "",
        note: "",
        quantity: ""
    });
    if (mAsset["Tên tài sản"] !=null && mAsset["Tên tài sản"]!="") newAsset.username = mAsset["Tên tài sản"]
    if (mAsset["Gói thầu"] !=null && mAsset["Gói thầu"]!="") newAsset.package = mAsset["Gói thầu"]
    if (mAsset["Đơn vị tính"]!=null && mAsset["Đơn vị tính"]!="") newAsset.unit = mAsset["Đơn vị tính"]
    if (mAsset["Số lượng"]!=null && mAsset["Số lượng"]!="") newAsset.quantity = mAsset["Số lượng"]
    if (mAsset["Serial Number"]!=null && mAsset["Serial Number"]!="") newAsset.serial_number = mAsset["Serial Number"]
    if (mAsset["Năm sử dụng"]!=null && mAsset["Năm sử dụng"]!="") newAsset.year = mAsset["Năm sử dụng"]
    if (mAsset["Hãng sản xuất"]!=null && mAsset["Hãng sản xuất"]!="") newAsset.brand = mAsset["Hãng sản xuất"]
    if (mAsset["Nước sản xuất"]!=null && mAsset["Nước sản xuất"]!="") newAsset.country = mAsset["Nước sản xuất"]
    if (mAsset["Trạng thái"].toUpperCase()== 'ACTIVE')
        newAsset.status = 1;
    else if (mAsset["Trạng thái"] == 'MAINTENANCE')
        newAsset.status = 2;
    else
        newAsset.status = 3;

    if(mAsset["Tuyến"]!=null &&mAsset["Tuyến"]!="") mAsset.route = mAsset["Tuyến"];
    if(mAsset["Vị trí trên hệ thống"]!=null && mAsset["Vị trí trên hệ thống"]!="" ) mAsset.system = mAsset["Vị trí trên hệ thống"];
    if(mAsset["Hệ thống thiết bị"]!=null &&mAsset["Hệ thống thiết bị"]!="" ) mAsset.category = mAsset["Hệ thống thiết bị"];
    if(mAsset["Vị trí lắp đặt"]!=null &&mAsset["Vị trí lắp đặt"]!="" ) mAsset.location = mAsset["Vị trí lắp đặt"];
    if(mAsset["Đơn vị quản lý"]!=null &&mAsset["Đơn vị quản lý"]!="" ) mAsset.manager = mAsset["Đơn vị quản lý"];
    if(mAsset["Đơn vị sử dụng"]!=null &&mAsset["Đơn vị sử dụng"]!="" ) mAsset.use = mAsset["Đơn vị sử dụng"];

    var initCate = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.category, 'category', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.category = property.id;
            }
            resolve('success');
        });
    });

    var initManager = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.manager, 'manager', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.manager = property.id;
            }
            resolve('success');

        });
    })

    var initUse = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.use, 'use', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.use = property.id;
            }
            resolve('success');
        });
    });

    var initLocation = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.location, 'location', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.location = property.id;
            }
            resolve('success');
        });
    });

    var initSystem = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.system, 'system', function (err, property) {
            console.log('system')
            if (err) {
                reject(err)
            }
            else if (property) {console.log(property)
                newAsset.system = property.id;
            }
            resolve('success');
        });
    });
    var initRoute = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.route, 'route', function (err, property) {
            console.log('route')
            if (err) {
                reject(err)
            }
            else if (property) {
                console.log(property)
                newAsset.route = property.id;
            }
            resolve('success');
        });
    });
    Promise.all([initCate, initManager, initUse, initLocation, initRoute, initSystem]).then(function (resolve) {
        console.log(newAsset)
        return callback(null, newAsset);
    }).catch(function (err) {
        return callback(resolve, null);
    })

}

var getPropertyByName = function (name, uni_name, callback) {
    Category.findOne({
        uni_name: uni_name
    }, function (err, category) {
        if (err) {
            callback(err, null)
        } else {
            if(category) {
                Property.findOne({
                    $and: [
                        {
                            _id: {
                                $in: category.properties
                            }
                        },
                        {
                            name: {
                                $eq: name
                            }
                        }
                    ]
                }, function (err, property) {
                    if (err) callback(err, null)
                    else callback(null, property)
                })
            } else {
                console.log('kooooo')
            }
        }
    })
}

var insertProperty = function (propertyName, categoryId, callback) {
    var newProperty = new Property({
        name: propertyName
    });
    var add = new Promise(function (resolve, reject) {
        newProperty.save(function (err) {
            if (err) reject(err);
            else resolve('success');
        });
    });
    var push = new Promise(function (resolve, resject) {
        Category.update({
            _id: categoryId
        }, {
            $push: {
                properties: newProperty._id
            }
        }, function (err) {
            if (err) resject(err);
            else resolve();
        });
    });

    Promise.all([add, push]).then(function (resolve) {
        return callback(null, newProperty);
    }).catch(function (rej) {
        return callback(rej, null);
    });
}

