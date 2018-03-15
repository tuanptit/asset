$(document).ready(function () {

    var t = $('#tbl-info-employees').DataTable({
        "retrieve": true,
        "ordering": true,
        "info": false,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,
        "fnDrawCallback": function (oSettings) {
            bindActionTable();
        }
    });

    actionSideBar();
    function actionSideBar() {
        $("#li-admin-employee").attr("class", "active");
        $("#li-admin-commission").attr("class", "");
        $("#li-admin-add-state").attr("class", "");
        $("#li-admin-statistical").attr("class", "");
    }
    bindActionTable();

    function bindActionTable() {
        $('#btn-add-employee').unbind();
        $('#btn-add-employee').click(function (event) {
            if ($('#btn-add-employee').text() == "Thêm") {
                $("#div-tbl-info-employee").hide();
                $("#form-add-employee").show();
                $('#btn-add-employee').text("Quay lại");
            } else {
                $("#div-tbl-info-employee").show();
                if ($("#form-add-employee").css("display") == "block") {
                    $("#form-add-employee").hide();
                    $("#btn-add-employee").text("Thêm");
                } else if ($("#form-edit-employee").css("display") == "block") {
                    $("#form-edit-employee").hide();
                    $("#btn-add-employee").text("Thêm");
                }
            }
        });

        $(".btn-edit").unbind();
        $(".btn-edit").click(function (event) {
            event.preventDefault();
            $("#div-tbl-info-employee").hide();
            $("#form-edit-employee").show();
            $("#ul-link").append("<li class='active'><a href='#'>Sửa</a></li>");
            $("#btn-add-employee").text("Quay lại");
            var idEmployee = $(this).attr("employee-id");
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].id == idEmployee) {
                    $("#btn-edit-employee").attr("employee-id", employees[i].id);
                    clearDataEditForm();
                    addDataToEditForm(employees[i]);
                    validEditForm();
                    break;
                }
            }
        });

        $(".btn-delete").unbind();
        $(".btn-delete").click(function () {
            var idEmployee = $(this).attr("employee-id");
            $("#confirm").attr("employee-id", idEmployee);
        });

        $("#confirm").unbind();
        $("#confirm").click(function () {
            var idEmployee = $(this).attr("employee-id");
            $("#myModal").modal("hide");
            deleteEmployee(idEmployee);
        });
    }

    $('#btn-edit-employee').click(function (event) {
        var tmp = 1;
        for(var i = 0 ; i < check_edit.length; i++) {
            console.log(i+":"+check_edit[i]);
            if(check_edit[i] == 0) {
                tmp = 0;
                break;
            }
        }
        if(tmp == 1) {
            var employee = {
                username: $('#username-edit').val(),
                role: $('#select-role-edit').val(),
                name: $('#name-edit').val(),
                phone: $('#phone-edit').val(),
                address: $('#address-edit').val(),
                email: $('#email-edit').val()
            }
            if($('#password-edit').val().length > 0) {
                employee.password = $('#password-edit').val();
            }
            var employeeId = $(this).attr("employee-id");
            editEmployee(employee, employeeId);
        } else {
            showNoti(2, "Dữ liệu chưa đúng");
        }

    })

    clearDataForm();

    function clearDataForm() {
        $("#label-status-username").hide();
        $("#username").val("");

        $("#label-status-name").hide();
        $("#name").val("");

        $("#label-status-address").hide();
        $("#address").val("");

        $("#label-status-email").hide();
        $("#email").val("");

        $("#label-status-identification-card").hide();
        $("#identification-card").val("");

        $("#label-status-phone").hide();
        $("#phone").val("");

        $("#label-status-password").hide();
        $("#password").val("");

        $("#label-status-repeat-password").hide();
        $("#repeat-password").val("");
    }
    function clearDataEditForm() {
        $("#username-edit").val("");
        $("#label-status-username-edit").hide();
        $("#role-edit").val("");
        $("#label-status-name-edit").hide();
        $("#name-edit").val("");
        $("#label-status-address-edit").hide();
        $("#address-edit").val("");
        $("#label-status-email-edit").hide();
        $("#email-edit").val("");
        $("#label-status-phone-edit").hide();
        $("#phone-edit").val("");
        $("#label-status-password-edit").hide();
        $("#password-edit").val("");
        $("#label-status-repeat-password-edit").hide();
        $("#repeat-password-edit").val("");
    }
    function addDataToEditForm(employee) {
        console.log(employee);
        $("#username-edit").val(employee.username);
        $("#name-edit").val(employee.name);
        $("#address-edit").val(employee.address);
        $("#phone-edit").val(employee.phone);
        $("#email-edit").val(employee.email);
        $('#select-role-edit option[value='+employee.role+']').attr('selected','selected');
    }


    var check = [0,0,0,0,0,0,0];
    var check_edit = [1,1,1,1,1,1,1];
    $('#btn-submit-employee').click(function (event) {
        event.preventDefault();
        var tmp = 1;
        for( var i = 0 ; i <check.length; i++) {
            console.log(check[i]);
            if(check[i] == 0){
                tmp = 0;
                break;
            }
        }
        if(tmp == 1) {
            var employee = {
                username: $('#username').val(),
                role: $('#select-role').val(),
                name: $('#name').val(),
                phone: $('#phone').val(),
                address: $('#address').val(),
                email: $('#email').val(),
                password: $('#password').val()
            }
            addEmployee(employee);
        } else {
            showNoti(2, "Dữ liệu chưa đúng");
        }
    });

    function addEmployee(employee) {
        $.ajax('/employees', {
            type: 'POST',
            data: employee
        }).success(function (res) {
            if (res.code == "3") {
                showNoti(4, "Thêm nhân viên thành công");
            }
            else if (res.code == "1") {
                showNoti(3, "Tên đăng nhập đã tồn tại");
            } else {
                showNoti(3, "Hệ thống gặp lỗi");
            }
        }).error(function (err) {
            showNoti(3, "Hệ thống gặp lỗi");
        });
    }

    function editEmployee(employee, id) {
        $.ajax('/employees/'+ id, {
            type: 'PUT',
            data: employee
        }).success(function (res) {
            if(res.status ='success') {
                showNoti(4, "Sửa thông tin nhân viên thành công");
            }
        }).error(function (err) {
            showNoti(3, "Hệ thống gặp lỗi");
        });
    }

    getAllEmployees();

    var employees = [];

    function getAllEmployees() {
        $.ajax('/admin/employees', {
            method: 'GET'
        }).success(function (res) {
            if (res.code == '1') {
                employees = [];
                for (var i = 0; i < res.result.length; i++) {
                    employees.push(res.result[i]);
                }
                convertDataToEmployeesTable(employees);
            }
            else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function convertDataToEmployeesTable(employees) {
        var employeesTmp = [];
        for (var i = 0; i < employees.length; i++) {
            var employee = {
                id: employees[i]._id,
                username: employees[i].username,
                name: employees[i].name,
                address: employees[i].address,
                phone: employees[i].phone,
                email: employees[i].email,
                role: '',
                edit: "<a class ='btn-edit' employee-id='" + employees[i].id + "' href='#'><i class='fa fa-pencil-square-o'></i></a>",
                delete: "<a class ='btn-delete' employee-id='" + employees[i].id + "' href='#'><i class='icon-remove3' data-toggle='modal' data-target='#myModal'></i></a>"
            }
            if(employees[i].role == '1') {
                employee.role = 'ADMIN'
            } else {
                employee.role = 'XEM'
            }
            employeesTmp.push(employee);
        }
        addEmployeesToTable(employeesTmp);
    }




    function deleteEmployee(id) {
        $.ajax("/employees/" + id, {
            method: "DELETE"
        }).success(function (res) {
            if (res.status == "success") {
                showNoti(4, "Xóa nhân viên thành công");
                getAllEmployees();
            }
        }).error(function (err) {
            console.log(err);
        })
    }

    function addEmployeesToTable(employees) {
        if (employees.length != 0) {
            t.clear();
            employees.forEach(function (value, index) {
                t.row.add([value.username, value.name, value.phone, value.role, value.email, value.address, value.edit,value.delete
                ]).draw(false);
            });
            $("#tbl-info-employees tr").attr("class", "success");
        }
        else {
            $('#body-info-employees').empty();
        }
        bindActionTable();
    }

    validForm();

    function validForm() {
        $("#username").on("input", function () {
            var input = $(this);
            var username = input.val();
            if (username != "" && username.length >3) {
                $('#label-status-username').attr("class", "status-input-label success");
                $('#label-status-username').show();
                $('#icon-status-username').attr("class", "fa fa-check success");
                $('#text-status-username').text('');
                check[0] =1;
            } else {
                $('#label-status-username').attr("class", "status-input-label warning");
                $('#label-status-username').show();
                $('#icon-status-username').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-username').attr("class", "warning");
                $('#text-status-username').text('Tên đăng nhập phải lớn hơn 3 ký tự')
                check[1] = 0
            }
        });

        $("#name").on("input", function () {
            var input = $(this);
            var name = input.val();
            if (name != "" && name.length > 3) {
                $('#label-status-name').attr("class", "status-input-label success");
                $('#label-status-name').show();
                $('#icon-status-name').attr("class", "fa fa-check success");
                $('#text-status-name').text('');
                check[1] = 1;
            } else {
                $('#label-status-name').attr("class", "status-input-label warning");
                $('#label-status-name').show();
                $('#icon-status-name').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-name').attr("class", "warning");
                $('#text-status-name').text('Tên nhân viên phải lớn hơn 3 ký tự');
                check[1] = 0;
            }
        });

        $("#phone").on("input", function () {
            var input = $(this);
            var phone = input.val();
            if (phone == "") {
                $('#label-status-phone').hide();
                check[2] =1;
            }
            else if (isNumber(phone)) {
                if (phone.length == 11 || phone.length == 10) {
                    $('#label-status-phone').attr("class", "status-input-label success");
                    $('#label-status-phone').show();
                    $('#icon-status-phone').attr("class", "fa fa fa-check success");
                    $('#text-status-phone').text('');
                    check[2] =1;
                }
                else {
                    $('#label-status-phone').attr("class", "status-input-label warning");
                    $('#label-status-phone').show();
                    $('#icon-status-phone').attr("class", "fa fa-times-circle-o warning");
                    $('#text-status-phone').attr("class", "warning");
                    $('#text-status-phone').text('Số điện thoại không đúng định dạng');
                    check[2] =0;
                }
            } else {
                $('#label-status-phone').attr("class", "status-input-label warning");
                $('#label-status-phone').show();
                $('#icon-status-phone').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-phone').attr("class", "warning");
                $('#text-status-phone').text('Số điện thoại không đúng định dạng');
                check[2] =0;
            }
        });

        $("#address").on("input", function () {
            var input = $(this);
            var address = input.val();
            if (address != "" && address.length > 3) {
                $('#label-status-address').attr("class", "status-input-label success");
                $('#label-status-address').show();
                $('#icon-status-address').attr("class", "fa fa-check success");
                $('#text-status-address').text('');
                check[3] =1;
            } else {
                $('#label-status-address').attr("class", "status-input-label warning");
                $('#label-status-address').show();
                $('#icon-status-address').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-address').attr("class", "warning");
                $('#text-status-address').text('Đơn vị công tác phải lớn hơn 3 ký tự');
                check[3] =0;
            }
        });
        $("#email").on("input", function () {
            var input = $(this);
            var email = input.val();
            if (email == "") {
                $('#label-status-email').hide();
                check[4] = 1;
            }
            else if (isValidEmailAddress(email)) {
                $('#label-status-email').attr("class", "status-input-label success");
                $('#label-status-email').show();
                $('#icon-status-email').attr("class", "fa fa fa-check success");
                $('#text-status-email').text('');
                check[4] = 1;
            } else {
                $('#label-status-email').attr("class", "status-input-label warning");
                $('#label-status-email').show();
                $('#icon-status-email').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-email').attr("class", "warning");
                $('#text-status-email').text('Email không đúng định dạng');
                check[4] = 0;
            }
        });

        $("#password").on("input", function () {
            var input = $(this);
            var password = input.val();
            if (password != "") {
                if (password.length >= 6) {
                    $('#label-status-password').attr("class", "status-input-label success");
                    $('#label-status-password').show();
                    $('#icon-status-password').attr("class", "fa fa fa-check success");
                    $('#text-status-password').text('');
                    check[5] = 1;
                }
                else {
                    $('#label-status-password').attr("class", "status-input-label warning");
                    $('#label-status-password').show();
                    $('#icon-status-password').attr("class", "fa fa-times-circle-o warning");
                    $('#text-status-password').attr("class", "warning");
                    $('#text-status-password').text('Mật khẩu phải nhiều hơn 6 kí tự');
                    check[5] = 0;
                }
            } else {
                    $('#label-status-password').attr("class", "status-input-label warning");
                    $('#label-status-password').show();
                    $('#icon-status-password').attr("class", "fa fa-times-circle-o warning");
                    $('#text-status-password').attr("class", "warning");
                    $('#text-status-password').text('Mật khẩu không được để trống');
                check[5] = 0;
            }
        });

        $("#repeat-password").on("input", function () {
                var input = $(this);
                var repeatPassword = input.val();
                var password = $("#password").val();
                if (password != "") {
                    if (repeatPassword == password) {
                        $('#label-status-repeat-password').attr("class", "status-input-label success");
                        $('#label-status-repeat-password').show();
                        $('#icon-status-repeat-password').attr("class", "fa fa fa-check success");
                        $('#text-status-repeat-password').text('');
                        check[6] = 1;
                    }
                    else {
                        $('#label-status-repeat-password').attr("class", "status-input-label warning");
                        $('#label-status-repeat-password').show();
                        $('#icon-status-repeat-password').attr("class", "fa fa-times-circle-o warning");
                        $('#text-status-repeat-password').attr("class", "warning");
                        $('#text-status-repeat-password').text('Mật khẩu nhập lại không đúng');
                        check[6] = 0;
                    }
                }
                else {
                    $('#label-status-repeat-password').hide();
                }
            }
        );

    }


    function validEditForm() {
        $("#username-edit").on("input", function () {
            var input = $(this);
            var username = input.val();
            for(var i = 0; i < check_edit.length; i++) {
                console.log(check_edit[i]);
            }
            if (username != "" && username.length >3) {
                $('#label-status-username-edit').attr("class", "status-input-label success");
                $('#label-status-username-edit').show();
                $('#icon-status-username-edit').attr("class", "fa fa-check success");
                $('#text-status-username-edit').text('');
                check_edit[0] =1;
            } else {
                $('#label-status-username-edit').attr("class", "status-input-label warning");
                $('#label-status-username-edit').show();
                $('#icon-status-username-edit').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-username-edit').attr("class", "warning");
                $('#text-status-username-edit').text('Tên đăng nhập phải lớn hơn 3 ký tự')
                check_edit[0] = 0
            }
        });

        $("#name-edit").on("input", function () {
            var input = $(this);
            var name = input.val();
            if (name != "" && name.length > 3) {
                $('#label-status-name-edit').attr("class", "status-input-label success");
                $('#label-status-name-edit').show();
                $('#icon-status-name-edit').attr("class", "fa fa-check success");
                $('#text-status-name-edit').text('');
                check_edit[1] = 1;
            } else {
                $('#label-status-name-edit').attr("class", "status-input-label warning");
                $('#label-status-name-edit').show();
                $('#icon-status-name-edit').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-name-edit').attr("class", "warning");
                $('#text-status-name-edit').text('Tên nhân viên phải lớn hơn 3 ký tự');
                check_edit[1] = 0;
            }
        });

        $("#phone-edit").on("input", function () {
            var input = $(this);
            var phone = input.val();
            if (phone == "") {
                $('#label-status-phone-edit').hide();
                check_edit[2] =1;
            }
            else if (isNumber(phone)) {
                if (phone.length == 11 || phone.length == 10) {
                    $('#label-status-phone-edit').attr("class", "status-input-label success");
                    $('#label-status-phone-edit').show();
                    $('#icon-status-phone-edit').attr("class", "fa fa fa-check success");
                    $('#text-status-phone-edit').text('');
                    check_edit[2] =1;
                }
                else {
                    $('#label-status-phone-edit').attr("class", "status-input-label warning");
                    $('#label-status-phone-edit').show();
                    $('#icon-status-phone-edit').attr("class", "fa fa-times-circle-o warning");
                    $('#text-status-phone-edit').attr("class", "warning");
                    $('#text-status-phone-edit').text('Số điện thoại không đúng định dạng');
                    check_edit[2] =0;
                }
            } else {
                $('#label-status-phone-edit').attr("class", "status-input-label warning");
                $('#label-status-phone-edit').show();
                $('#icon-status-phone-edit').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-phone-edit').attr("class", "warning");
                $('#text-status-phone-edit').text('Số điện thoại không đúng định dạng');
                check_edit[2] =0;
            }
        });

        $("#address-edit").on("input", function () {
            var input = $(this);
            var address = input.val();
            if (address != "" && address.length > 3) {
                $('#label-status-address-edit').attr("class", "status-input-label success");
                $('#label-status-address-edit').show();
                $('#icon-status-address-edit').attr("class", "fa fa-check success");
                $('#text-status-address-edit').text('');
                check_edit[3] =1;
            } else {
                $('#label-status-address-edit').attr("class", "status-input-label warning");
                $('#label-status-address-edit').show();
                $('#icon-status-address-edit').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-address-edit').attr("class", "warning");
                $('#text-status-address-edit').text('Đơn vị công tác phải lớn hơn 3 ký tự');
                check_edit[3] =0;
            }
        });
        $("#email-edit").on("input", function () {
            var input = $(this);
            var email = input.val();
            if (email == "") {
                $('#label-status-email-edit').hide();
                check_edit[4] = 1;
            }
            else if (isValidEmailAddress(email)) {
                $('#label-status-email-edit').attr("class", "status-input-label success");
                $('#label-status-email-edit').show();
                $('#icon-status-email-edit').attr("class", "fa fa fa-check success");
                $('#text-status-email-edit').text('');
                check_edit[4] = 1;
            } else {
                $('#label-status-email-edit').attr("class", "status-input-label warning");
                $('#label-status-email-edit').show();
                $('#icon-status-email-edit').attr("class", "fa fa-times-circle-o warning");
                $('#text-status-email-edit').attr("class", "warning");
                $('#text-status-email-edit').text('Email không đúng định dạng');
                check_edit[4] = 0;
            }
        });

        $("#password-edit").on("input", function () {
            var input = $(this);
            var password = input.val();
            if(password.length == 0) {
                console.log('aaa');
                $('#label-status-password-edit').hide();
                check_edit[5] =1;
            }
            if (password != "") {
                if (password.length >= 6) {
                    $('#label-status-password-edit').attr("class", "status-input-label success");
                    $('#label-status-password-edit').show();
                    $('#icon-status-password-edit').attr("class", "fa fa fa-check success");
                    $('#text-status-password-edit').text('');
                    check_edit[5] = 1;
                }
                else {
                    $('#label-status-password-edit').attr("class", "status-input-label warning");
                    $('#label-status-password-edit').show();
                    $('#icon-status-password-edit').attr("class", "fa fa-times-circle-o warning");
                    $('#text-status-password-edit').attr("class", "warning");
                    $('#text-status-password-edit').text('Mật khẩu phải nhiều hơn 6 kí tự');
                    check_edit[5] = 0;
                }
            }
        });

        $("#repeat-password-edit").on("input", function () {
                var input = $(this);
                var repeatPassword = input.val();
                var password = $("#password-edit").val();
                if (password.length >0) {
                    if (repeatPassword == password) {
                        $('#label-status-repeat-password-edit').attr("class", "status-input-label success");
                        $('#label-status-repeat-password-edit').show();
                        $('#icon-status-repeat-password-edit').attr("class", "fa fa fa-check success");
                        $('#text-status-repeat-password-edit').text('');
                        check_edit[6] = 1;
                    }
                    else {
                        $('#label-status-repeat-password-edit').attr("class", "status-input-label warning");
                        $('#label-status-repeat-password-edit').show();
                        $('#icon-status-repeat-password-edit').attr("class", "fa fa-times-circle-o warning");
                        $('#text-status-repeat-password-edit').attr("class", "warning");
                        $('#text-status-repeat-password-edit').text('Mật khẩu nhập lại không đúng');
                        check_edit[6] = 0;
                    }
                }
                else {
                    $('#label-status-repeat-password-edit').hide();
                }
            }
        );

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