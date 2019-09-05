var express = require("express");
var router = express.Router();
var USER = require("../models/users");
const title = "Algo Scale";

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Algo Scale", errors: {} });
});

router.post("/signup", async(req, res, next) => {
    console.log("Req.body", req.body);
    if (!req.body.email && !req.body.password && !req.body.confirmPassword) {
        return res.render("index", {
            title: title,
            errors: {
                email: {
                    msg: "All fields are mandatory"
                }
            }
        });

    }
    if (req.body.password != req.body.confirmPassword) {
        return res.render("index", {
            title: title,
            errors: {
                email: {
                    msg: "Password and confirm password are diff"
                }
            }
        });

    }
    try {
        let checkForDuplicates = await USER.getUser(req.body);
        console.log("Check for duplicates", checkForDuplicates);

        if (checkForDuplicates && checkForDuplicates.length > 0) {
            res.render("index", {
                title: title,
                errors: {
                    email: {
                        msg: "Id already exists"
                    }
                }
            });
        } else {
            let insertUser = await USER.createUser(req.body);

            let allUsers = await USER.getAllUsers(req.body);
            console.log("insert user", insertUser);
            if (insertUser) {
                req.session.email = insertUser.email;
                // console.log("insertUser", insertUser.email);
                console.log("req.session", req.session.email);
                res.render("profile", {
                    title: title,
                    email: insertUser.email,
                    allUsers: allUsers
                });
            }
        }
    } catch (e) {
        console.log("e", e);
        res.render("index", {
            title: title,
            errors: {
                email: {
                    msg: "Server Error"
                }
            }
        });
    }
});

router.post("/delete-user", async(req, res, next) => {
    if (req.body.users) {
        console.log("users=====>", req.body);
        try {
            console.log("trying to delete user");
            await USER.deleteUser(req.body);
            let allUsers = await USER.getAllUsers(req.session);
            res.render("profile", {
                title: title,
                email: req.session.email,
                allUsers: allUsers
            });
        } catch (e) {
            console.log("error", e);
            res.render("index", {
                title: title,
                errors: {
                    email: {
                        msg: "Server Error"
                    }
                }
            });
        }
    }
});

router.post("/login", async(req, res, next) => {
    if (!req.body.email && !req.body.password) {
        res.render("index", {
            title: title,
            errors: {
                email: {
                    msg: "All the fields are mandatory"
                }
            }
        });
    } else {
        let userData = await USER.authenticateUser(req.body);
        let allUsers = await USER.getAllUsers(req.body);
        if (userData) {
            req.session.email = userData[0].email;
            // console.log("insertUser", insertUser.email);
            console.log("req.session", req.session.email);
            res.render("profile", {
                title: title,
                email: req.session.email,
                allUsers: allUsers
            });
        } else {
            res.render("index", {
                title: title,
                errors: {
                    email: {
                        msg: "Email Or Password Invalid"
                    }
                }
            });
        }
    }
});

router.get("/login-form", function(req, res, next) {
    console.log("Login");
    res.render("login", { title: title, errors: {} });
});

router.get("/logout", function(req, res, next) {
    req.session.destroy();
    res.render("login", { title: title, errors: {} });
});

module.exports = router;