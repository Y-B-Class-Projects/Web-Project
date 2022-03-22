const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000


app.use(express.static('public'))

const bodyParser = require('body-parser'); // Middleware

app.use(bodyParser.urlencoded({ extended: false }));

var flowers = require('./flowers/flowers_controller.js');
app.use('/flowers', flowers);

var users = require('./users/users_controller.js');
app.use('/users', users);

app.get('/', (req, res) => {
  res.render('index.html')
})


app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  console.log(username + ":" + password)

  let users = get_users();
  if (username in users && password.localeCompare(users[username].password) == 0) {
    res.send({ msg: "OK" });
  }
  else {
    res.send({ msg: "Access denied" });
  }
})

app.post('/navbar', (req, res) => {
  let username = req.body.username;
  let users = get_users();

  access_level = users[username].access_level;


  if (access_level.localeCompare("admin") == 0 || access_level.localeCompare("employee") == 0)
    res.sendFile(path.join(__dirname, '/navbar_admin.html'));
  else if (access_level.localeCompare("client") == 0 || access_level.localeCompare("supplier") == 0)
    res.sendFile(path.join(__dirname, '/navbar_client.html'));
})



app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})


function get_users() {
  let rawdata = fs.readFileSync(path.resolve(__dirname, './users/users.json'));
  return JSON.parse(rawdata);
}
