var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
const user_db = require('./../server')("users");
const flowers_db = require('./../server')("flowers");


router.post('/page', async (req, res) => {
    let username = req.body.username;

    if (await user_db.IS_USER_EXIST(username)) {
        res.sendFile(path.join(__dirname, './flowers_view.html'));
    }
    else {
        res.send("ERROR!");
    }
})


router.post('/data', async (req, res) => {
    let username = req.body.username;

    if (await user_db.IS_USER_EXIST(username)) {
        let rawdata = fs.readFileSync(path.resolve(__dirname, './flowers.json'));
        let flower_catalog = JSON.parse(rawdata);

        res.json(flower_catalog);
    }
    else {
        res.send("ERROR!");
    }
})


module.exports = router;