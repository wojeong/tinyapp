
//Helper function that returns user object based on email address entered
const getUserByEmail = function(userEmail, users) {
  for (const index in users) {
    if (users[index].email === userEmail) {
      return users[index];
    }
  }
  return;
};

//Helper function that returns URL objects that created by the user
const urlsForUser = function(id, urlDatabase) {
  const verifiedURL = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      verifiedURL[shortURL] = urlDatabase[shortURL];
    }
  }
  return verifiedURL;
};

//Hellper function that generates a random string with the length of 6
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

//Export
module.exports = {getUserByEmail, urlsForUser, generateRandomString}