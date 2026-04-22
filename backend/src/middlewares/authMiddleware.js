require("dotenv").config();
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const {UserModel} = require('../models/userModel.js');

const auth = async (req, res, next) =>{

    try{
        // get the cookie
        const {token}= req.cookies;
        if(!token){
            return res.status(401).send('Unauthorized!! Please login to access this resource.')
        }
        
        // verify the jwt token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // destruct the userId
        const {_id: userId} = decodedToken;

        // fetch the userById and append it to the req
        const userFromDB = await UserModel.findById(userId);
        if(!userFromDB)
            return res.status(404).send('User not found!!')
        req.user = userFromDB;
        next();
    }catch(err){
        res.send(err.message);
    }

}

module.exports = {auth};