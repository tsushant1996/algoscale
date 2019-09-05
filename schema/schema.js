var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');



//+++++ USERSCHEMA ++++//

var users = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    },
}, { collection: 'authentic_users' });

exports.users = mongoose.model('users', users);