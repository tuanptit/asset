$(document).ready(function () {

    var t = $("#tbl-info-asset").DataTable({
        "retrieve": true,
        "lengthMenu": [5, 10, 50, 100],
        "pageLength": 50,
        "scrollX": true,
        dom: 'Bfrtip',
        buttons: [{
            extend: 'excelHtml5',
            text: 'Export All(*XLSX)',
            exportOptions: {
            },
            title: 'Data export'
        }, {
            extend: 'excelHtml5',
            text: 'Export selected(*XLSX)',
            exportOptions: {
                modifier: {
                    selected: true
                }
            },
            title: 'Data export'
        },{
            extend: 'pdfHtml5',
            text: 'Export All(*PDF)',
            exportOptions: {
            },
            title: 'Data export'
        },{
            extend: 'pdfHtml5',
            text: 'Export selected(*PDF)',
            exportOptions: {
                modifier: {
                    selected: true
                }
            },
            title: 'Data export'
        },{
            extend: 'copyHtml5'
        }
        ],
        select: {
            style : "multi"
        },
        fnInitComplete:function() {
            $('#tbl-info-asset tbody tr:eq(0)').click();
        }
    });

    var tbl_history = $('#tbl-asset-history').DataTable({
        "retrieve": true
    });

    function addTblHistory(asset) {
        var history = asset.history;
        if(history.length !=0) {
            tbl_history.clear();
            history.forEach(function (value, index) {
                var action ="";
                if(value.code == 1) {
                    action = "<span class='label label-info'>Đổi tên</span>";
                } else if (value.code == 2) {
                    action = "<span class='label label-success'>Đổi hệ thống thiết bị</span>";
                } else if(value.code == 3) {
                    action = "<span class='label label-warning'>Đổi đơn vị quản lý</span>";
                } else {
                    action = "<span class='label label-danger'>Đổi thông tin</span>";
                }
                tbl_history.row.add([index+1, asset.username, action, value.name, value.date, value.user]).draw(false);
            });
        } else {
            $('#tbl-asset-history').empty();
        }
    }

    function addAssetToTable(asset) {
        if (asset.length != 0) {
            t.clear();
            asset.forEach(function (value, index) {
                var mStatus = '';
                if(value.status == '1') {
                    mStatus = "<span class='label label-success'>Đang hoạt động</span>"
                } else if(value.status == '2') {
                    mStatus = "<span class='label label-warning'>Đang sửa chữa</span>"
                } else {
                    mStatus= "<span class='label label-danger'>Đang bảo hành</span>"
                }
                t.row.add([value.username, value.category.text, value.serial_number, value.manager.text, value.use.text, value.location.text,
                    mStatus, value.package, value.unit,value.quantity, value.year, value.brand, value.country, value.note ,value.edit
                ]).draw(false);
            });
        }
        else {
            $('#body-info-asset').empty();
        }
        bindActionTable();
    }


    t.columns( [7, 8,9,10,11,12,13 ] ).visible( false, false );
    // t.buttons().container()
    //     .appendTo( '#example_wrapper .col-sm-6:eq(0)' );

    actionSideBar();
    function actionSideBar() {
        $("#li-admin-employee").attr("class", "");
        $("#li-admin-commission").attr("class", "active");
        $("#li-admin-add-state").attr("class", "");
        $("#li-admin-statistical").attr("class", "");
    }
    bindActionTable();

    function bindActionTable() {
        $('#btn-add-asset').unbind();
        $('#btn-add-asset').click(function (event) {
            if ($('#btn-add-asset').text() == "Thêm") {
                bindActionForm();
                setYear();
                $("#div-tbl-info-asset").hide();
                $("#form-add-asset").show();
                $('#btn-add-asset').text("Quay lại");
            } else {
                $("#div-tbl-info-asset").show();
                if ($("#form-add-asset").css("display") == "block") {
                    $("#form-add-asset").hide();
                    $("#btn-add-asset").text("Thêm");
                } else if ($("#form-edit-asset").css("display") == "block") {
                    $("#form-edit-asset").hide();
                    $("#btn-add-asset").text("Thêm");
                }
            }
        });

        $(".btn-edit").unbind();
        $(".btn-edit").click(function (event) {
            event.preventDefault();
            $("#div-tbl-info-asset").hide();
            $("#form-edit-asset").show();
            $("#ul-link").append("<li class='active'><a href='#'>Sửa</a></li>");
            $("#btn-add-asset").text("Quay lại");

            var assetId = $(this).attr("asset-id");
            for (var i = 0; i < asset.length; i++) {
                if (asset[i].id == assetId) {
                    $("#btn-edit-asset").attr("asset-id", asset[i].id);
                    addDataToEditForm(asset[i]);
                    addTblHistory(asset[i]);
                    break;
                }
            }
        });

        $(".btn-delete").unbind();
        $(".btn-delete").click(function (e) {
            e.preventDefault();
            var idAsset = $(this).attr("asset-id");
            $("#confirm").attr("asset-id", idAsset);
        });

        //action btn ok in confirm noti
        $("#confirm").unbind();
        $("#confirm").click(function () {
            var idAsset = $(this).attr("asset-id");
            $("#myModal").modal("hide");
            deleteAsset(idAsset);
        });
    }

    $('#btn-edit-employee').click(function (event) {
        showNoti(4, "Sửa thông tin thành công");
    })


    function clearDataEditForm() {
        $("#username-edit").val("");
        $("#username-edit").val("");
        $("#goi-thau-edit").val("");
        $("#quantity-edit").val("");
        $("#serial-edit").val("");
        $("#brand-edit").val("");
        $("#country-edit").val("");
        $("#note-edit").val("");
    }

    function clearDataForm() {
        $("#username").val("");
        $("#goi-thau").val("");
        $("#quantity").val("");
        $("#serial").val("");
        $("#brand").val("");
        $("#country").val("");
        $("#note").val("");
        $("#serial").val("");

        $("#label-status-username").hide();
        $("#label-status-goi-thau").hide();
        $("#label-status-quantity").hide();
        $("#label-status-email").hide();
        $("#label-status-serial").hide();
        $("#label-status-brand").hide();
        $("#label-status-country").hide();
        $("#label-status-note").hide();
    }


    function setYear() {
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        $('#select-year').empty();
        for( var i = 2000; i < year; i++) {
            $('#select-year').append($('<option>', {
                value: i,
                text : i
            }));
        }
    }

    function setEditYear() {
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        $('#select-year').empty();
        for( var i = 2000; i < year; i++) {
            $('#select-year-edit').append($('<option>', {
                value: i,
                text : i
            }));
        }
    }


    function addDataToEditForm(asset) {
        setEditYear();
        $("#username-edit").val(asset.username);
        $("#goi-thau-edit").val(asset.package);
        $('#quantity-edit').val(asset.quantity);
        $('#serial-edit').val(asset.serial_number);
        $('#serial-edit').attr('asset-id', asset.id);
        $('#country-edit').val(asset.country);
        $('#status-edit option[value="'+asset.status+'"]').attr('selected', 'selected');
        $('#select-unit-edit option[value="'+asset.unit+'"]').attr('selected', 'selected');
        $('#select-year-edit option[value="'+asset.year+'"]').attr('selected', 'selected');
        $('#brand-edit').val(asset.brand);
        $('#note-edit').val(asset.note);
        getAllPropertiesOfCategory(asset,"select-category-edit", "equipment");
        getAllPropertiesOfCategory(asset,"select-manager-edit", "manager");
        getAllPropertiesOfCategory(asset,"select-user-edit", "user");
        getAllPropertiesOfCategory(asset,"select-location-edit", "location");
    }

    
    function getAllPropertiesOfCategory(asset, element, url) {
        $.ajax('/properties/'+url, {
            method: "GET"
        }).success(function (res) {
            if (res.status == "success") {
                var items = [];
                var value = asset.category.value;
                items = res.result;
                $('#'+element).find('option')
                    .remove()
                    .end();
                $.each(items, function (i, item) {
                    $('#'+element).append($('<option>', {
                        value: item.id,
                        text : item.name
                    }));
                });
                $('#'+element+' option[value="'+value+'"]').attr('selected','selected');

            } else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function getAllProperties(element, url) {
        $.ajax('/properties/'+url, {
            method: "GET"
        }).success(function (res) {
            if (res.status == "success") {
                var items = [];
                items = res.result;
                $('#'+element).find('option')
                    .remove()
                    .end();
                $.each(items, function (i, item) {
                    $('#'+element).append($('<option>', {
                        value: item.id,
                        text : item.name
                    }));
                });
            } else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }




    function bindActionForm() {
        clearDataForm();
        setDataToCombobox();
    }

    function setDataToCombobox() {
        $("#select-category").empty();
        $("#select-manager").empty();
        $("#select-use").empty();
        $("#select-location").empty();

        getAllProperties('select-category','equipment');
        getAllProperties('select-manager','manager');
        getAllProperties('select-use','user');
        getAllProperties('select-location','location');

    }

    $('#btn-submit-asset').click(function (event) {
        event.preventDefault();
        var asset = {
            username: $('#username').val(),
            category: {
                text: $('#select-category option:selected').text(),
                value: $('#select-category option:selected').val()
            },
            package: $('#goi-thau').val(),
            unit: $('#select-unit').val(),
            year: $('#select-year').val(),
            serial: $('#serial').val(),
            quantity: $('#quantity').val(),
            brand: $('#brand').val(),
            country: $('#country').val(),
            manager: {
                text: $('#select-manager option:selected').text(),
                value: $('#select-manager option:selected').val()
            },
            use: {
                text: $('#select-use option:selected').text(),
                value: $('#select-use option:selected').val()
            },
            location: {
                text: $('#select-location option:selected').text(),
                value: $('#select-location option:selected').val()
            },
            status: $('#status').val(),
            note: $('#note').val()
        }
        if(asset.username == "" || asset.category == "" || asset.manager == "" || asset.location == "" || asset.use == "") {
            showNoti(3, "Bạn chưa nhập đủ các trường cần thiết");
        } else {
            addAsset(asset);
        }

    });

    $('#btn-edit-asset').click(function (event) {
        event.preventDefault();
        var asset_item = {
            username: $('#username-edit').val(),
            category: {
                text: $('#select-category-edit option:selected').text(),
                value: $('#select-category-edit option:selected').val()
            },
            package: $('#goi-thau-edit').val(),
            unit: $('#select-unit-edit').val(),
            year: $('#select-year-edit').val(),
            serial_number: $('#serial-edit').val(),
            quantity: $('#quantity-edit').val(),
            brand: $('#brand-edit').val(),
            country: $('#country-edit').val(),
            manager: {
                text: $('#select-manager-edit option:selected').text(),
                value:$('#select-manager-edit option:selected').val()
            },
            use: {
                text: $('#select-user-edit option:selected').text(),
                value: $('#select-user-edit option:selected').val()
            },
            location: {
                text: $('#select-location-edit option:selected').text(),
                value: $('#select-location-edit option:selected').val()
            },
            status: $('#status').val(),
            note: $('#note').val(),
            history: []
        }
        var id = $('#serial-edit').attr('asset-id');
        if(asset_item.username == "" || asset_item.username == null ){
            showNoti(3,"Bạn chưa nhập đủ thông tin cần thiết")
        } else{
            updateAsset(asset_item,id);
        }
    })



    function addAsset(asset) {
        $.ajax('/assets', {
            type: 'POST',
            data: asset
        }).success(function (res) {
            if (res.code == "3") {
                showNoti(4, "Thêm tài sản thành công");
            }
            else if (res.code == "1") {
                showNoti(3, "Serial Number đã tồn tại");
            } else if(res.code == "0"){
                console.log('ko xd')
                showNoti(3, "Hệ thống gặp lỗi");
            }
        }).error(function (err) {
            console.log(err)
            showNoti(3, "Hệ thống gặp lỗi");
        });
    }

    function updateAsset(newAsset, id) {
        $.ajax('/admin/assets/' + id, {
            method: 'PUT',
            data: newAsset
        }).success(function (res) {
            if (res.status == "success") {
                showNoti(4, "Sửa thông tin tài sản thành công!");
                clearDataEditForm();
                addDataToEditForm(newAsset);
                console.log(newAsset);
                addTblHistory(res.result);
            }
            else if(res.status == '4'){
                showNoti(3, "Serial Number bị trùng");
                console.log(res.message);
            } else{
                showNoti(3, "Lỗi hệ thống");
            }
        }).error(function (err) {
            console.log(err);
        });
    }


    getAllAssets();

    var asset = [];

    function getAllAssets() {
        $.ajax('/admin/assets', {
            method: 'GET'
        }).success(function (res) {
            if (res.code == '1') {
                asset = [];
                for (var i = 0; i < res.result.length; i++) {
                    asset.push(res.result[i]);
                }
                convertDataToAssetTable(asset);
            }
            else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function convertDataToAssetTable(assets) {
        var assetTmp = [];
        for (var i = 0; i < assets.length; i++) {
            var tmp = {
                username: assets[i].username,
                category: {
                    text: assets[i].category.text,
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
                quantity: assets[i].quantity,
                edit: "<a class ='btn-edit' asset-id='" + assets[i].id + "' href='#'><i class='fa fa-info-circle' style='font-size:20px'></i></a>",
                history: assets[i].history
            }
            assetTmp.push(tmp);
        }
        addAssetToTable(assetTmp);
    }




    function deleteAsset(id) {
        $.ajax("/assets/" + id, {
            method: "DELETE"
        }).success(function (res) {
            if (res.status == "success") {
                showNoti(4, "Xóa tài sản thành công!");
                getAllAssets();
            }
        }).error(function (err) {
            console.log(err);
        })
    }






    function showNoti(type, text) {
        if (type == 1) {
            Lobibox.notify('info', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else if (type == 2) {
            Lobibox.notify('warning', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else if (type == 3) {
            Lobibox.notify('error', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else {
            Lobibox.notify('success', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
    }
});

//----------------------------------------------exception data----------------------------------------------------//
//check data is mail
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

//check data contain number
function containsNumber(data) {
    var pattern = /\d/;
    return pattern.test(data);
};

//check data is number
function isNumber(data) {
    var intRegex = /^\d+$/;
    var floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
    if (intRegex.test(data) || floatRegex.test(data)) {
        return true;
    }
    return false
};