const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const {User} = require('../models/user.js');

const auth = async (req, res, next) =>{

    try{
        // get the cookie
        const cookie = req.cookies;

        // verify the jwt token
        const decodedToken = jwt.verify(cookie.token, "secretKey@123")

        // destruct the userId
        const userId = decodedToken._id;

        // fetch the userById and append it to the req
        const userFromDB = await User.findById(userId);
        if(!userFromDB)
            throw Error("User not exist")
        req.user = userFromDB;
        next();
    }catch(err){
        res.status(404).send(err.message);
    }

}

module.exports = {auth};