function otpSend() {
  var flag = 1;
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
  const accountNumber = $("#accountNumber").val();
  const ifscCode = $("#IFSCCode").val();
  const accountHolderName = $("#accountHolderName").val();
  const panFront = $("#panFront")[0].files[0];
  const cheque = $("#cheque")[0].files[0];
  const signature = $("#signature")[0].files[0];

  if (venueType === null) {
    alert("Type of Service Provider can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (ownerName === "") {
    alert("Name can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (companyName === "") {
    alert("Company Name can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (address === "") {
    alert("Address can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (email === "") {
    alert("Email can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (contactNumber === "") {
    alert("Contact Number can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (contactNumber.length !== 10) {
    alert("Contact Number must be of 10 digits !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (isNaN(contactNumber)) {
    alert("Contact Number must contain only numbers !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (whatsappNumber === "") {
    alert("Whatsapp Number can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (whatsappNumber.length !== 10) {
    alert("Whatsapp Number must be of 10 digits !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (isNaN(whatsappNumber)) {
    alert("Whatsapp Number must contain only numbers !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (panNumber === "") {
    alert("PAN field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (panNumber.length !== 10) {
    alert("PAN must be of 10 characters !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (gstNumber.length !== 15 && gstNumber.length !== 0) {
    alert("GSTIN must be of 15 characters !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }


  if (accountNumber === "") {
    alert("Account Number field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (ifscCode === "") {
    alert("IFSC code field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (accountHolderName === "") {
    alert("Account Holder Name field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (document.getElementById("panFront").files.length == 0) {
    alert("PAN Front can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (document.getElementById("signature").files.length == 0) {
    alert("Signature can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (flag === 1) {
    $(".otp-form").css("visibility", "visible");
  }

  form.append("venueType", venueType);
  form.append("ownerName", ownerName);
  form.append("companyName", companyName);
  form.append("address", address);
  form.append("email", email);
  form.append("contactNumber", contactNumber);
  form.append("whatsappNumber", whatsappNumber);
  form.append("panNumber", panNumber);
  form.append("gstNumber", gstNumber);
  form.append("accountNumber", accountNumber);
  form.append("IFSCCode", ifscCode);
  form.append("accountHolderName", accountHolderName);
  form.append("panFront", panFront);
  form.append("cheque", cheque);
  form.append("signature", signature);

  var settings = {
    url: "/otp",
    method: "POST",
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
  };

  $.ajax(settings).done(function (response) {
    response = JSON.parse(response);
    // console.log(typeof response);
    if (response.status == true) {
      // console.log(response.value);
      $("#otpFrom").val(response.value);

      var timeleft = 30;
      var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          $("#resendOTP").removeClass("disabled");
          $("#OTPTimer").text("");
        } else {
          $("#OTPTimer").text(timeleft + " seconds");
          $("#resendOTP").addClass("disabled");
        }
        timeleft -= 1;
      }, 1000);

      // console.log(response.msg);
    } else {
      console.log(response.msg);
    }
  });
}


function sub() {
  $(".loader").css("visibility", "visible");

  var flag = 1;
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
  const accountNumber = $("#accountNumber").val();
  const ifscCode = $("#IFSCCode").val();
  const accountHolderName = $("#accountHolderName").val();
  const panFront = $("#panFront")[0].files[0];
  const cheque = $("#cheque")[0].files[0];
  const signature = $("#signature")[0].files[0];
  const otp = $('#otp').val();


  if (venueType === null) {
    alert("Type of Service Provider can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (ownerName === "") {
    alert("Name can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (companyName === "") {
    alert("Company Name can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (address === "") {
    alert("Address can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (email === "") {
    alert("Email can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (contactNumber === "") {
    alert("Contact Number can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (whatsappNumber === "") {
    alert("Whatsapp Number can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (panNumber === "") {
    alert("PAN field can't be blank !");
    flag = 0;
    return 0;
  }

  if (accountNumber === "") {
    alert("Account Number field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (ifscCode === "") {
    alert("IFSC code field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (accountHolderName === "") {
    alert("Account Holder Name field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (document.getElementById("panFront").files.length == 0) {
    alert("PAN Front can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }
  if (document.getElementById("signature").files.length == 0) {
    alert("Signature can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (otp === "") {
    alert("otp field can't be blank !");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  if (otp !== $("#otpFrom").val()) {
    alert("Incorrect OTP!!!");
    $(".loader").css("visibility", "hidden");
    flag = 0;
    return 0;
  }

  form.append("venueType", venueType);
  form.append("ownerName", ownerName);
  form.append("companyName", companyName);
  form.append("address", address);
  form.append("email", email);
  form.append("contactNumber", contactNumber);
  form.append("whatsappNumber", whatsappNumber);
  form.append("panNumber", panNumber);
  form.append("gstNumber", gstNumber);
  form.append("accountNumber", accountNumber);
  form.append("IFSCCode", ifscCode);
  form.append("accountHolderName", accountHolderName);
  form.append("panFront", panFront);
  form.append("cheque", cheque);
  form.append("signature", signature);

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
    // console.log(typeof response);
    if (response.status == true) {
      // console.log(response.msg);
      window.location = "/thanks";
    } else {
      console.log(response.msg);
    }
  });
}