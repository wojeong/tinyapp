const bcrpyt = require("bcryptjs");

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

module.exports = {urlDatabase, users}