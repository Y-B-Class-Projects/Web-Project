var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();

router.post('/page', (req, res) => {
    let username = req.body.username;

    let users = get_users();

    if (users.hasOwnProperty(username)) {
        res.sendFile(path.join(__dirname, './flowers_view.html'));
    }
    else {
        res.send("ERROR!");
    }
})


router.post('/data', (req, res) => {
    let username = req.body.username;
    let users = get_users();

    if (users.hasOwnProperty(username)) {
        let rawdata = fs.readFileSync(path.resolve(__dirname, './flowers.json'));
        let flower_catalog = JSON.parse(rawdata);

        res.json(flower_catalog);
    }
    else {
        res.send("ERROR!");
    }
})

function get_users() {
    let rawdata = fs.readFileSync(path.resolve(__dirname, './../users/users.json'));
    return JSON.parse(rawdata);
  }

module.exports = router;