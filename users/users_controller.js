var express = require('express');
const path = require('path');
const sessions = require("express-session");
var router = express.Router();
const user_db = require('./../server')("users");


router.post('/page', async (req, res) => {
    let username = req.body.username;

    if (await user_db.IS_USER_EXIST(username)) {
        res.send("USER EXIST!");
    } else {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin' || access_level === 'employee')
            res.sendFile(path.join(__dirname, '/users_view.html'));
    }
})


router.post('/data', async (req, res) => {
    let username = req.body.username;

    if (await user_db.IS_USER_EXIST(username)) {
        res.send(await user_db.REQUEST(username))
    } else {
        res.send("ERROR!");
    }
})


router.post('/add_user', async (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let pass = req.body.password;

    if (await user_db.IS_USER_EXIST(email)) {
        setTimeout(res_fun, 1000, res, "USER EXIST!");
    } else {
        await user_db.CREATE([email, username, pass])
        setTimeout(res_fun, 1000, res, "OK");
    }
})


router.post('/remove_user', async (req, res) => {
    let username = req.body.username;
    let rm_username = req.body.rm_username;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)
        if (access_level === 'admin') {
            await user_db.DELETE(rm_username)

            setTimeout(res_fun, 1000, res, "OK");
        } else {
            setTimeout(res_fun, 1000, res, "Error, only admin can delete users!");
        }
    } else {
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
        } else {
            setTimeout(res_fun, 1000, res, "Error, only admin can modify users!");
        }
    } else {
        setTimeout(res_fun, 1000, res, "ERROR!");
    }
})


router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    console.log(email, password)

    if (await user_db.IS_USER_EXIST(email) && await user_db.IS_CORRECT_PASSWORD(email, password)) {
        req.session.userid = email;

        res.send({msg: "OK"});
    } else {
        res.send({msg: "Access denied"});
    }
})

router.get('/username', async (req, res) => {
    let email = req.session.userid;

    if (await user_db.IS_USER_EXIST(email)) {
        username = await user_db.GET_USER_NAME_BY_EMAIL(email)
        res.send({msg: username});
    } else {
        res.send({msg: "ERROR, no username, please reload"});
    }
})


function res_fun(res, msg) {
    res.send({"msg": msg});
}

module.exports = router;