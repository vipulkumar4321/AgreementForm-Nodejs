function sub() {
    var form = new FormData();

    const venueType = $("#inputTypeOfVenue").val();
    const ownerName = $("#inputOwnerName").val();
    const companyName = $("#composedName").val();
    const address = $("#inputAddress").val();
    const email = $("#inputEmail").val();
    const contactNumber = $("#contactNumber").val();
    const whatsappNumber = $("#whatsappNumber").val();

    const aadhaarFront = $("#aadhaarFront")[0].files[0];
    const aadhaarBack = $("#aadhaarBack")[0].files[0];
    const panFront = $("#panFront")[0].files[0];
    const gstCertificate = $("#gstCertificate")[0].files[0];
    const cheque = $("#cheque")[0].files[0];
    const signature = $("#signature")[0].files[0];
    const photo = $("#photo")[0].files[0];


    if (venueType === "") {
        alert("Venue Type can't be blank !");
        return 0;
    }
    if (ownerName === "") {
        alert("Owner name can't be blank !");
        return 0;
    }
    if (companyName === "") {
        alert("Company name can't be blank !");
        return 0;
    }
    if (address === "") {
        alert("Address can't be blank !");
        return 0;
    }
    if (email === "") {
        alert("Email can't be blank !");
        return 0;
    }
    if (contactNumber === "") {
        alert("Contact number can't be blank !");
        return 0;
    }
    if (whatsappNumber === "") {
        alert("Whatsapp number can't be blank !");
        return 0;
    }

    form.append("venueType", venueType);
    form.append("ownerName", ownerName);
    form.append("companyName", companyName);
    form.append("address", address);
    form.append("email", email);
    form.append("contactNumber", contactNumber);
    form.append("whatsappNumber", whatsappNumber);
    form.append("aadhaarFront", aadhaarFront);
    form.append("aadhaarBack", aadhaarBack);
    form.append("panFront", panFront);
    form.append("gstCertificate", gstCertificate);
    form.append("cheque", cheque);
    form.append("signature", signature);
    form.append("photo", photo);

    var settings = {
        url: "/post",
        method: "POST",
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form,
    };

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        console.log(typeof response);
        if (response.status == true) {
            console.log(response.msg);
            window.location = "/thanks";
        } else {
            console.log(response.msg);
        }
    });
}