const fileUpload = require("express-fileupload"),
  bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  AWS = require("aws-sdk"),
  moment = require("moment"),
  app = express(),
  requestIp = require("request-ip"),
  axios = require("axios"),
  imageToBase64 = require("image-to-base64");
  //var sleep = require('sleep');
  
require("dotenv/config");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

var count = 0;

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

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/step1", function (req, res) {
  res.render("step1");
});

app.get("/agreement", function (req, res) {
  res.render("index", {
    date: moment().format("dddd, MMMM Do, YYYY"),
    time: moment().format("LT"),
  });
});

app.post("/otp", function (req, res) {
  var time = req.body.time;
  var panFront = req.files.panFront;
  var cheque = req.files.cheque;
  var signature = req.files.signature;

  // console.log('Signature:' + signature);
  // console.log("time: " + time);

  const uploadFile = upload(time, panFront, signature, cheque);

  // console.log("all upload completed\n\n");
  // console.log('uploadFiles.status == true');
  if(uploadFile.status == true) {
    // console.log('uploadFiles.status == true');
    var contact = req.body.contactNumber;
    var OTP = Math.floor(1000 + Math.random() * 9000);
    var message =
      "<#> Your veneufy.in OTP is: " +
      OTP +
      ".Note: Please DO NOT SHARE this OTP with anyone.";
    var params = {
      Message: message,
      PhoneNumber: "+91" + contact,
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
        // console.log(OTP);
        res.send({
          value: OTP,
          time: time,
          status: true,
          msg: "OTP sent successfully!!!",
        });
      })
      .catch(function (err) {
        console.log(err)
        res.send("Something went wrong, Try again !!!");
      });
    
  } else {
    // console.log("uploadFiles.status == false");
    res.send({
      status: false,
      msg: uploadFile.msg,
    });
  }
});

app.post("/post", function (req, res) {
  // console.log('Inside post');
  var time = req.body.time;
  var venueType = req.body.venueType;
  var ownerName = req.body.ownerName;
  var name = req.body.companyName;
  var address = req.body.address;
  var email = req.body.email;
  var contactNumber = req.body.contactNumber;
  var whatsappNumber = req.body.whatsappNumber;
  var panNumber = req.body.panNumber;
  var gstNumber = req.body.gstNumber;
  var panFront = req.files.panFront;
  var accountNumber = req.body.accountNumber;
  var ifscCode = req.body.IFSCCode;
  var accountHolderName = req.body.accountHolderName;
  var cheque = req.files.cheque;
  var signature = req.files.signature;
  var ip = requestIp.getClientIp(req);

  // console.log('Signature:' + signature);

  // const uploadFile = upload(time, panFront, signature, cheque);


  // console.log(uploadFile);

// console.log(time);
//   console.log("Inside call image..");
  var signatureAddress =
  "./uploaded_files/signature/" + time + "_" + signature.name;
  
  // console.log('signature address:' + signatureAddress);

  imageToBase64(signatureAddress) // you can also to use url
    .then((resp) => {
      // console.log('Resp:' + resp);
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
          signature: resp,
        })
        .then(function (response) {
          // console.log("email automation...");
          var timeStamp = response["data"]["result"]["timestamp"];
          var vCode = response["data"]["result"]["vcode"];
          // console.log(timeStamp);
          // console.log(vCode);
          count++;
          console.log(count);
            var newVendor = {
              time: time,
              timeStamp: timeStamp,
              vCode: vCode,
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
              ip: ip
            };
            Vendor.create(newVendor, function (err, newlyCreated) {
              if (err) {
                console.log(err);
              } else {
                // console.log("Uploaded to mongo!!!");
                res.send({
                  status: true,
                  msg: "complete",
                });
              }
            });
        })
        .catch(function (error) {
          console.log(error);
          console.log(time);
        });
      // console.log("Converting in base64..."); //cGF0aC90by9maWxlLmpwZw==
    })
    .catch((err) => {
      console.log(err); 
      console.log(time);
    });
    // console.log('imageToBase64 defined');
    // setTimeout(callImage,1000);
});

// function finish() {
//   console.log("Final function");
// }


function upload(time, panFront, signature, cheque) {
  // console.log('signature in upload:' + signature);
  const uploadSignatureFile = uploadSignature(time, signature);
  const uploadPanFrontFile = uploadPanFront(time, panFront);
  // console.log('calling uploadSignature');
 
  const uploadChequeFile = uploadCheque(time, cheque);

  if (uploadPanFrontFile.status == false) {
    // console.log('1st is failing');
    return {
      status: uploadPanFile.status,
      msg: uploadPanFile.msg,
    };
  }

  if (uploadSignatureFile.status == false) {
    // console.log('2nd is failing');
    return {
      status: uploadSignatureFile.status,
      msg: uploadSignatureFile.msg,
    };
  }
  if (uploadChequeFile.status == false) {
    // console.log('3rd is failing');
    return {
      status: uploadChequeFile.status,
      msg: uploadChequeFile.msg,
    };
  }

  // console.log('end of upload');
  return {
    status: true,
    msg: "All Files Uploaded",
  };
}

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
      // console.log("PAN Front File Uploaded");
    }
  );
  return {
    status: true,
    msg: "PAN Front File Uploaded",
  };
}

function uploadSignature(time, signature) {
  // return new Promise(resolve => {
  // console.log('Inside uploadSignature:' + signature);
  signature.mv(
    "./uploaded_files/signature/" + time +  "_" + signature.name,
    function (err) {
      // console.log('err function called');
      if (err) {
        // console.log('inside if err');
        return {
          status: false,
          msg: err,
        };
      }
      // console.log("Signature File uploaded!");
    }
  );
  // console.log('a=' + a);
  // console.log('End of uploadSignature');
  return {
    status: true,
    msg: "Signature File uploaded!",
  };
  // resolve();
  // });
}

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
      // console.log("Cheque File uploaded!");
    });
  } catch (e) {
    // console.log("no cheque to upload!");
  }
  return {
    status: true,
    msg: "no cheque to upload!",
  };
}

app.get("/thanks", function (req, res) {
  res.render("thanks");
});

app.listen(9000, function () {
  console.log("Server is listening...");
});