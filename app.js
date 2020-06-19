const fileUpload = require("express-fileupload"),
  bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  AWS = require("aws-sdk"),
  moment = require("moment"),
  app = express(),
  requestIp = require("request-ip"),
  imageToBase64 = require("image-to-base64"),
  axios = require("axios");

  
var fs = require('fs');
const { resolve } = require("path");
const { rejects } = require("assert");

require("dotenv/config");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

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
    })
    .catch(function (err) {
      res.send("Something went wrong, Try again !!!");
    });
  return res.send({
    value: OTP,
    status: true,
    msg: "OTP sent successfully!!!",
  });
});

app.post("/post", async function (req, res) {
  var time = new Date().getTime().toString();

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
  var srcData = req.body.srcData;
  var timeStamp;
  var vCode;
  var ip = requestIp.getClientIp(req);

  // console.log(srcData);

  upload2(
    time,
    panFront,
    signature,
    cheque
  ).then(()=>{
    console.log("File uploaded");
    sendEmail();
  }).catch((e)=>{
    console.log(e);
  })

function sendEmail(){
  console.log(srcData);
  var flag = 0;
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
        signature: ""+srcData,
      })
      .then(function (response) {
        timeStamp = response["data"]["result"]["timestamp"];
        vCode = response["data"]["result"]["vcode"];
      })
      .catch(function (error) {
        console.log(error);
      });
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
        flag = 1;
      }
    });



  if(flag === 1) {
    res.send({
      status: true,
      msg: "mongo",
    });
  } else {
    res.send({
      status: false,
      msg: "no mongo",
    });
  }

}

});


// function base64_encode(file) {
//   // return new Promise((resolve,rejects)=>{
//     // read binary data
//     var bitmap = fs.readFileSync(file);
//     // convert binary data to base64 encoded string
//     return new Buffer(bitmap).toString('base64');
//   // })
// }

// function base64_encode(file) {
//   var reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function () {
//     console.log(reader.result);
//     return reader.result;
//   };
//   reader.onerror = function (error) {
//     console.log('Error: ', error);
//   };
// }

function upload2(time,
  panFront,
  signature,
  cheque){
  return new Promise(async(resolve,rejects)=>{
    const uploadPanFrontFile = uploadPanFront(time, panFront);
    const uploadChequeFile = uploadCheque(time, cheque);
    const uploadSignatureFile = uploadSignature(time, signature);

    if (uploadPanFrontFile.status == false) {
      return rejects({
        status: uploadPanFile.status,
        msg: uploadPanFile.msg,
      });
    }

    if (uploadChequeFile.status == false) {
      return rejects({
        status: uploadChequeFile.status,
        msg: uploadChequeFile.msg,
      });
    }
    uploadSignatureFile.then((data)=>{
      return resolve({
        status: true,
        msg: "All Files Uploaded",
      });
    }).catch((e)=>{
      return rejects({
        status: uploadSignatureFile.status,
        msg: uploadSignatureFile.msg,
      });
    })
  })
}

// function upload(
//   time,
//   panFront,
//   signature,
//   cheque
// ) {
//   const uploadPanFrontFile = uploadPanFront(time, panFront);
//   const uploadSignatureFile = uploadSignature(time, signature);
//   const uploadChequeFile = uploadCheque(time, cheque);

//   if (uploadPanFrontFile.status == false) {
//     return {
//       status: uploadPanFile.status,
//       msg: uploadPanFile.msg,
//     };
//   }

//   if (uploadSignatureFile.status == false) {
//     return {
//       status: uploadSignatureFile.status,
//       msg: uploadSignatureFile.msg,
//     };
//   }
//   if (uploadChequeFile.status == false) {
//     return {
//       status: uploadChequeFile.status,
//       msg: uploadChequeFile.msg,
//     };
//   }
//   return {
//     status: true,
//     msg: "All Files Uploaded",
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
      // console.log("PAN Front File Uploaded");
    }
  );
  return {
    status: true,
    msg: "PAN Front File Uploaded",
  };
}

function uploadSignature(time, signature) {
  return new Promise(async(resolve,rejects)=>{
    await signature.mv(
      "./uploaded_files/signature/" + time + "_" + signature.name,
      function (err) {
        if (err) {
          return rejects( {
            status: false,
            msg: err,
          });
        }
        // console.log("Signature File uploaded!");
      }
    );
    return resolve( {
      status: true,
      msg: "Signature File uploaded!",
    });
  })
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