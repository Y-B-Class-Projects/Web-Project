const mongo = require("mongoose");


module.exports = db => {
    let schema = new mongo.Schema({
        name: { type: String, required: true, unique: true, index: true },
        loc: { type: String, required: true },
        info: { type: String,  required: true},
        image_path: { type: Object,  required: true},
    }, { autoIndex: false });


    schema.statics.CREATE = async function (flower) {
        return this.create({
            name: flower[0],
            loc: flower[1],
            info: flower[2],
            image_path: flower[3],
        });
    };


    schema.statics.REQUEST = async function () {
        return this.find({}).exec()
    };


    db.model('flowers', schema);
};
