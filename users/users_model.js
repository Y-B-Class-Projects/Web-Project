const mongo = require("mongoose");


module.exports = db => {
    let schema = new mongo.Schema({
        email: {type: String, required: true, unique: true, index: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
    }, {autoIndex: false});


    schema.statics.CREATE = async function (user) {
        console.log(user)
        return this.create({
            email: user[0],
            username: user[1],
            password: user[2]
        });
    };


    schema.statics.REQUEST = async function (user_token) {
        user_req = await this.find({username: user_token}).exec()
        access_level = user_req[0].access_level

        all_users = await this.find({}).exec()

        if (access_level === 'admin')
            return all_users
        else {
            console.log(all_users.filter((u) => u.access_level === 'client'))
            return all_users.filter((u) => u.access_level === 'client');
        }
    };

    schema.statics.GET_ACCESS_LEVEL = async function (user_token) {
        return (await this.find({username: user_token}).exec())[0].access_level;
    };

    schema.statics.IS_USER_EXIST = async function (_email) {
        user = await this.find({email: _email}).exec();
        return user.length === 1;
    };

    schema.statics.DELETE = async function (username) {
        await this.deleteOne({username: username}).exec();
    };

    schema.statics.MODIFY_ACCESS_LEVEL = async function (username, new_al) {
        await this.updateOne({username: username}, {$set: {access_level: new_al}}).exec();
    };

    schema.statics.IS_CORRECT_PASSWORD = async function (_email, pass) {
        user = (await this.find({email: _email}).exec())[0];
        return user.password === pass
    };

    schema.statics.GET_USER_NAME_BY_EMAIL = async function (_email) {
        user = (await this.find({email: _email}).exec())[0];
        return user.username;
    };

    db.model('users', schema);
};
