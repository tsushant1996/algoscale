var model = require('../schema/schema');
const ObjectID = require('mongodb').ObjectID;
var USERS_COLLECTION = model.users;

var users = {
    createUser: async(userData) => {
        let user = new USERS_COLLECTION({
            'email': userData.email,
            'password': userData.password,
            'createdAt': new Date(),
            'updatedAt': new Date()
        });

        try {
            let data = await user.save();
            console.log('resultdata', data);
            return data;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },


    getAllUsers: async(userData) => {

        try {

            let data = await USERS_COLLECTION.find({ email: { $nin: [userData.email] } });
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

    },
    getUser: async(userData) => {

        try {

            let data = await USERS_COLLECTION.find({ 'email': userData.email });
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

    },

    deleteUser: async(data) => {
        let query = { _id: new ObjectID(data.users) };
        try {
            console.log("Delete users ===>");

            let data = await USERS_COLLECTION.find(query);
            if (data && data.length > 0) {
                data = await USERS_COLLECTION.deleteOne(query);
                console.log('dataDelete');
                return data;
            } else {
                throw new Error('Data not Found');
            }
        } catch (err) {
            console.log("---------------->", err);
            throw new Error(err);
        }
    },

    authenticateUser: async(userData) => {

        try {

            let data = await USERS_COLLECTION.find({ 'email': userData.email, 'password': userData.password });
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

    },
};

module.exports = users;