var express = require('express');
const path = require('path');
var router = express.Router();
const user_db = require('./../server')("users");


router.post('/page', async (req, res) => {
    let username = req.body.username;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin' || access_level === 'employee')
            res.sendFile(path.join(__dirname, '/users_view.html'));
    }
    else {
        res.send("ERROR!");
    }
})


router.post('/data', async (req, res) => {
    let username = req.body.username;

    res.send(await user_db.REQUEST(username))
})


router.post('/add_user', async (req, res) => {
    let username = req.body.username;
    let new_username = req.body.new_username;
    let new_pass = req.body.new_pass;
    let new_access_level = req.body.new_access_level;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin' || access_level === 'employee') {
            if (new_access_level !== 'client' && access_level === 'employee') {
                setTimeout(res_fun, 1000, res, "Employee have premition to add only clien!");
            }
            else {
                await user_db.CREATE([new_username, new_pass, new_access_level])
                setTimeout(res_fun, 1000, res, "OK!");
            }
        }
    }
    else {
        setTimeout(res_fun, 1000, res, "ERROR!");
    }
})


router.post('/remove_user', async (req, res) => {
    let username = req.body.username;
    let rm_username = req.body.rm_username;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin') {
            user_db.REMOVE(rm_username)

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


router.post('/modify_user', async (req, res) => {
    let username = req.body.username;
    let modify_username = req.body.modify_username;
    let new_al = req.body.new_al;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin') {
            user_db.MODIFY_ACCESS_LEVEL(modify_username, new_al)
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


router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (await user_db.IS_USER_EXIST(username) && await user_db.IS_CORRECT_PASSWORD(username, password)) {
        console.log("OK!!!!")
        res.send({ msg: "OK" });
    }
    else {
        res.send({ msg: "Access denied" });
    }
})



function res_fun(res, msg) {
    res.send({ "msg": msg });
}

module.exports = router;