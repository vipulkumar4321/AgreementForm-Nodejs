const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  AWS = require("aws-sdk"),
  moment = require("moment"),
  app = express();
const requestIp = require("request-ip");
const axios = require("axios");
const imageToBase64 = require("image-to-base64");
var ip;
var ipMiddleware = function (req, res, next) {
  ip = requestIp.getClientIp(req); // on localhost > 127.0.0.1
  next();
};

require("dotenv/config");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

var ip;
var date;
var time;
var timeStamp;
var vCode;

//DB connnection
mongoose.connect(
  process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("connected to db...")
);

//Schema setup
var vendorSchema = new mongoose.Schema({
  time: String,
  timeStamp: String,
  vCode: String,
  venueType: String,
  ownerName: String,
  name: String,
  address: String,
  email: String,
  contactNumber: String,
  whatsappNumber: String,
  panNumber: String,
  gstNumber: String,
  accountNumber: String,
  ifscCode: String,
  accountHolderName: String,

  ip: String,
});

var Vendor = mongoose.model("Vendor", vendorSchema);

var venueType,
  contactNumber,
  ownerName,
  address,
  email,
  name,
  panNumber,
  gstNumber,
  signature;

var signatureAddress;

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/step1", function (req, res) {
  res.render("step1");
});

app.get("/agreement", ipMiddleware, function (req, res) {
  date = moment().format("dddd, MMMM Do, YYYY");
  res.render("index", {
    date: date,
    time: moment().format("LT"),
  });
  console.log(ip);
  // var getClientIp = function (req) {
  //   return (
  //     (
  //       req.headers["X-Forwarded-For"] ||
  //       req.headers["x-forwarded-for"] ||
  //       ""
  //     ).split(",")[0] || req.client.remoteAddress
  //   );
  // };
  // ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
});

app.post("/post", function (req, res) {
  venueType = req.body.venueType;
  ownerName = req.body.ownerName;
  name = req.body.companyName;
  address = req.body.address;
  email = req.body.email;
  contactNumber = req.body.contactNumber;
  var whatsappNumber = req.body.whatsappNumber;
  panNumber = req.body.panNumber;
  gstNumber = req.body.gstNumber;
  // var aadhaarFront = req.files.aadhaarFront;
  // var aadhaarBack = req.files.aadhaarBack;
  var panFront = req.files.panFront;
  // var gstCertificate = req.files.gstCertificate;
  var accountNumber = req.body.accountNumber;
  var ifscCode = req.body.IFSCCode;
  var accountHolderName = req.body.accountHolderName;
  var cheque = req.files.cheque;
  signature = req.files.signature;
  // var photo = req.files.photo;

  time = new Date().getTime().toString();

  const uploadFile = upload(
    time,
    // aadhaarFront,
    // aadhaarBack,
    panFront,
    // gstCertificate,
    signature,
    cheque
  );

  console.log(uploadFile);

  if (uploadFile.status == true) {
    var newVendor = {
      time: time,
      timeStamp: "",
      vCode: "",
      venueType: venueType,
      ownerName: ownerName,
      name: name,
      address: address,
      email: email,
      contactNumber: contactNumber,
      whatsappNumber: whatsappNumber,
      panNumber: panNumber,
      gstNumber: gstNumber,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      accountHolderName: accountHolderName,
      ip: ip,
    };
    Vendor.create(newVendor, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: true,
          msg: uploadFile.msg,
        });
      }
    });
  } else {
    res.send({
      status: false,
      msg: uploadFile.msg,
    });
  }
});

function upload(
  time,
  // aadhaarFront,
  // aadhaarBack,
  panFront,
  // gstCertificate,
  signature,
  cheque
) {
  // const uploadAadhaarFrontFile = uploadAadhaarFront(time, aadhaarFront);
  // const uploadAadhaarBackFile = uploadAadhaarBack(time, aadhaarBack);
  const uploadPanFrontFile = uploadPanFront(time, panFront);
  // const uploadGstCertificateFile = uploadGstCertificate(time, gstCertificate);
  const uploadSignatureFile = uploadSignature(time, signature);
  // const uploadPhotoFile = uploadPhoto(time, photo);
  const uploadChequeFile = uploadCheque(time, cheque);

  // if (uploadAadhaarFrontFile.status == false) {
  //   return {
  //     status: uploadAadhaarFile.status,
  //     msg: uploadAadhaarFile.msg,
  //   };
  // }

  // if (uploadAadhaarBackFile.status == false) {
  //   return {
  //     status: uploadAadhaarFile.status,
  //     msg: uploadAadhaarFile.msg,
  //   };
  // }

  if (uploadPanFrontFile.status == false) {
    return {
      status: uploadPanFile.status,
      msg: uploadPanFile.msg,
    };
  }

  // if (uploadGstCertificateFile.status == false) {
  //   return {
  //     status: uploadGstCertificateFile.status,
  //     msg: uploadGstCertificateFile.msg,
  //   };
  // }

  if (uploadSignatureFile.status == false) {
    return {
      status: uploadSignatureFile.status,
      msg: uploadSignatureFile.msg,
    };
  }

  // if (uploadPhotoFile.status == false) {
  //   return {
  //     status: uploadPhotoFile.status,
  //     msg: uploadPhotoFile.msg
  //   }
  // }

  if (uploadChequeFile.status == false) {
    return {
      status: uploadChequeFile.status,
      msg: uploadChequeFile.msg,
    };
  }

  return {
    status: true,
    msg: "All Files Uploaded",
  };
}

