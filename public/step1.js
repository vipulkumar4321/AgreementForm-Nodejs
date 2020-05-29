function sub() {
  var form = new FormData();

  const venueType = $("#inputTypeOfVenue").val();
  const ownerName = $("#inputOwnerName").val();
  const companyName = $("#composedName").val();
  const address = $("#inputAddress").val();
  const email = $("#inputEmail").val();
  const contactNumber = $("#contactNumber").val();
  const whatsappNumber = $("#whatsappNumber").val();
  const panNumber = $("#panNumber").val();
  const gstNumber = $("#gstNumber").val();

  const aadhaarFront = $("#aadhaarFront")[0].files[0];
  const aadhaarBack = $("#aadhaarBack")[0].files[0];
  const panFront = $("#panFront")[0].files[0];
  //   const gstCertificate = $("#gstCertificate")[0].files[0];
  const cheque = $("#cheque")[0].files[0];
  const signature = $("#signature")[0].files[0];
  // const photo = $("#photo")[0].files[0];

  if (venueType === null) {
    alert("Type of Service Provider can't be blank !");
    return 0;
  }
  if (ownerName === "") {
    alert("Name can't be blank !");
    return 0;
  }
  if (companyName === "") {
    alert("Company Name can't be blank !");
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
    alert("Contact Number can't be blank !");
    return 0;
  }
  if (whatsappNumber === "") {
    alert("Whatsapp Number can't be blank !");
    return 0;
  }
  if (panNumber === "") {
    alert("PAN field can't be blank !");
    return 0;
  }
  // if (gstNumber === "") {
  //     alert("GST field can't be blank !");
  //     return 0;
  // }

  if (document.getElementById("aadhaarFront").files.length == 0) {
    alert("Aadhaar Front can't be blank !");
    return 0;
  }
  if (document.getElementById("aadhaarBack").files.length == 0) {
    alert("Aadhaar Back can't be blank !");
    return 0;
  }
  if (document.getElementById("panFront").files.length == 0) {
    alert("PAN Front can't be blank !");
    return 0;
  }
  if (document.getElementById("cheque").files.length == 0) {
    alert("Cancelled Cheque can't be blank !");
    return 0;
  }
  if (document.getElementById("signature").files.length == 0) {
    alert("Signature can't be blank !");
    return 0;
  }

  //   if (document.getElementById("gstCertificate").files.length == 0) {
  //     document
  //       .getElementById("gstCertificate")
  //       .attr("value", "./uploaded_files/gst.png");
  //   }

  form.append("venueType", venueType);
  form.append("ownerName", ownerName);
  form.append("companyName", companyName);
  form.append("address", address);
  form.append("email", email);
  form.append("contactNumber", contactNumber);
  form.append("whatsappNumber", whatsappNumber);
  form.append("panNumber", panNumber);
  form.append("gstNumber", gstNumber);
  form.append("aadhaarFront", aadhaarFront);
  form.append("aadhaarBack", aadhaarBack);
  form.append("panFront", panFront);
  //   form.append("gstCertificate", gstCertificate);
  form.append("cheque", cheque);
  form.append("signature", signature);
  // form.append("photo", photo);

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
      window.location = "/otp";
    } else {
      console.log(response.msg);
    }
  });
}
