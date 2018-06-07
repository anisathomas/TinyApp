
//Any email (including blank!) can be accepted for login,
//whether or not it has been registered into the database.


var express = require("express");
var cookieSession = require('cookie-session')
var app = express();
var PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.set("view engine", "ejs");
app.use(cookieSession({

  name: "session",
  keys: ["dgs"] //secret key


}
  ));
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  var randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  return randomString;
}

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  },
  "h3298y": {
    longURL: "http://www.youtube.com",
    userID: "userRandomID"
  }
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
  var user_id = req.session["user_id"];
    let userUrl = {} //new empty object
    var user = users[user_id];
    for (j in urlDatabase) {
      if (urlDatabase[j].userID === user_id) {
       userUrl[j] = urlDatabase[j];
      }
    }

  let templateVars = {
      urls: userUrl,
      user: user
      //refering to user database and the user which equals to users[user_id]
  };
  res.render("urls_index", templateVars);

});



app.post("/urls", (req, res) => {
  var shortURL = generateRandomString();
  var longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session["user_id"]
  };
  res.redirect('/urls')
});

app.get("/urls/new", (req, res) => {
  var user_id = req.session["user_id"];
  var user = users[user_id];
  let templateVars = {
    user: user
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  var user_id = req.session["user_id"];
  var user = users[user_id];
  const id = req.params.id;
  const url = urlDatabase[id];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user
  };
  if (user && url && user.id === url.userID){
  res.render("urls_show", templateVars);
  } else {
    res.status(400).send("Error: You can't edit a url thats not yours!")
  }

});




app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//Delete

app.post("/urls/:id/delete", (req, res) => {
  var user_id = req.session["user_id"];
  var user = users[user_id];
  const id = req.params.id;
  const url = urlDatabase[id];
  if (user && url && user.id === url.userID){
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
  } else {
    res.status(400).send("Error: You can't delete a url thats not yours!")
  }
});

//Update
app.post("/urls/:id", (req, res) =>{
  var shortURL = req.params.id;
  var longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id
  };
  res.redirect("/urls");

});

//the Login route
app.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(403).send("Error: Email or Password is empty")
  } else {
    for (i in users){
      if (req.body.email === users[i].email && users[i].hashedPassword && bcrypt.compareSync(req.body.password, users[i].hashedPassword)) {
        req.session.user_id = i;
        res.redirect("/urls");
        return;
      }
    }
    res.status(403).send("Error: Email or Password is incorrect")
  }
});


///THE LOG OUT ROUTE///

app.get("/login", (req, res) => {
  res.render("urls_login");
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

///REGISTRATION///
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
    hashedPassword : bcrypt.hashSync(req.body.password, 10)
  }
  req.session.user_id = randomID;
  res.redirect("/urls");
});