// function uploadAadhaarFront(time, aadhaarFront) {
//   aadhaarFront.mv(
//     "./uploaded_files/Aadhaar/front/" + time + "_" + aadhaarFront.name,
//     function (err) {
//       if (err) {
//         return {
//           status: false,
//           msg: err,
//         };
//       }
//       console.log("Aadhaar Front File Uploaded");
//     }
//   );
//   return {
//     status: true,
//     msg: "Aadhaar Front File Uploaded",
//   };
// }

// function uploadAadhaarBack(time, aadhaarBack) {
//   aadhaarBack.mv(
//     "./uploaded_files/Aadhaar/back/" + time + "_" + aadhaarBack.name,
//     function (err) {
//       if (err) {
//         return {
//           status: false,
//           msg: err,
//         };
//       }

//       console.log("Aadhaar Back File Uploaded");
//     }
//   );
//   return {
//     status: true,
//     msg: "Aadhaar Back File Uploaded",
//   };
// }

function uploadPanFront(time, panFront) {
  panFront.mv(
    "./uploaded_files/PAN/front/" + time + "_" + panFront.name,
    function (err) {
      if (err) {
        return {
          status: false,
          msg: err,
        };
      }

      console.log("PAN Front File Uploaded");
    }
  );
  return {
    status: true,
    msg: "PAN Front File Uploaded",
  };
}

// function uploadGstCertificate(time, gstCertificate) {
//   gstCertificate.mv(
//     "./uploaded_files/GST_certificate/" + time + "_" + gstCertificate.name,
//     function (err) {
//       if (err) {
//         return {
//           status: false,
//           msg: "err",
//         };
//       }

//       console.log("GST Certificate File Uploaded");
//     }
//   );
//   return {
//     status: true,
//     msg: "GST Certificate File Uploaded",
//   };
// }

function uploadSignature(time, signature) {
  signatureAddress =
    "./uploaded_files/signature/" + time + "_" + signature.name;
  signature.mv(
    "./uploaded_files/signature/" + time + "_" + signature.name,
    function (err) {
      if (err) {
        return {
          status: false,
          msg: err,
        };
      }

      console.log("Signature File uploaded!");
    }
  );
  return {
    status: true,
    msg: "Signature File uploaded!",
  };
}

// function uploadPhoto(time, photo) {
//   photo.mv('./uploaded_files/Photo/' + time + "_" + photo.name, function (err) {
//     if (err) {
//       return {
//         "status": false,
//         "msg": err
//       };
//     }

//     console.log('Photo File uploaded!');
//   });
//   return {
//     "status": true,
//     "msg": 'Photo File uploaded!'
//   };
// }

function uploadCheque(time, cheque) {
  try {
    cheque.mv("./uploaded_files/Cheque/" + time + "_" + cheque.name, function (
      err
    ) {
      if (err) {
        return {
          status: false,
          msg: err,
        };
      }

      console.log("Cheque File uploaded!");
    });
  } catch (e) {
    console.log("no cheque to upload!");
    // console.log(e);
  }
  return {
    status: true,
    msg: "no cheque to upload!",
  };
}

app.get("/otp", function (req, res) {
  var OTP = Math.floor(1000 + Math.random() * 9000);
  var message =
    "<#> Your veneufy.in OTP is: " +
    OTP +
    ".Note: Please DO NOT SHARE this OTP with anyone.";
  var params = {
    Message: message,
    PhoneNumber: "+91" + contactNumber,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "Venuefy",
      },
    },
  };

  var publishTextPromise = new AWS.SNS({
      apiVersion: "2010-03-31",
    })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      res.render("otp", {
        OTP: OTP,
      });
    })
    .catch(function (err) {
      res.send("Error, Try again !!!");
    });
  // res.render("otp");
});

app.get("/wait", function (req, res) {
  imageToBase64(signatureAddress) // you can also to use url
    .then((res) => {
      axios
        .post(process.env.PDF_API, {
          category: venueType,
          name: ownerName,
          email: email,
          cnumber: contactNumber,
          ip_adr: ip,
          address: address,
          companyName: name,
          pan: panNumber,
          gstin: gstNumber,
          signature: res,
        })
        .then(function (response) {
          console.log("email automation...");
          timeStamp = response["data"]["result"]["timestamp"];
          vCode = response["data"]["result"]["vcode"];

          console.log(time);
          const filter = {
            time: time
          };
          const update = {
            $set: {
              timeStamp: timeStamp,
              vCode: vCode
            }
          };
          Vendor.findOneAndUpdate(filter, update, function (err, doc) {
            if (err) {
              console.log("Something wrong when updating data!");
            }
            console.log(doc);
          });




        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("Converting in base64..."); //cGF0aC90by9maWxlLmpwZw==
    })
    .catch((err) => {
      console.log(err); //Exepection error....
    });
  res.redirect("/thanks");
});

app.get("/thanks", function (req, res) {
  res.render("thanks");
});

app.listen(9000, function () {
  console.log("Server is listening...");
});