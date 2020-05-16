const fileUpload = require('express-fileupload');
var bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  app = express();

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
    useUnifiedTopology: true
  },
  () => console.log("connected to db...")
);

//Schema setup
var vendorSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  contactNumber: String,
  whatsappNumber: String,
});

var Vendor = mongoose.model("Vendor", vendorSchema);

app.get("/", function (req, res) {
  res.redirect("/agreement");
});

app.get("/agreement", function (req, res) {
  res.render("index");
});

app.get("/step1", function (req, res) {
  res.render("step1");
});

app.get("/thanks", function (req, res) {
  res.render("thanks");
});

app.post("/post", function (req, res) {
  var name = req.body.company_Name;
  var address = req.body.address;
  var email = req.body.emailId;
  var contactNumber = req.body.contactNumber;
  var whatsappNumber = req.body.whatsappNumber;
  var aadhaarFront = req.files.aadhaarFront;
  var aadhaarBack = req.files.aadhaarBack;
  var panFront = req.files.panFront;
  var panBack = req.files.panBack;
  var cheque = req.files.cheque;
  var signature = req.files.signature;
  var photo = req.files.photo;

  // console.log(req.files);

  time = new Date().getTime().toString();

  uploadAadhaar(time, aadhaarFront, aadhaarBack, panFront, panBack, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res)
});


function uploadAadhaar(time, aadhaarFront, aadhaarBack, panFront, panBack, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res){
  aadhaarFront.mv('./uploaded_files/Aadhaar/front/' + time + "_" + aadhaarFront.name, function (err) {
    if (err)
      return console.log(err);

    console.log('Aadhaar Front File Uploaded');
    aadhaarBack.mv('./uploaded_files/Aadhaar/back/' + time + "_" + aadhaarBack.name, function (err) {
      if (err)
        return console.log(err);
  
      console.log('Aadhaar Back File Uploaded');
      uploadPan(time, panFront, panBack, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res);
    });
  });
}

function uploadPan(time, panFront, panBack, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res){
  panFront.mv('./uploaded_files/PAN/front/' + time + "_" + panFront.name, function (err) {
    if (err)
      return console.log(err);

    console.log('PAN Front File Uploaded');
    panBack.mv('./uploaded_files/PAN/back/' + time + "_" + panBack.name, function (err) {
      if (err)
        return console.log(err);
  
      console.log('PAN Back File Uploaded');
      uploadSignature(time, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res);
    });
  });
}

function uploadSignature(time, signature, photo, cheque, name, address, email, contactNumber, whatsappNumber, res){
  signature.mv('./uploaded_files/signature/' + time + "_" + signature.name, function (err) {
    if (err)
      return console.log(err);

    console.log('Signature File uploaded!');
    uploadPhoto(time, photo, cheque, name, address, email, contactNumber, whatsappNumber, res)
  });
}

function uploadPhoto(time, photo, cheque, name, address, email, contactNumber, whatsappNumber, res){
  photo.mv('./uploaded_files/Photo/' + time + "_" + photo.name, function (err) {
    if (err)
      return console.log(err);

    console.log('Photo File uploaded!');
    uploadCheque(time, cheque, name, address, email, contactNumber, whatsappNumber,res);
  });
}

function uploadCheque(time, cheque, name, address, email, contactNumber, whatsappNumber, res){
  cheque.mv('./uploaded_files/Cheque/' + time + "_" + cheque.name, function (err) {
    if (err)
      return console.log(err);

    console.log('Cheque File uploaded!');
    // var newVendor = {
    //   name: name,
    //   address: address,
    //   email: email,
    //   contactNumber: contactNumber,
    //   whatsappNumber: whatsappNumber,
    // };
    // Vendor.create(newVendor, function (err, newlyCreated) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.redirect("/thanks");
    //   }
    // });
  });
}


// app.get("/*", function (req, res) {
//   res.redirect("/agreement");
// });

app.listen(9000, function () {
  console.log("Server is listening...");
});