function sub() {
    var form = new FormData();

    const companyName = $("#composedName").val();
    const address = $("#inputAddress").val();
    const emailId = $("#inputEmail").val();
    const contactNumber = $("#contactNumber").val();
    const whatsappNumber = $("#whatsappNumber").val();
    const aadhaarFront = $("#aadhaarFront")[0].files[0];
    const aadhaarBack = $("#aadhaarBack")[0].files[0];
    const panFront = $("#panFront")[0].files[0];
    const panBack = $("#panBack")[0].files[0];
    const cheque = $("#cheque")[0].files[0];
    const signature = $("#signature")[0].files[0];
    const photo = $("#photo")[0].files[0];

    form.append("companyName", companyName);
    form.append("address", address);
    form.append("email", emailId);
    form.append("contactNumber", contactNumber);
    form.append("whatsappNumber", whatsappNumber);
    form.append("aadhaarFront", aadhaarFront);
    form.append("aadhaarBack", aadhaarBack);
    form.append("panFront", panFront);
    form.append("panBack", panBack);
    form.append("cheque", cheque);
    form.append("signature", signature);
    form.append("photo", photo);

    var settings = {
        "url": "/post",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}