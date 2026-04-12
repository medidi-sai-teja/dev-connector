require("dotenv").config();
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const {User} = require('../models/userModel.js');

const auth = async (req, res, next) =>{

    try{
        // get the cookie
        const {cookies: cookie }= req;

        // verify the jwt token
        const decodedToken = jwt.verify(cookie.token, process.env.JWT_SECRET_KEY)

        // destruct the userId
        const {_id: userId} = decodedToken;

        // fetch the userById and append it to the req
        const userFromDB = await User.findById(userId);
        if(!userFromDB)
            return res.status(404).send('User not found!!')
        req.user = userFromDB;
        next();
    }catch(err){
        res.send(err.message);
    }

}

module.exports = {auth};