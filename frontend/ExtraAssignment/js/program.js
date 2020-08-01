// single page load
$(function () {
    $(".header").load("header.html");
    $(".menu").load("menu.html");
    $(".footer").load("footer.html");
    $(".content").load("home.html");
});

function clickHomeButton() {
    $(".content").load("home.html");
}

function clickManagerIcon() {
    showModalInfo();
}

function showModalInfo() {
    $("#modalInfo").modal("show");
}

function clickGroupButton() {
    $(".content").load("viewListGroup.html");
    buildListGroupsTable();
}

// declare object Group and array groups to receive data from server
function Group(id, groupName, member, creator, createDate) {
    this.id = id;
    this.groupName = groupName;
    this.member = member;
    this.creator = creator;
    this.createDate = createDate;
}

var groups = [];

function buildListGroupsTable() {

    // empty table before rebuild it
    $('tbody').empty();
    getListGroups();
}

// get data from server
function getListGroups() {
    $.get("https://5ee455f25dd8b80016082e63.mockapi.io/groups", function (data, status) {

        // error
        if (status == "error") {
            alert("Error when loading data");
            return;
        }

        // success
        groups = data;
        fillListGroupsTable();
    });
}

// build list groups table and add data
function fillListGroupsTable() {
    var count = 0;
    groups.forEach(group => {
        $('tbody').append(
            '<tr>' +
            '<td>' +
            '<input type="checkbox" class="checkbox" name="chk[]" value="' + group.id + '"></input>' +
            '</td>' +
            '<td>' + (++count) + '</td>' +
            '<td><a  style="text-decoration: none;" onclick="clickGroupName(' + group.id + ')">' + group.groupName + '</a></td>' +
            '</tr>'
        )
    });
}

// search function
function clickSearchButton(){
    var inputSearch = $("#inputSearch").val();
    buildlistSearchedGroups(inputSearch);
}

// empty table before rebuild it 
function buildlistSearchedGroups(inputSearch){
    $('tbody').empty();
    getDataSearchedGroups(inputSearch);
}

// get data from server 
function getDataSearchedGroups(inputSearch){
    $.get("https://5ee455f25dd8b80016082e63.mockapi.io/groups?search="+inputSearch, function (data, status) {

        // error
        if (status == "error") {
            alert("Error when loading data");
            return;
        }

        // success
        groups = data;
        fillListGroupsTable();
    });
}

// check all checkbox

function checkAll() {
    $('input[type="checkbox"]').prop('checked', this.checked);
    buildGroupsDetail(id);
}

// view detail function
function clickGroupName(id) {
    $(".content").load("groupDetail.html");
    buildGroupsDetail(id);
}


function buildGroupsDetail(id) {

    // empty table before rebuild it
    $('ul').empty();
    getGroupDetail(id);
}

// get data group detail from server
function getGroupDetail(id) {
    $.get("https://5ee455f25dd8b80016082e63.mockapi.io/groups/"+id, function (data, status) {

        // error
        if (status == "error") {
            alert("Error when loading data");
            return;
        }

        // success
        var group =new Group();
        group= data;
        fillGroupsDetail(group);
    });
}

// build group detail and add data
function fillGroupsDetail(group) {
            $('ul').append(
                '<li><b>Group name: </b>' + group.groupName + '</li>' +
                '<li><b>Group member: </b>' + group.member + '</li>' +
                '<li><b>Group creator: </b>' + group.creator + '</li>' +
                '<li><b>Group create date: </b>' + group.createDate + '</li>' +
                '<li style="display: none;" id="id">' + group.id + '</li>'
            )
}

// add function
function openAddModal() {
    resetForm();
    openModal();
}

//empty modal
function resetForm() {
    $("#id").val("");
    $("#groupName").val("");
    $("#member").val("");
    $("#creator").val("");
    $("#createDate").val("");
}

function openModal() {
    $('#myModal').modal('show');
}

function hideModal() {
    $('#myModal').modal('hide');
}

function addGroup() {

    // Send add data request to server
    var groupName = $("#groupName").val();
    var member = $("#member").val();
    var creator = $("#creator").val();
    var createDate = $("#createDate").val();

    $.post("https://5ee455f25dd8b80016082e63.mockapi.io/groups", {
        groupName: groupName,
        member: member,
        creator: creator,
        createDate: createDate
    },
        function (data, status) {
            // error
            if (status == "error") {
                alert("Error when loading data");
                return;
            }

            // success
            hideModal();
            showSuccessAlert();
            buildListGroupsTable();
        });
}

function showSuccessAlert() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
}

// delete function
function findidChecked() {

    //error
    if ($('input[name="chk[]"]:checked').length == 0) {
        alert("Please check checkbox of data row you want deleting!")
        return;
    }

    // get all id of checked checkboxs
    var idCheckeds = [];
    var idChecked = $('input[name="chk[]"]:checked').each(function () {
        idCheckeds.push($(this).val());
    })
    return idCheckeds;
}

function openConfirmDelete() {
    var idCheckeds = findidChecked();

    // get confirm massage
    var str = "";
    idCheckeds.forEach(idChecked => {
        var index = groups.findIndex(group => group.id == idChecked);
        str += groups[index].groupName + ", ";
    });
    str = str.substring(0, str.length - 2)
    var result = confirm("You Want to delete " + str + "?");

    //perform delete data
    if (result) {
        deleteGroup(idCheckeds);
    }
}

function deleteGroup(idCheckeds) {

    // Send delete request to server

    var counter = 0;

    idCheckeds.forEach(idChecked => {
        $.ajax({
            url: 'https://5ee455f25dd8b80016082e63.mockapi.io/groups/' + idChecked,
            type: 'DELETE',
            success: function (result) {

                counter++;

                // error
                if (result == undefined || result == null) {
                    alert("Error when loading data");
                    return;
                }

                if (counter == idCheckeds.length) {
                    showSuccessAlert();
                    buildListGroupsTable();
                }
            }
        });
    });

}

// update function
// hint data for updating
function clickUpdateButton() {

    // get id to update    
    var id = $("#id").text();
    var index = groups.findIndex(group => group.id == id);

    //hint input value
    $("#id").val(groups[index].id);
    $("#groupName").val(groups[index].groupName);
    $("#member").val(groups[index].member);
    $("#creator").val(groups[index].creator);
    $("#createDate").val(groups[index].createDate);
    openModal();
}


function updateGroup() {

    //get input data
    var id = $("#id").text();
    var groupName = $("#groupName").val();
    var member = $("#member").val();
    var creator = $("#creator").val();
    var createDate = $("#createDate").val();

    // Send update request to server
    $.ajax({
        url: 'https://5ee455f25dd8b80016082e63.mockapi.io/groups/' + id,
        type: 'PUT',
        data: {
            groupName: groupName,
            member: member,
            creator: creator,
            createDate: createDate
        },
        success: function (result) {

            // error
            if (result == undefined || result == null) {
                alert("Error when loading data");
                return;
            }

            // success
            hideModal();
            showSuccessAlert();
            buildGroupsDetail(id);
        }
    });
}

function save() {
    var id = $("#id").val();

    // perfrom add or update data
    if (id == null || id == "") {
        addGroup();
    } else {
        updateGroup();
    }
}



