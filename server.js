const app = require('express')()
const bodyParser = require('body-parser')
const logger = require('morgan')
const Rehive = require("rehive")
var rehive = null;
const port = process.env.PORT || 3030

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.get('*', (req, res) => {
  console.log(req.body);
  res.send('Hello world')
})
app.put("*",(req,res) => {
  res.send("Hello there");
});
app.post("/first",(req,res) => {
  var response;
  if(req.body.userInput) {
    response = {
        "prompt" : `Select menu option :
        1.Check Balance
        2.Make transaction
        3.Exit`,
        "end" : false,
        "nextPage":"Page2"
      };
  }
  if(req.body.nextPage === "Page2" && req.body.userInput === "2") {
    response = {
      "prompt" : `Enter user cell number :`,
      "end" : false,
      "nextPage":"endPage"
    };
  }
  else {
    response = {
      "prompt" : `Welcome to mymani : Please enter your password`,
      "end" : false
     };
  }
   console.log(req.body);
   res.send(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

/**
 * Rehive login, will go to the controller.
 */
function login(phoneNo,password) {
  return new Promise((resolve,reject)=>{
    rehive = new Rehive({ apiVersion: 3 })
  rehive.auth.login({
      user: phoneNo,
      company: "1dod1",
      password: password
  }).then(function (user) {
      return resolve(user);
  }, function (err) {
      return reject(err)
  })
  })
}
/**
 * Checks the user account balance.
 */
function checkBalance(cell,pwd){
  return new Promise((resolve,reject)=>{
    login(cell,pwd).then((loggedInUser)=>{
      console.log(JSON.stringify(loggedInUser))
      return resolve(loggedInUser.user.balance);
     },(error)=>{
       //login error
      return reject(error)
     })
  })
}