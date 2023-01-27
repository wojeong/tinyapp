const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
const bcrpyt = require("bcryptjs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  i3KoGr: {
    longURL: "http://naver.com",
    userID: "aJ48lW",
  },
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
  usereRandomID: {
    id: "usere3RandomID",
    email: "a2@a.com",
    password: bcrpyt.hashSync("a"),
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
};

const getUserByEmail = function(userEmail) {
  for (const index in users) {
    if (users[index].email === userEmail) {
      return true;
    }
  }
};

const urlsForUser = function(id) {
  const verifiedURL = {};
  for (const shortenURL in urlDatabase) {
    if (urlDatabase[shortenURL].userID === id) {
      verifiedURL[shortenURL] = urlDatabase[shortenURL];
    }
  }
  return verifiedURL;
};

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
    console.log(users[index].password);
    if(users[index].email === email && bcrpyt.compareSync(password, users[index].password)) {
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
  const password = req.body.password;
  const encrpytedPassword = bcrpyt.hashSync(password,10);
  const user = { id: userId, email: req.body.email, password: encrpytedPassword };
  users[userId] = user;
  res.cookie("user_id", user.id);
  res.redirect("/urls");
})

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    return res.status(400).send("This short URL has not been created.");
  }
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId];
  if(!user){
    res.status(400).send("Please Login");
  }
  const templateVars = { urls: urlsForUser(userId), user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortenURL = generateRandomString();
  urlDatabase[shortenURL] = { longURL: req.body.longURL,
                              userID: req.cookies["user_id"]                            
  };
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
  const shortenURL = req.params.id;

  if (!urlDatabase.hasOwnProperty(shortenURL)) {
    return res.status(400).send("This URL does not exist.");
  }
  if (!req.cookies["user_id"]) {
    return res.status(400).send("Please login to view this short URL."); 
  }
  if (!urlsForUser(userId).hasOwnProperty(shortenURL)) {
    return res.status(400).send("You are not authorized to view this link.")
  }
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user};
  
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.updatedURL;
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