const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "A@example.com",
    password: "a",
  },
};

//Random String Generator that generates a string with the length of 6
const generateRandomString = function() {
  let result = '';
  
  //a String that holds all number and character
  const allChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  //Randomly picks a charater or number from the allChar 6 times.
  for(let i = 0; i < 6; i ++) {
    result += allChar.charAt(Math.floor(Math.random() * allChar.length));
  }
  return result;
}

const getUserByEmail = function(userEmail) {
  for (const index in users) {
    if (users[index].email === userEmail) {
      return true;
    }
  }
}
// app.post("/logout", (req, res) => {
//   res.clearCookie;
//   res.redirect("/urls");
// });

//There's no cookie saved
app.get("/login", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  res.render("urls_login", {user});
});

app.post("/login",(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Error");
  }
  
  for(const index in users) {
    
    if(users[index].email === email && users[index].password === password) {
      res.cookie("user_id", users[index].id);
      res.redirect(`/urls`);
     }
  }
  //Error
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.user_id);
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  res.render("urls_register", {user});
});

app.post("/register",(req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Email or Password is missing");
  }
  
  if (getUserByEmail(req.body.email)) {
    return res.status(400).send("The email is in use. Please Log in");
  }

  //registering new user
  const userId = generateRandomString();
  const user = { id: userId, email: req.body.email, password: req.body.password };
  users[userId] = user;
  res.cookie("user_id",user.id);
  res.redirect("/urls");
})

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if(!user) {
    res.status(400).redirect("/login");
  }
  res.render("urls_new", {user});
});



app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user};
  
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect("/urls");
});



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });