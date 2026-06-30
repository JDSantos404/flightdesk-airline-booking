const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth");


// Check if Email Exists
module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){

        // The result is sent back to the client via the "then" method found in the route file
        return User.find({ email : req.body.email })
        .then(result => {

            if (result.length > 0) {

                return res.status(409).send({message : "Duplicate email found"});


            } else {

                return res.status(200).send({message: "No duplicate email found"});

            };
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        res.status(400).send({ error : "No Email Found"});
    }
};


// Register User
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    }

    else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid" });
    }

    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    }

    else {


        return User.findOne({ email: req.body.email })
        .then(existingUser => {

            if (existingUser) {
                return res.status(409).send({
                    error: "Email already exists"
                });
            }

            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNo: req.body.mobileNo,
                password: bcrypt.hashSync(req.body.password, 10),
                isAdmin: false
            });

            return newUser.save()
            .then(result => res.status(201).send({
                message: "Registered Successfully"
            }))
            .catch(error => errorHandler(error, req, res));

        })
        .catch(error => errorHandler(error, req, res));
    }
};


// Login User
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {  

        return User.findOne({ email: req.body.email })
        .then(result => {


            if(result == null) {

                return res.status(404).send({ error: "No Email Found" });
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if (isPasswordCorrect) {
                    console.info(`[AUTH] Login success: ${result.email}`);

                    return res.status(200).json({
                        message: "Login successful",
                        access: auth.createAccessToken(result)
                    });
                } else {
                    return res.status(401).send({ error: "Email and password do not match" });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        return res.status(400).send({ error: "Invalid Email" });
    }
}



// Get User Profile
module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
        .then(user => {

            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            const userObj = user.toObject();
            delete userObj.password;

            return res.status(200).send(userObj);
        })
        .catch(error => errorHandler(error, req, res));
};


// Update Password
module.exports.updatePassword = (req, res) => {

    const userId = req.user.id;
    const { newPassword } = req.body;

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    return User.findByIdAndUpdate(userId, { password: hashedPassword })
        .then(() => {
            return res.status(200).send({ 
                message: "Password reset successfully" 
            });
        })
        .catch(error => errorHandler(error, req, res));
};


// Set as Admin
module.exports.setAsAdmin = (req, res) => {

    return User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin: true },
        { new: true }
    )
    .then(result => res.status(200).send(result))
    .catch(err => errorHandler(err, req, res));
}


// Get All Users
module.exports.getAllUsers = (req, res) => {

    return User.find({})
        .then(users => {
            return res.status(200).send(users);
        })
        .catch(error => errorHandler(error, req, res));
};