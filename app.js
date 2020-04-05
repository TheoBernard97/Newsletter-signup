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

  const url = "https://us19.api.mailchimp.com/3.0/lists/b8ac24976c";
  const options = {
    method: "POST",
    auth: "TheoBernard97:4f0392c328cbc31927808c86a3d81a59-us19",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
