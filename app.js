var bodyParser = require("body-parser"),
  express = require("express"),
  mongoose = require("mongoose"),
  app = express();

require("dotenv/config");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//DB connnection
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
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

app.post("/post", function (req, res) {
  var name = req.body.cName;
  var address = req.body.cAddress;
  var email = req.body.cEmail;
  var contactNumber = req.body.cContactNumber;
  var whatsappNumber = req.body.cWhatsappNumber;

  var newVendor = {
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
      res.redirect("/thanks");
    }
  });
});

app.get("/step1", function (req, res) {
  res.render("step1");
});

app.get("/thanks", function (req, res) {
  res.render("thanks");
});

// app.get("/*", function (req, res) {
//   res.redirect("/agreement");
// });

app.listen(process.env.PORT || 9000, process.env.IP, function () {
  console.log("Server is listening...");
});
