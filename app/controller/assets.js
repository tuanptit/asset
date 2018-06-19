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
    Asset.find({}, function (err, assets) {
        var list = [];
        for (var i = 0; i < assets.length; i++) {
            var tmp = {
                username: assets[i].username,
                category: assets[i].category,
                package: assets[i].package,
                unit: assets[i].unit,
                year: assets[i].year,
                serial_number: assets[i].serial_number,
                brand: assets[i].brand,
                country: assets[i].country,
                manager: assets[i].manager,
                use: assets[i].use,
                location: assets[i].location,

                route: assets[i].route,

                system: assets[i].system,

                status: assets[i].status,
                note: assets[i].note,
                id: assets[i].id,
                quantity: assets[i].quantity,
                history: assets[i].history
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
            sheet_name_list.forEach(function (y) {
                var worksheet = workbook.Sheets[y];
                var headers = {};
                var data = [];
                for (z in worksheet) {
                    if (z[0] === '!') continue;

                    //parse out the column, row, and value
                    var col = z.substring(0, 1);
                    var row = parseInt(z.substring(1));
                    var value = worksheet[z].v;

                    //store header names
                    if (row == 1) {
                        headers[col] = value;
                        continue;
                    }

                    if (!data[row])
                        data[row] = {};
                    data[row][headers[col]] = value;
                }
                //drop those first two rows which are empty
                data.shift();
                data.shift();
                var totalDoc = data.length;
                var result = [];
                console.log(data)
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
                                        cb(null, newAsset)
                                    })
                                } else {
                                    cb(null,null)
                                }
                            });
                        }
                    ], function (err, newAsset) {
                        if(newAsset) {
                            result.push({
                                code: 0,
                                status: newAsset.username+": Thêm tài sản thành công"
                            })
                        } else {
                            result.push({
                                code: 1,
                                status: "LỖI - "+mAsset.serial_number+" Serial Number đã tồn tại"
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
            });

        } catch (e) {
            console.log(e)
            res.json({error_code: 5, err_desc: "Corupted excel file"});
        }
    })
}


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
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
        category: {
            text: "",
            value: ""
        },
        package: "",
        unit: "",
        year: "",
        serial_number: "",
        brand: "",
        country: "",
        manager: {
            text: "",
            value: ""
        },
        use: {
            text: "",
            value: ""
        },
        location: {
            text: "",
            value: ""
        },
        status: "",
        note: "",
        quantity: ""
    });
    if (mAsset.name !=null && mAsset!="") newAsset.username = mAsset.name
    if (mAsset.package.length > 0) newAsset.package = mAsset.package
    if (mAsset.unit.length > 0) newAsset.unit = mAsset.unit
    if (mAsset.quantity.length > 0) newAsset.quantity = mAsset.quantity
    if (mAsset.serial_number.length > 0) newAsset.serial_number = mAsset.serial_number
    if (mAsset.serial_number.length > 0) newAsset.serial_number = mAsset.serial_number
    if (mAsset.year.length > 0) newAsset.year = mAsset.year
    if (mAsset.brand.length > 0) newAsset.brand = mAsset.brand
    if (mAsset.country.length > 0) newAsset.country = mAsset.country
    if (mAsset.status.toUpperCase() == 'ĐANG HOẠT ĐỘNG')
        newAsset.status = 1;
    else if (mAsset.status.toUpperCase() == 'ĐANG SỬA CHỮA')
        newAsset.status = 2;
    else
        newAsset.status = 3;
    // console.log(mAsset)

    var initCate = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.category, 'category', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.category.text = property.name;
                newAsset.category.value = property.id;
                resolve('success');
            } else {
                newAsset.category.text = "";
                newAsset.category.value = ""
                resolve('success');
            }
        });
    });

    var initManager = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.manager, 'manager', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.manager.text = property.name;
                newAsset.manager.value = property.id;
                resolve('success');
            } else {
                newAsset.manager.text = "";
                newAsset.manager.value = "";
                resolve('success');
            }
        });
    })

    var initUse = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.use, 'user', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.use.text = property.name;
                newAsset.use.value = property.id;
                resolve('success');
            } else {
                newAsset.use.text = ""
                newAsset.use.value = "";
                resolve('success');
            }
        });
    });

    var initLocation = new Promise(function (resolve, reject) {
        getPropertyByName(mAsset.location, 'location', function (err, property) {
            if (err) {
                reject(err)
            }
            else if (property) {
                newAsset.location.text = property.name;
                newAsset.location.value = property.id;
                resolve('success');
            } else {
                newAsset.location.text = "";
                newAsset.location.value = "";
                resolve('success');
            }
        });
    });
    Promise.all([initCate, initManager, initUse, initLocation]).then(function (resolve) {
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

