var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "anisa"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "Bobby3233": {
    id: "Bobby3233",
    email: "Bobby@example.com",
    password: "helloworld"
  }
}

app.get("/urls", (req, res) => {
  var user_id = req.cookies["user_id"];
  var user = users[user_id];
  let templateVars = {
    urls: urlDatabase,
    user: user
    //refering to user database and the user which equals to users[user_id]
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  var user_id = req.cookies["user_id"];
  var user = users[user_id];
  let templateVars = {
    user: user
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  var user_id = req.cookies["user_id"];
  var user = users[user_id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: user
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

  for (i in users){

    if(req.body.email === users[i].email && req.body.password === users[i].password){
      res.cookie("user_id", i);
      res.redirect("/urls");
      return
    }
  }
  //console.log("wrong email or password");
  res.status(403).send("Error: Email or Password is incorrect")

});

app.get("/login", (req, res) => {
  res.render("urls_login");
})

//the Logout Route
app.post("/logout", (req, res) => {
  //res.clearCookie('name', { path: '/admin' });
  res.clearCookie("user_id");

  res.redirect("/urls");
});

//registration page
app.get("/register", (req, res) => {
  res.render("urls_registration");

});


app.post("/register", (req,res) => {
  var randomID = generateRandomString();
  if (req.body.email === "" || req.body.password === ""){
    res.status(400).send("Error: Email or Password Field is Empty")
  } else {
    for (var i in users){
      if (req.body.email === users[i].email){
      res.status(400).send("Error: That email already exists. Please Try again!")
      }
    }
  }

  users[randomID] = {
    id : randomID,
    email : req.body.email,
    password : req.body.password
  }

  res.cookie("user_id", randomID);
  res.redirect("/urls");
});






// Change your templateVars (multiple endpoints)
// to pass in a user (object) property instead of the
// previously implemented username (string) property.



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
