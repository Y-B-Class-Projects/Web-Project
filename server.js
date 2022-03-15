const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000

app.use(express.static('public'))

const bodyParser = require('body-parser'); // Middleware

app.use(bodyParser.urlencoded({ extended: false }));


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


app.post('/flower_catalog', (req, res) => {
  let username = req.body.username;

  let users = get_users();

  if (users.hasOwnProperty(username)) {
    res.sendFile(path.join(__dirname, '/flower_catalog.html'));
  }
  else {
    res.send("ERROR!");
  }
})


app.post('/user_management', (req, res) => {
  let username = req.body.username;

  let users = get_users();

  if (users.hasOwnProperty(username)) {

    access_level = users[username].access_level;
    if (access_level.localeCompare("admin") == 0 || access_level.localeCompare("employee") == 0)
      res.sendFile(path.join(__dirname, '/user_management.html'));
  }
  else {
    res.send("ERROR!");
  }
})


app.post('/get_users_list', (req, res) => {
  let username = req.body.username;
  let users = get_users();

  if (users.hasOwnProperty(username)) {

    access_level = users[username].access_level;
    if (access_level.localeCompare("admin") == 0)
      res.json(users);
    else if (access_level.localeCompare("employee") == 0) {

      for (var user_name in users){
        var user = users[user_name];
        if (user.access_level === "client")
          users[user_name].password = "***";
        else
          delete users[user_name];
      }

      res.json(users);
    }
  }
  else {
    res.send("ERROR!");
  }
})


app.post('/flower_list_info', (req, res) => {
  let username = req.body.username;
  let users = get_users();

  if (users.hasOwnProperty(username)) {
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'flowers.json'));
    let flower_catalog = JSON.parse(rawdata);

    res.json(flower_catalog);
  }
  else {
    res.send("ERROR!");
  }
})


app.post('/add_user', (req, res) => {
  let username = req.body.username;
  let new_username = req.body.new_username;
  let new_pass = req.body.new_pass;
  let new_access_level = req.body.new_access_level;
  let users = get_users();


  if (users.hasOwnProperty(username)) {
    access_level = users[username].access_level;
    if (access_level.localeCompare("admin") == 0 || access_level.localeCompare("employee") == 0)
    {
      if (new_access_level.localeCompare("client") != 0 && access_level.localeCompare("employee") == 0)
      {
        setTimeout(res_fun, 1000, res, "Employee have premition to add only clien!"); 
      }
      else
      {
        users = get_users();

        users[new_username] = {"password": new_pass, "access_level": new_access_level};

        fs.writeFile('users.json', JSON.stringify(users), function writeJSON(err) {
          if (err)
          setTimeout(res_fun, 1000, res, "ERROR!"); 
        });
        setTimeout(res_fun, 1000, res, "OK!"); 
      }
    }
  }
  else {
    setTimeout(res_fun, 1000, res, "ERROR!"); 
  }
})


app.post('/remove_user', (req, res) => {
  let username = req.body.username;
  let rm_username = req.body.rm_username;

  let users = get_users();


  if (users.hasOwnProperty(username)) {
    access_level = users[username].access_level;
    if (access_level.localeCompare("admin") == 0)
    {
        users = get_users();

        delete users[rm_username];

        fs.writeFile('users.json', JSON.stringify(users), function writeJSON(err) {
          if (err)
          setTimeout(res_fun, 1000, res, "ERROR");   
        });
        setTimeout(res_fun, 1000, res, "OK");   
    }
    else{
      setTimeout(res_fun, 1000, res, "Error, only admin can delete users!"); 
    }
  }
  else {
    setTimeout(res_fun, 1000, res, "ERROR"); 
  }
})


app.post('/modify_user', (req, res) => {
  let username = req.body.username;
  let modify_username = req.body.modify_username;
  let new_al = req.body.new_al;

  let users = get_users();

  if (users.hasOwnProperty(username)) {
    access_level = users[username].access_level;
    if (access_level.localeCompare("admin") == 0)
    {
        users = get_users();

        users[modify_username].access_level = new_al;

        fs.writeFile('users.json', JSON.stringify(users), function writeJSON(err) {
          if (err)
          setTimeout(res_fun, 1000, res, "ERROR!"); 
        });
        setTimeout(res_fun, 1000, res, "OK"); 
    }
    else{
      setTimeout(res_fun, 1000, res, "Error, only admin can modify users!"); 
    }
  }
  else {
    setTimeout(res_fun, 1000, res, "ERROR!"); 
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


function get_users() {
  let rawdata = fs.readFileSync(path.resolve(__dirname, 'users.json'));
  return JSON.parse(rawdata);
}

function res_fun(res,msg) {
  res.send({"msg":msg});
}