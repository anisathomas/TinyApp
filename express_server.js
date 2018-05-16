var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

function generateRandomString() {
  var randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));

  return randomString;

}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "h3298y": "http://www.youtube.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  //let templateVars = { urls: urlDatabase };
  res.render("urls_index", {
    urls: urlDatabase
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//Dan's Code
// app.post('/urls', (req, res) => {
//   var shortURL = generateRandomString()
//   var longURL= req.body.longURL;
//   console.log(req.body)
//   urlDatabase[shortURL] = longURL
//   res.redirect('/urls')
// });




//Another way to say it is that in case of overlap, routes should be ordered from most specific to least specific.

//object.key direct static key lookup
//object[key] dynamic key lookup
