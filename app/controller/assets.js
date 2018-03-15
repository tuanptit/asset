var Asset = require('../model/asset');
var Category = require('../model/category');
var Property = require('../model/property');
var Category = require('../model/category');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
exports.addAsset = function (req, res) {
    var mAsset = new Asset({
        username: req.body.username,
        category: {
            text: req.body.category.text,
            value: req.body.category.value
        },
        package: req.body.package,
        unit: req.body.unit,
        year: req.body.year,
        serial_number: req.body.serial,
        brand: req.body.brand,
        country: req.body.country,
        manager: {
            text: req.body.manager.text,
            value: req.body.manager.value
        },
        use: {
            text: req.body.use.text,
            value: req.body.use.value
        },
        location: {
            text: req.body.location.text,
            value: req.body.location.value
        },
        status: req.body.status,
        note: req.body.note,
        quantity: req.body.quantity
    });
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
    console.log(req.user)
    Asset.find({}, function (err, assets) {
        var list = [];
        for (var i = 0; i < assets.length; i++) {
            var tmp = {
                username: assets[i].username,
                category: {
                    text:  assets[i].category.text,
                    value: assets[i].category.value
                },
                package: assets[i].package,
                unit: assets[i].unit,
                year: assets[i].year,
                serial_number: assets[i].serial_number,
                brand: assets[i].brand,
                country: assets[i].country,
                manager: assets[i].manager,
                use: assets[i].use,
                location: assets[i].location,
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
    Property.find({

    })
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
        for( var i = 0; i< cates.length; i++) {
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
                if(err){
                    res.json(500, {message:"Could not remove user from admin list"});
                }else{
                    res.json({
                        status: 'success'
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
        if(err){
            res.json({
                status: '1',
                message: err.message
            });
        } else if(!asset) {
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
                if(err){
                    res.json({
                        status: '3',
                        message: err.message
                    });
                }
                if(!err && asset1){
                    res.json({
                        status: '4',
                        message: 'bi trung'
                    });
                } else if(!err && !asset1) {
                    var mAsset = {
                        username: req.body.username,
                        category: {
                            text: req.body.category.text,
                            value: req.body.category.value
                        },
                        package: req.body.package,
                        unit: req.body.unit,
                        year: req.body.year,
                        serial_number: req.body.serial_number,
                        brand: req.body.brand,
                        country: req.body.country,
                        manager: {
                            text: req.body.manager.text,
                            value: req.body.manager.value
                        },
                        use: {
                            text: req.body.use.text,
                            value: req.body.use.value
                        },
                        location: {
                            text: req.body.location.text,
                            value: req.body.location.value
                        },
                        status: req.body.status,
                        note: req.body.note,
                        quantity: req.body.quantity,
                        history: []
                    };

                    var time = moment();
                    var time_now = time.format('HH:mm:ss YYYY-MM-DD');
                    if(asset.username != mAsset.username) {
                        console.log('1');
                        asset.history.push({
                            name: asset.username + "->" + mAsset.username,
                            date: time_now,
                            code: 1,
                            user: req.user.username
                        });
                    }
                    if(asset.category.value != mAsset.category.value) {
                        console.log('1');
                        asset.history.push({
                            name: asset.category.text + "->" + mAsset.category.text,
                            date: time_now,
                            code: 2,
                            user: req.user.username
                        });
                    }
                    if(asset.manager.value != mAsset.manager.value) {
                        console.log('1');
                        asset.history.push({
                            name: asset.manager.text + "->" + mAsset.manager.text,
                            date: time_now,
                            code: 3,
                            user: req.user.username
                        });
                    }

                    if(asset.use.value != mAsset.use.value) {
                        console.log('1');
                        asset.history.push({
                            name: asset.use.text + "->" + mAsset.use.text,
                            date: time_now,
                            code: 4,
                            user: req.user.username
                        });
                    }

                    if(asset.location.value != mAsset.location.value) {
                        console.log('1');
                        asset.history.push({
                            name: asset.location.text + "->" + mAsset.location.text,
                            date: time_now,
                            code: 5,
                            user: req.user.username
                        });
                    }

                    if(asset.package != mAsset.package) {
                        console.log('1');
                        asset.history.push({
                            name: asset.package + "->" + mAsset.package,
                            date: time_now,
                            code: 6,
                            user: req.user.username
                        });
                    }

                    if(asset.unit != mAsset.unit) {
                        console.log('1');
                        asset.history.push({
                            name: asset.unit + "->" + mAsset.unit,
                            date: time_now,
                            code: 7,
                            user: req.user.username
                        });
                    }

                    if(asset.quantity != mAsset.quantity) {
                        console.log('1');
                        asset.history.push({
                            name: asset.quantity + "->" + mAsset.quantity,
                            date: time_now,
                            code: 8,
                            user: req.user.username
                        });
                    }

                    if(asset.year != mAsset.year) {
                        console.log('1');
                        asset.history.push({
                            name: asset.year + "->" + mAsset.year,
                            date: time_now,
                            code: 9,
                            user: req.user.username
                        });
                    }

                    if(asset.serial_number != mAsset.serial_number) {
                        console.log('1');
                        asset.history.push({
                            name: asset.serial_number + "->" + mAsset.serial_number,
                            date: time_now,
                            code: 10,
                            user: req.user.username
                        });
                    }

                    if(asset.brand != mAsset.brand) {
                        console.log('1');
                        asset.history.push({
                            name: asset.brand + "->" + mAsset.brand,
                            date: time_now,
                            code: 11,
                            user: req.user.username
                        });
                    }

                    if(asset.country != mAsset.country) {
                        console.log('1');
                        asset.history.push({
                            name: asset.country + "->" + mAsset.country,
                            date: time_now,
                            code: 12,
                            user: req.user.username
                        });
                    }

                    if(asset.status != mAsset.status) {

                        asset.history.push({
                            name: asset.status + "->" + mAsset.status,
                            date: time_now,
                            code: 13,
                            user: req.user.username
                        });
                    }

                    if(asset.note != mAsset.note) {
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
                    asset.serial_number = mAsset.serial_number
                    asset.save(function (err, newAsset) {
                        if (err) {
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
                } else{
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

var insertProperty = function (propertyName, categoryId, callback) {
    console.log(categoryId)
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

