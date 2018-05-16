var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());


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


app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
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

//Delete

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];

  if (url) {
    delete urlDatabase[id];
  }

  res.redirect("/urls");
});


//Update

app.post("/urls/:id", (req, res) =>{

  const longURL = req.body.longURL
  const shortURL = req.params.id;
  urlDatabase[shortURL] =longURL;

  res.redirect("/urls");
});

//the Login route

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);

  res.redirect("/urls");
});

//the Logout Route
app.post("/logout", (req, res) => {
  //res.clearCookie('name', { path: '/admin' });
  res.clearCookie("username");
  res.redirect("/urls");
});



// app.get("/", (req, res) => {
//   res.end("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.end("<html><body>Hello <b>World</b></body></html>\n");
// });


//Another way to say it is that in case of overlap, routes should be ordered from most specific to least specific.

//object.key direct static key lookup
//object[key] dynamic key lookup
