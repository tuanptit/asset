$(document).ready(function () {
    actionSideBar();
    bindActionForm();
    function actionSideBar() {
        $("#li-admin-employee").attr("class", "");
        $("#li-admin-commission").attr("class", "");
        $("#li-admin-add-state").attr("class", "active");
        $("#li-admin-statistical").attr("class", "");
    }

    getAllCategories();
    // getAllManager();
    // getAllLocation();
    // getAllUser();

    // get all cate

    var list = [];
    function getAllCategories() {
        $.ajax('/upcate', {
            method: 'GET',
            dataType: 'json'
        }).success(function (res) {
            list = (res.result);
            insertDataToTable(list);
            bindActionTableCategory();
        }).error(function (err) {
            console.log(err);
        });
    }

    function insertDataToTable(list) {
        var table = $('.tbody-info-cates > tbody:last-child');
        for(var i = 0 ; i < list.length; i++) {
            if(i%2 != 0){
                table.append("<tr>" +
                    "<td>"+(i+1)+"</td>" +
                    "<td>"+list[i].name+"</td>" +
                    "<td><a class='btn-show'><i id-cate='"+list[i].id+"' name-cate='"+list[i].name+"' class='fa fa-arrow-circle-right btn-show'></i></a></td>" +
                    "</tr>");
            } else {
                table.append("<tr class='success'>" +
                    "<td>"+(i+1)+"</td>" +
                    "<td>"+list[i].name+"</td>" +
                    "<td><a class='btn-show'><i id-cate='"+list[i].id+"' name-cate='"+list[i].name+"' class='fa fa-arrow-circle-right btn-show'></i></a></td>" +
                    "</tr>");
            }

        }
    }


    function bindActionTableCategory() {
        $(".btn-show").unbind();
        $(".btn-show").click(function (event) {
            event.preventDefault();
            var cateId = $(this).attr("id-cate");
            var cateName = $(this).attr("name-cate");
            $("#form-add-property").show();
            $("#form-add-property").find(".panel-title").text(cateName);
            $("#btn-add-property").attr("category", cateId);
            $("#property").val("");
            //console.log(cateId);
            if(cateId != null) {
                getAllPropertyByCategory(cateId);
            }
        });
    }

    function bindDeleteAction() {
        $(".btn-delete").unbind();
        $(".btn-delete").click(function () {
            var idProperty = $(this).attr("properties-id");
            $("#confirm").attr("properties-id", idProperty);
        });

        $("#confirm").unbind();
        $("#confirm").click(function () {
            var idProperty = $(this).attr("properties-id");
            $("#myModal").modal("hide");
            var categoryId = $("#btn-add-property").attr("category");
            deleteProperty(idProperty, categoryId);
        });
        bindActionEdit();
        bindActionSave();
    }
    
    function bindActionSave() {
        $(".btn-save-property").unbind();
        $(".btn-save-property").click(function () {
            $(this).find('i').removeClass('fa-arrow-circle-right');
            $(this).find('i').addClass('fa-pencil-square');
            var id = $(this).attr('properties-id');
            var name = $('input[input-id="'+id+'"]').val();
            var property = {
                name: name
            }
            $('.name-text[text-id="'+id+'"]').css("display","block");
            $('.input-text[input-id="'+id+'"]').css("display","none");
            bindActionEdit();
            editProperty(property, id);
        });
    }
    function bindActionEdit() {
        $(".btn-edit").unbind();
        $(".btn-save-property").unbind();
        $(".btn-edit").click(function () {
            var id = $(this).attr('properties-id');
            $('.name-text[text-id="'+id+'"]').css("display","none");
            $('.input-text[input-id="'+id+'"]').css("display","block");
            $(this).find('i').removeClass('fa-pencil-square');
            $(this).find('i').addClass('fa-arrow-circle-right');
            $(this).removeClass('btn-edit');
            $(this).addClass('btn-save-property');
            bindActionSave();
        });
    }

    function editProperty(property, id) {
        console.log(name)
        $.ajax('/admin/property/'+ id, {
            type: 'PUT',
            data: property
        }).success(function (res) {
            if(res.status ='success') {
                var new_name = res.result.name;
                var id = res.result._id;
                $('.name-text[text-id="'+id+'"]').text(new_name)
                showNoti(4, "Sửa thuộc tính thành công");
            }
        }).error(function (err) {
            showNoti(3, "Hệ thống gặp lỗi");
        });
    }

    function deleteProperty(id, category) {
        $.ajax("/property/" + id+"/category/"+category, {
            method: "DELETE",
        }).success(function (res) {
            if (res.status == "success") {
                showNoti(4, "Xóa thuộc tính thành công!");
                getAllPropertyByCategory(category);
            }
        }).error(function (err) {
            console.log(err);
        })
    }

    var properties = [];
    function getAllPropertyByCategory(cateId) {
        $.ajax('/' + cateId + '/properties', {
            method: "GET"
        }).success(function (res) {
            if (res.status == "success") {
                properties = [];
                for (var i = 0; i < res.result.length; i++) {
                    properties.push(res.result[i]);
                }
                addPropertiesToTable(properties);
                bindDeleteAction();
            } else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }



    function addPropertiesToTable(properties) {
        console.log(properties)
        $("#tbody-info-properties").empty();
        var tbody = "";
        for (var i = 0; i < properties.length; i++) {
            tbody += "<tr> " +
                "<th class='col-md-5'>" + (Math.floor(i) + 1) + "</th> " +
                "<th class='col-md-7'><p class='name-text' text-id='"+properties[i].id+"'>"+properties[i].name+"</p><input input-id='"+properties[i].id+"' class='input-text' type='text' name='property_name' value='"+properties[i].name+"' style='display: none;'></th> " +
                "<th><a class='btn-edit' properties-id='"+properties[i].id+"' href='#'> <i class='fa fa-pencil-square'></i></a></th>"+
                "<th><a class='btn-delete' properties-id='"+properties[i].id+"' href='#' data-toggle='modal' data-target='#myModal'><i class='fa fa-times'></i></a></th>"+
                "</tr>";
        }

        $("#tbody-info-properties").append(tbody);
        bindDeleteAction();
        bindActionSave();
        bindActionEdit();
    }
    function bindActionForm() {
        $("#btn-add-property").unbind();
        $("#btn-add-property").click(function (event) {
            event.preventDefault();
            var property = $("#property").val();
            if (property != "") {
                var cate = $(this).attr("category");
                addProperty(cate, property);
                $("#property").val("");
            }
        });
    }

    function addProperty(category, property) {
        $.ajax('/property', {
            method: "POST",
            data: {
                category: category,
                name: property
            }
        }).success(function (res) {
            if (res.status == "success") {
                $("#province").val("");
                showNoti(4, "Thêm thuộc tính thành công");
                 properties.push({
                     id : res.result._id,
                     name: res.result.name
                 });
                 addPropertiesToTable(properties);
            } else {
                console.log(res.message);
            }
        }).error(function (err) {
            console.log(err);
        });
    }
});

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