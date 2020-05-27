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
  time: String,
  venueType: String,
  ownerName: String,
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

app.post("/post", function (req, res) {
  var venueType = req.body.venueType;
  var ownerName = req.body.ownerName;
  var name = req.body.companyName;
  var address = req.body.address;
  var email = req.body.email;
  var contactNumber = req.body.contactNumber;
  var whatsappNumber = req.body.whatsappNumber;
  var aadhaarFront = req.files.aadhaarFront;
  var aadhaarBack = req.files.aadhaarBack;
  var panFront = req.files.panFront;
  var gstCertificate = req.files.gstCertificate;
  var cheque = req.files.cheque;
  var signature = req.files.signature;
  var photo = req.files.photo;

  // console.log(req.files);

  var time = new Date().getTime().toString();

  const uploadFile = upload(time, aadhaarFront, aadhaarBack, panFront, gstCertificate, signature, photo, cheque);

  console.log(uploadFile);

  if (uploadFile.status == true) {
    var newVendor = {
      time: time,
      venueType: venueType,
      ownerName: ownerName,
      name: name,
      address: address,
      email: email,
      contactNumber: contactNumber,
      whatsappNumber: whatsappNumber,
    };
    Vendor.create(newVendor, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        res.send({
          "status": true,
          "msg": uploadFile.msg
        })
      }
    });
  } else {
    res.send({
      "status": false,
      "msg": uploadFile.msg
    })
  }
});

function upload(time, aadhaarFront, aadhaarBack, panFront, gstCertificate, signature, photo, cheque) {

  const uploadAadhaarFrontFile = uploadAadhaarFront(time, aadhaarFront);
  const uploadAadhaarBackFile = uploadAadhaarBack(time, aadhaarBack);
  const uploadPanFrontFile = uploadPanFront(time, panFront);
  const uploadGstCertificateFile = uploadGstCertificate(time, gstCertificate);
  const uploadSignatureFile = uploadSignature(time, signature);
  const uploadPhotoFile = uploadPhoto(time, photo);
  const uploadChequeFile = uploadCheque(time, cheque);

  if (uploadAadhaarFrontFile.status == false) {
    return {
      status: uploadAadhaarFile.status,
      msg: uploadAadhaarFile.msg
    }
  }

  if (uploadAadhaarBackFile.status == false) {
    return {
      status: uploadAadhaarFile.status,
      msg: uploadAadhaarFile.msg
    }
  }

  if (uploadPanFrontFile.status == false) {
    return {
      status: uploadPanFile.status,
      msg: uploadPanFile.msg
    }
  }

  if (uploadGstCertificateFile.status == false) {
    return {
      status: uploadGstCertificateFile.status,
      msg: uploadGstCertificateFile.msg
    }
  }

  if (uploadSignatureFile.status == false) {
    return {
      status: uploadSignatureFile.status,
      msg: uploadSignatureFile.msg
    }
  }

  if (uploadPhotoFile.status == false) {
    return {
      status: uploadPhotoFile.status,
      msg: uploadPhotoFile.msg
    }
  }

  if (uploadChequeFile.status == false) {
    return {
      status: uploadChequeFile.status,
      msg: uploadChequeFile.msg
    }
  }

  return {
    status: true,
    msg: "All Files Uploaded"
  }
}

function uploadAadhaarFront(time, aadhaarFront) {
  aadhaarFront.mv('./uploaded_files/Aadhaar/front/' + time + "_" + aadhaarFront.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }
    console.log('Aadhaar Front File Uploaded');

  });
  return {
    "status": true,
    "msg": "Aadhaar Front File Uploaded"
  };


}

function uploadAadhaarBack(time, aadhaarBack) {
  aadhaarBack.mv('./uploaded_files/Aadhaar/back/' + time + "_" + aadhaarBack.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('Aadhaar Back File Uploaded');
  });
  return {
    "status": true,
    "msg": "Aadhaar Back File Uploaded"
  };
}

function uploadPanFront(time, panFront) {
  panFront.mv('./uploaded_files/PAN/front/' + time + "_" + panFront.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('PAN Front File Uploaded');
  });
  return {
    "status": true,
    "msg": 'PAN Front File Uploaded'
  };
}

function uploadGstCertificate(time, gstCertificate) {
  gstCertificate.mv('./uploaded_files/GST_certificate/' + time + "_" + gstCertificate.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('GST Certificate File Uploaded');
  });
  return {
    "status": true,
    "msg": 'GST Certificate File Uploaded'
  };
}

function uploadSignature(time, signature) {
  signature.mv('./uploaded_files/signature/' + time + "_" + signature.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('Signature File uploaded!');
  });
  return {
    "status": true,
    "msg": 'Signature File uploaded!'
  };
}

function uploadPhoto(time, photo) {
  photo.mv('./uploaded_files/Photo/' + time + "_" + photo.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('Photo File uploaded!');
  });
  return {
    "status": true,
    "msg": 'Photo File uploaded!'
  };
}

function uploadCheque(time, cheque) {
  cheque.mv('./uploaded_files/Cheque/' + time + "_" + cheque.name, function (err) {
    if (err) {
      return {
        "status": false,
        "msg": err
      };
    }

    console.log('Cheque File uploaded!');
  });
  return {
    "status": true,
    "msg": 'Cheque File uploaded!'
  };
}

app.get("/step1", function (req, res) {
  res.render("step1");
});

app.get("/thanks", function (req, res) {
  res.render("thanks");
});

// app.get("/*", function (req, res) {
//   res.redirect("/agreement");
// });

app.listen(9000, function () {
  console.log("Server is listening...");
});