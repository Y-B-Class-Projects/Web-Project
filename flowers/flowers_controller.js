var express = require('express');
const path = require('path');
const multer = require('multer');
var router = express.Router();
const user_db = require('./../server')("users");
const flowers_db = require('./../server')("flowers");
const download = require('image-downloader')

var flowers_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: flowers_storage });


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
        res.send(await flowers_db.REQUEST())
    }
    else {
        res.send("ERROR!");
    }
})


router.post('/add_flower', upload.single('uploaded_file'), async function (req, res) {
    console.log(req.file, req.body)

    let username = req.body.username;
    let flower_name = req.body.new_flower_name;
    let flower_loc = req.body.new_flower_loc;
    let flower_info = req.body.new_flower_info;
    let flower_image_url = req.body.new_flower_image;

    if (await user_db.IS_USER_EXIST(username)) {
        access_level = await user_db.GET_ACCESS_LEVEL(username)

        if (access_level === 'supplier') {
            if (flower_image_url) {

                download.image({ url: flower_image_url, dest: './../../public/images' })
                    .then(async ({ filename }) => {
                        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                        var name = filename.replace(/^.*[\\\/]/, '');
                        await flowers_db.CREATE([flower_name, flower_loc, flower_info, '\images\\' + name])
                    })
                    .then(() => res.send({ "msg": "OK" }))

            }
            else if (req.file) {
                await flowers_db.CREATE([flower_name, flower_loc, flower_info, '\images\\' + req.file.filename])
                res.send({ "msg": "OK" });
            }
            else
                res.send({ "msg": "ERROR" });
        }
        else
            res.send({ "msg": "Only supplier can add flower!" });
    }
    else {
        res.send({ "msg": "ERROR!" });
    }
})



module.exports = router;