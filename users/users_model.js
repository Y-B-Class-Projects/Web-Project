const mongo = require("mongoose");


module.exports = db => {
    let schema = new mongo.Schema({
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        access_level: { type: String, enum: ['client', 'admin', 'employee', 'supplier'] },
    }, { autoIndex: false });


    schema.statics.CREATE = async function (user) {
        return this.create({
            username: user[0],
            password: user[1],
            access_level: user[2]
        });
    };


    schema.statics.REQUEST = async function (user_token) {
        user_req = await this.find({ username: user_token }).exec()
        access_level = user_req[0].access_level

        all_users = await this.find({}).exec()

        if (access_level === 'admin')
            return all_users
        else {
            console.log(all_users.filter((u) => u.access_level === 'client'))
            return all_users.filter((u) => u.access_level === 'client');
        }
    };

    schema.statics.GET_ACCESS_LEVEL = async function(user_token) {
        return (await this.find({ username: user_token }).exec())[0].access_level;
    };

    schema.statics.IS_USER_EXIST = async function(user_token) {
        user = await  this.find({ username: user_token }).exec();
        return user.length === 1;
    };

    schema.statics.DELETE = async function(username) {
        await this.deleteOne({ username: username }).exec();
    };

    schema.statics.MODIFY_ACCESS_LEVEL = async function(username, new_al) {
        await this.updateOne({ username: username }, {$set: {access_level: new_al}}).exec();
    };

    schema.statics.IS_CORRECT_PASSWORD = async function(username, pass) {
        user = (await this.find({ username: username }).exec())[0];
        return user.password == pass
    };

    db.model('users', schema);
};
