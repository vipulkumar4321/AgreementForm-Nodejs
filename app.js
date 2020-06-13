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

app.post("/post", function (req, res) {
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

  var signatureAddress =
    "./uploaded_files/signature/" + time + "_" + signature.name;

  var ip = requestIp.getClientIp(req);

  const uploadFile = upload(
    time,
    panFront,
    signature,
    cheque
  );

  // console.log(uploadFile);


  imageToBase64(signatureAddress) // you can also to use url
    .then((resp) => {
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

          if (uploadFile.status == true) {
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
                  msg: uploadFile.msg,
                });
              }
            });
          } else {
            console.log("something went wrong!!!");
            res.send({
              status: false,
              msg: uploadFile.msg,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      // console.log("Converting in base64..."); //cGF0aC90by9maWxlLmpwZw==
    })
    .catch((err) => {
      console.log(err); //Exepection error....
    });
});

function upload(
  time,
  panFront,
  signature,
  cheque
) {
  const uploadPanFrontFile = uploadPanFront(time, panFront);
  const uploadSignatureFile = uploadSignature(time, signature);
  const uploadChequeFile = uploadCheque(time, cheque);

  if (uploadPanFrontFile.status == false) {
    return {
      status: uploadPanFile.status,
      msg: uploadPanFile.msg,
    };
  }

  if (uploadSignatureFile.status == false) {
    return {
      status: uploadSignatureFile.status,
      msg: uploadSignatureFile.msg,
    };
  }
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
  signature.mv(
    "./uploaded_files/signature/" + time + "_" + signature.name,
    function (err) {
      if (err) {
        return {
          status: false,
          msg: err,
        };
      }
      // console.log("Signature File uploaded!");
    }
  );
  return {
    status: true,
    msg: "Signature File uploaded!",
  };
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