const express = require("express");
const cookieSession = require('cookie-session');
const bcrpyt = require("bcryptjs");
const { getUserByEmail } = require('./helpers');
const { urlsForUser } = require('./helpers'); 
const { generateRandomString } = require('./helpers');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1","key2"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//Database
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
    userID: "usereRandomID",
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
    id: "usereRandomID",
    email: "a@a.com",
    password: bcrpyt.hashSync("a"),
  },
  
};

//GET,POSTS are listed in alphabetical order of actions
//Login
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  res.render("urls_login", {user});
});

app.post("/login",(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userAccount = getUserByEmail(email, users);
  
  if (!req.body.email || !req.body.password) {
    return res
            .status(400)
            .send("One or more field is empty.");
  }
  
  if (!userAccount) {
    return res
    .status(400)
    .send("Invalid email.")
  }

  if (userAccount.email === email && bcrpyt.compareSync(password, userAccount.password)) {
      req.session.user_id = userAccount.id;
      return res.redirect("/urls");
  }

  return res
          .status(400)
          .send("Email or Password does not match.")
});

//Logout and clear cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Register
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  res.render("urls_register", {user});
});

app.post("/register",(req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Email or Password is missing.");
  }
  if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send("The email is in use.");
  }

  //registering new user
  const userId = generateRandomString();
  const password = req.body.password;
  const encrpytedPassword = bcrpyt.hashSync(password,10);
  const user = { id: userId, email: req.body.email, password: encrpytedPassword };
  users[userId] = user;
  req.session.user_id = user.id;
  res.redirect("/urls");
})

//Directs to longURL based on shortURL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  if (!urlDatabase.hasOwnProperty(shortURL))
  if (!longURL) {
    return res
            .status(400)
            .send("Short URL does not exist");
  }
  res.redirect(longURL);
});

//Main Page if loged in
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if(!user){
    return res
            .status(400)
            .send("Please login or register to get permission");
  }
  const templateVars = { urls: urlsForUser(userId, urlDatabase), user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userId = req.session.user_id;
  const user = users[userId];
  if (!req.session.user_id) {
    return res.status(400).send("Please login to create this URL."); 
  }

  if (!urlsForUser(userId, urlDatabase).hasOwnProperty(shortURL)) {
    return res.status(400).send("You don't have permission to create an URL")
  }
  urlDatabase[shortURL] = { longURL: req.body.longURL,
                              userID: req.session.user_id                            
  };
  res.redirect("/urls"); 
});

//Create New shortURL
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if(!user) {
    res.status(400).redirect("/login");
  }
  res.render("urls_new", {user});
});

//View ShortURL
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const shortURL = req.params.id;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(400).send("This URL does not exist.");
  }
  
  if (!req.session.user_id) {
    return res.status(400).send("Please login to view this URL."); 
  }

  if (!urlsForUser(userId, urlDatabase).hasOwnProperty(shortURL)) {
    return res.status(400).send("You don't have permission to view this URL")
  }
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user};
  
  res.render("urls_show", templateVars);
});

//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!req.session.user_id) {
    return res.status(400).send("Please login to delete the URL."); 
  }

  if (!urlsForUser(userId, urlDatabase).hasOwnProperty(shortURL)) {
    return res.status(400).send("You don't have permission to remove this URL")
  }
  
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//Edit the longURL
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.updatedURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
