var express = require('express');
const path = require('path');
const sessions = require('express-session');
var router = express.Router();
const user_db = require('./../server')("users");

router.get('/page', async (req, res) => {
    email = req.session.userid
    if (await user_db.IS_USER_EXIST(email))
        res.sendFile(path.join(__dirname, './main_view.html'));
    else
        res.redirect('/login.html');
})


module.exports = router;