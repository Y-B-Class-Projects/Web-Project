var express = require('express');
const path = require('path');
const fs = require('fs');
var router = express.Router();


router.post('/page', (req, res) => {
    let username = req.body.username;

    let users = get_users();

    if (users.hasOwnProperty(username)) {

        access_level = users[username].access_level;
        if (access_level.localeCompare("admin") == 0 || access_level.localeCompare("employee") == 0)
            res.sendFile(path.join(__dirname, '/users_view.html'));
    }
    else {
        res.send("ERROR!");
    }
})


router.post('/data', (req, res) => {
    let username = req.body.username;
    let users = get_users();

    if (users.hasOwnProperty(username)) {

        access_level = users[username].access_level;
        if (access_level.localeCompare("admin") == 0)
            res.json(users);
        else if (access_level.localeCompare("employee") == 0) {

            for (var user_name in users) {
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



router.post('/add_user', (req, res) => {
    let username = req.body.username;
    let new_username = req.body.new_username;
    let new_pass = req.body.new_pass;
    let new_access_level = req.body.new_access_level;
    let users = get_users();


    if (users.hasOwnProperty(username)) {
        access_level = users[username].access_level;
        if (access_level.localeCompare("admin") == 0 || access_level.localeCompare("employee") == 0) {
            if (new_access_level.localeCompare("client") != 0 && access_level.localeCompare("employee") == 0) {
                setTimeout(res_fun, 1000, res, "Employee have premition to add only clien!");
            }
            else {
                users = get_users();

                users[new_username] = { "password": new_pass, "access_level": new_access_level };

                fs.writeFile(path.resolve(__dirname, './users.json'), JSON.stringify(users), function writeJSON(err) {
                    if (err)
                        setTimeout(res_fun, 1000, res, "ERROR add user");
                    else{
                        setTimeout(res_fun, 1000, res, "OK!");
                    }
                });
            }
        }
    }
    else {
        setTimeout(res_fun, 1000, res, "ERROR!");
    }
})


router.post('/remove_user', (req, res) => {
    let username = req.body.username;
    let rm_username = req.body.rm_username;

    let users = get_users();


    if (users.hasOwnProperty(username)) {
        access_level = users[username].access_level;
        if (access_level.localeCompare("admin") == 0) {
            users = get_users();

            delete users[rm_username];

            fs.writeFile(path.resolve(__dirname, './users.json'), JSON.stringify(users), function writeJSON(err) {
                if (err)
                    setTimeout(res_fun, 1000, res, "ERROR");
            });
            setTimeout(res_fun, 1000, res, "OK");
        }
        else {
            setTimeout(res_fun, 1000, res, "Error, only admin can delete users!");
        }
    }
    else {
        setTimeout(res_fun, 1000, res, "ERROR");
    }
})


router.post('/modify_user', (req, res) => {
    let username = req.body.username;
    let modify_username = req.body.modify_username;
    let new_al = req.body.new_al;

    let users = get_users();

    if (users.hasOwnProperty(username)) {
        access_level = users[username].access_level;
        if (access_level.localeCompare("admin") == 0) {
            users = get_users();

            users[modify_username].access_level = new_al;

            fs.writeFile(path.resolve(__dirname, './users.json'), JSON.stringify(users), function writeJSON(err) {
                if (err)
                    setTimeout(res_fun, 1000, res, "ERROR!");
            });
            setTimeout(res_fun, 1000, res, "OK");
        }
        else {
            setTimeout(res_fun, 1000, res, "Error, only admin can modify users!");
        }
    }
    else {
        setTimeout(res_fun, 1000, res, "ERROR!");
    }
})

function res_fun(res, msg) {
    res.send({ "msg": msg });
}

function get_users() {
    let rawdata = fs.readFileSync(path.resolve(__dirname, './users.json'));
    return JSON.parse(rawdata);
  }


module.exports = router;