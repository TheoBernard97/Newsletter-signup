const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const formData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  const data = {
    members: [
      {
        email_address: formData.email,
        status: "subscribed",
        merge_fields: {
          FNAME: formData.firstName,
          LNAME: formData.lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/" + process.env.S3_KEY;
  const options = {
    method: "POST",
    auth: "TheoBernard97:" + process.env.S3_SECRET,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
      console.log("Status code : " + response.statusCode);
    }
    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.get("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running");
});
