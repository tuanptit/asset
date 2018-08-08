$(document).ready(function () {

    var t = $("#tbl-info-asset").DataTable({
        ajax: {
            url: "/admin/assets",
            dataSrc: 'result'
        },
        "retrieve": true,
        "lengthMenu": [5, 10, 50, 100],
        paging: false,
        "scrollX": true,
        dom: 'Bfrtip',
        "processing": true,
        columns: [
            { data: "username"},
            { data: "system.name"},
            { data: "route.name" },
            { data: "serial_number"},
            { data: "category.name" },
            { data: "location.name" },
            { data: "package" },
            { data: "unit" },
            { data: "quantity" },
            { data: "year" },
            { data: "brand" },
            { data: "country" },
            { data: "note" },
            { data: "manager.name" },
            { data: "use.name" },
            { data: "status" },
            { data: "command"}
        ],
        buttons: [{
            extend: 'excelHtml5',
            text: 'Export',
            exportOptions: {
                columns: [ 0, 1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15 ]
            },
            title: 'Data export'
        },{
            extend: 'copyHtml5'
        }],

        "processing": true,
        columnDefs: [{
            // puts a button in the last column
            targets: [-1], render: function (data, type, row, meta) {
                var ID = row['id'];
                return "<a class ='btn-edit' asset-id='" + ID + "' href='#'><i class='icon-pencil'></i></a>"+
                    "<a class ='btn-delete' asset-id='" + ID + "' href='#'><i class='icon-remove3' data-toggle='modal' data-target='#myModal'></i></a>";
            }
        }],

    });

    var tbl_history = $('#tbl-asset-history').DataTable({
        "retrieve": true
    });

    function addTblHistory(asset) {
        var history = asset.history;x
        if(history.length !=0) {
            tbl_history.clear();
            history.forEach(function (value, index) {
                var action ="";
                if(value.code == 1) {
                    action = "<span class='label label-info'>Đổi tên</span>";
                } else if (value.code == 2) {
                    action = "<span class='label label-success'>Đổi hệ thống thiết bị</span>";
                } else if(value.code == 3) {
                    action = "<span class='label label-danger'>Đổi đơn vị quản lý</span>";
                } else if(value.code == 4) {
                    action = "<span class='label label-warning'>Đổi đơn vị sử dụng</span>";
                }else if(value.code == 5) {
                    action = "<span class='label label-info'>Đổi vị trí lắp đặt</span>";
                }else if(value.code == 6) {
                    action = "<span class='label label-success'>Đổi gói thầu</span>";
                }else if(value.code == 7) {
                    action = "<span class='label label-danger'>Đổi đơn vị</span>";
                }else if(value.code == 8) {
                    action = "<span class='label label-warning'>Đổi số lượng</span>";
                }else if(value.code == 9) {
                    action = "<span class='label label-info'>Đổi năm sử dụng</span>";
                }else if(value.code == 10) {
                    action = "<span class='label label-success'>Đổi Serial Number</span>";
                }else if(value.code == 11) {
                    action = "<span class='label label-danger'>Đổi nhãn hiệu</span>";
                }else if(value.code == 12) {
                    action = "<span class='label label-warning'>Đổi nước sản xuất</span>";
                }
                else if(value.code == 66) {
                    action = "<span class='label label-info'>Đổi tuyến</span>";
                }
                else if(value.code == 88) {
                    action = "<span class='label label-warning'>Đổi vị trí trên hệ thống</span>";
                }
                else {
                    action = "<span class='label label-warning'>Đổi ghi chú</span>";
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
                var unit = '';
                if(value.status == '1') {
                    mStatus = "<span class='label label-success'>Active</span>"
                } else if(value.status == '2') {
                    mStatus = "<span class='label label-warning'>Maintenance</span>"
                } else {
                    mStatus= "<span class='label label-danger'>Inactive</span>"
                }
                if(value.unit == "1") {
                    unit = 'Cái'
                } else if(value.unit=="2") {
                    unit ='Bao'
                } else {
                    unit ='Thùng'
                }
                var category ="", route ="", system="", location="", use="", manager="";
                if(value.category!=null && value.category!="") {
                    category = getPropertyById(value.category);
                }
                if(value.route!=null && value.route!="") {
                    route = getPropertyById(value.route);
                }
                if(value.system!=null && value.system!="") {
                    system = getPropertyById(value.system);
                }
                if(value.location!=null && value.location!="") {
                    location = getPropertyById(value.location);
                }
                if(value.manager!=null && value.manager!=""){
                    // manager =
                }
                console.log(value)
                t.row.add([value.username, system, route, value.serial_number, category, location,
                    mStatus, value.package, unit,value.quantity, value.year, value.brand, value.country,
                    value.note ,manager, use, value.edit, value.delete
                ]).draw(false);
            });
        }
        else {
            $('#body-info-asset').empty();
        }
        bindActionTable();
    }
    function getPropertyById(id) {
        var name = "";
        $.ajax('/property/'+id, {
            method: "GET",
            async: false
        }).success(function (res) {
            if (res.code == "1") {
                name = (res.result.name);
            } else {
                name ="";
            }
        }).error(function (err) {
            name = ""
        });
        return name;
    }
    t.columns( [6,7, 8,9,10,11,12,13 ] ).visible( false, false );
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
        $('#btn-import').unbind();
        $('#btn-import').click(function () {
            var file_data = $('#file').prop('files')[0];
            var form_data = new FormData();
            form_data.append('file', file_data);
            $.ajax({
                url: 'upload', // point to server-side PHP script
                dataType: 'json',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                success: function(respone){
                    console.log(respone)
                    $('#import-status').empty();
                    var status_import = respone.result;
                    var time = 0;
                    var success = 0;
                    for(var i = 0; i< status_import.length;i++) {
                        if(status_import[i].code == 0) {
                            success++;
                        }
                        apperance(i, status_import[i]);
                        time = 1000+ i*1000;
                    }
                    setTimeout(function () {
                        $('#import-status').append('<div class="bg-success with-padding block-inner">Import thành công '+success+'/'+status_import.length+' tài sản.</div>')
                    }, time+1000)

                    $("#myUpload").modal("hide");
                    // getAllAssets();

                    showNoti(2,"Upload thành công! Đang xử lý...")
                }
            });
        })
        function apperance(i, data) {
            setTimeout(function()
            {
                if(data.code == 0) {
                    $('#import-status').append('<div class="alert alert-success fade in block-inner">\n' +
                        '                    <button type="button" class="close" data-dismiss="alert">×</button>\n' +
                        '                    <i class="icon-checkmark-circle"></i> '+data.status+'   ' +
                        '                </div>').fadeIn(1000);
                } else {
                    $('#import-status').append('<div class="alert alert-danger fade in block-inner">\n' +
                        '                    <button type="button" class="close" data-dismiss="alert">×</button>\n' +
                        '                    <i class="icon-cancel-circle"></i> '+data.status+' ' +
                        '                </div>').fadeIn(1000);
                }
            }, 1000+ i*1000);
        }

        $('#tbl-info-asset').on('click', '.btn-edit', function(){
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

        $('#tbl-info-asset').on('click', '.btn-delete', function(){
            event.preventDefault();
            console.log('aaaaaaaaaaa')
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

        getAllPropertiesOfCategory(asset,"select-category-edit", "category");
        getAllPropertiesOfCategory(asset,"select-manager-edit", "manager");
        getAllPropertiesOfCategory(asset,"select-user-edit", "use");
        getAllPropertiesOfCategory(asset,"select-location-edit", "location");
        getAllPropertiesOfCategory(asset,"select-system-edit", "system");
        getAllPropertiesOfCategory(asset,"select-route-edit", "route");
    }


    function getAllPropertiesOfCategory(asset, element, url) {
        $.ajax('/properties/'+url, {
            method: "GET"
        }).success(function (res) {
            if (res.status == "success") {
                var id = asset[url].id;
                var items = [];
                items = res.result;
                $('#'+element).find('option')
                    .remove()
                    .end();

                $('#'+element).append($('<option>', {
                    value: 0,
                    text : "Chọn"
                }));

                $.each(items, function (i, item) {
                    $('#'+element).append($('<option>', {
                        value: item.id,
                        text : item.name
                    }));
                });
                $('#'+element+' option[value="'+id+'"]').attr('selected','selected');
            } else {
                console.log(res);
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
                $('#'+element).append($('<option>', {
                    value: 0,
                    text: 'Chọn'
                }));
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
        $("#select-route").empty();
        $("#select-system").empty();

        getAllProperties('select-category','category');
        getAllProperties('select-manager','manager');
        getAllProperties('select-use','use');
        getAllProperties('select-location','location');
        getAllProperties('select-route','route');
        getAllProperties('select-system','system');

    }

    $('#btn-submit-asset').click(function (event) {
        event.preventDefault();
        var asset = {
            username: $('#username').val(),
            package: $('#goi-thau').val(),
            unit: $('#select-unit').val(),
            year: $('#select-year').val(),
            serial: $('#serial').val(),
            quantity: $('#quantity').val(),
            brand: $('#brand').val(),
            country: $('#country').val(),
            status: $('#status').val(),
            note: $('#note').val(),

            category: {},
            manager: '',
            use: '',
            location: '',
            route: '',
            system: ''
        }
        if ($('#select-category').prop('selectedIndex') > 0) {
            asset.category= $('#select-category option:selected').val();
        }

        if ($('#select-manager').prop('selectedIndex') > 0) {
            asset.manager = $('#select-manager option:selected').val();
        }
        if ($('#select-use').prop('selectedIndex') > 0) {
            asset.use = $('#select-use option:selected').val();
        }
        if ($('#select-location').prop('selectedIndex') > 0) {
            asset.location = $('#select-location option:selected').val();
        }

        if ($('#select-route').prop('selectedIndex') > 0) {
            asset.route = $('#select-route option:selected').val();
        }
        if ($('#select-system').prop('selectedIndex') > 0) {
            asset.system = $('#select-system option:selected').val();
        }
        if(asset.username == "") {
            showNoti(3, "Bạn chưa nhập đủ các trường cần thiết");
        } else {
            addAsset(asset);
        }

    });

    $('#btn-edit-asset').click(function (event) {
        event.preventDefault();
        var asset = {
            username: $('#username-edit').val(),
            package: $('#goi-thau-edit').val(),
            unit: $('#select-unit-edit').val(),
            year: $('#select-year-edit').val(),
            serial_number: $('#serial-edit').val(),
            quantity: $('#quantity-edit').val(),
            brand: $('#brand-edit').val(),
            country: $('#country-edit').val(),
            status: $('#status-edit').val(),
            note: $('#note-edit').val()
        }

        if ($('#select-category-edit').prop('selectedIndex') > 0) {
            asset.category = $('#select-category-edit option:selected').val();
        }

        if ($('#select-manager-edit').prop('selectedIndex') > 0) {
            asset.manager = $('#select-manager-edit option:selected').val();
        }
        if ($('#select-user-edit').prop('selectedIndex') > 0) {
            asset.use = $('#select-user-edit option:selected').val();
        }
        if ($('#select-location-edit').prop('selectedIndex') > 0) {
            asset.location = $('#select-location-edit option:selected').val();
        }

        if ($('#select-route-edit').prop('selectedIndex') > 0) {
            asset.route = $('#select-route-edit option:selected').val();
        }
        if ($('#select-system-edit').prop('selectedIndex') > 0) {
            asset.system = $('#select-system-edit option:selected').val();
        }
        var id = $('#serial-edit').attr('asset-id');
        console.log(asset)
        if(asset.username == "" || asset.username == null ){
            showNoti(3,"Bạn chưa nhập đủ thông tin cần thiết")
        } else{
            updateAsset(asset,id);
        }
    })



    function addAsset(asset) {
        $.ajax('/assets', {
            type: 'POST',
            data: asset
        }).success(function (res) {
            console.log(res)
            if (res.code == "3") {
                showNoti(4, "Thêm tài sản thành công");
            }
            else if (res.code == "1") {
                showNoti(3, "Serial Number đã tồn tại");
            } else{
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
            console.log(res)
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
                //convertDataToAssetTable(asset);
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
                category:assets[i].category,
                package: assets[i].package,
                unit: assets[i].unit,
                year: assets[i].year,
                serial_number: assets[i].serial_number,
                brand: assets[i].brand,
                country: assets[i].country,
                manager: assets[i].manager,
                route: assets[i].route,
                system: assets[i].system,
                use: assets[i].use,
                location: assets[i].location,
                status: assets[i].status,
                note: assets[i].note,
                quantity: assets[i].quantity,
                edit: "<a class ='btn-edit' asset-id='" + assets[i].id + "' href='#'><i class='fa fa-info-circle' style='font-size:20px'></i></a>",
                delete: "<a class ='btn-delete' asset-id='" + assets[i].id + "' href='#'><i class='icon-remove3' data-toggle='modal' data-target='#myModal'></i></a>",
                history: assets[i].history
            }
            assetTmp.push(tmp);
        }
        //addAssetToTable(assetTmp);
    }




    function deleteAsset(id) {
        $.ajax("/assets/" + id, {
            method: "DELETE"
        }).success(function (res) {
            if (res.status == "success") {
                showNoti(4, "Xóa tài sản thành công!");
                t.ajax.reload();
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