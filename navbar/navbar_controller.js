var express = require('express');
const path = require('path');
var router = express.Router();
const user_db = require('./../server')("users");


router.post('/page', async (req, res) => {
    let username = req.body.username;

    access_level = await user_db.GET_ACCESS_LEVEL(username)

    if (access_level === 'admin' || access_level === 'employee')
        res.sendFile(path.join(__dirname, '/navbar_view_admin.html'));
    else if (access_level === 'client' || access_level === 'supplier')
        res.sendFile(path.join(__dirname, '/navbar_view_client.html'));
})


module.exports = router;