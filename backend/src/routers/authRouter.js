const validator = require("validator");
const {validateSignUpData} = require("../utils/userInputValidation.js");
const {auth} = require("../middlewares/authMiddleware.js");
const {UserModel} = require("../models/userModel.js");
const express = require('express');


const authRouter = express.Router(); 


authRouter.post('/signup', validateSignUpData, async (req, res)=>{
    let {name, email, password} = req.body;
    try{
        /**
            validator.normalizeEmail(email): Sanitizes email
                By default, the function performs the following actions: 
                - Lowercasing: Converts the entire email address to lowercase.
                - Gmail-Specific Rules:
                    - Removes dots (.) from the local part (e.g., john.doe@gmail.com becomes johndoe@gmail.com).
                    - Removes sub-addresses/tags following a + sign (e.g., user+news@gmail.com becomes user@gmail.com).
                    - Converts @googlemail.com to @gmail.com.
                - Other Provider Support: Includes similar normalization for Outlook.com (Hotmail/Live), Yahoo Mail, and iCloud (MobileMe).
        */
        const cleanEmail = validator.normalizeEmail(req.body.email);

        // Check whether email is already registered in DB.
        
        const existingUser = await UserModel.findOne({'cleanEmail': cleanEmail});
        if(existingUser){
            console.log(`Error: ${req.body.email} email already registered!`)
            res.status(409).send(`${req.body.email} already registered! Please login.`)
        }
        else{
            // Create a new user document and save it to the DB
            const user = new UserModel({
                name,
                email, 
                password, 
                cleanEmail
            });
            await user.save();
            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 8*60*60*1000)});

            res.status(200).send("Signed up Successfully!!");
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err.message)
    }

})


authRouter.post('/login', async (req, res)=>{
    const {email, password} = req.body;
   try{
        // check body is not empty
        if(!req.body)
            throw Error(`Input is required.`);


        // validate email
        if(!email || !validator.isEmail(email)){
           console.log(email)
            throw Error("Invalid credentials");
        }

        // clean the email
        const cleanEmail = validator.normalizeEmail(email);

        // check if exists already in the DB
        const userFromDB = await UserModel.findOne({cleanEmail:cleanEmail});
        if(!userFromDB){
            throw Error('Invalid credentials');
        }
        console.log(userFromDB)
        // If user already exists, check Password matched or not
        const isPasswordCorrect = await userFromDB.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            console.log(`Invalid password: ${password}`);
            throw Error('Invalid credentials.'); 
        }
        // After successful authentication, generate a JWT and set as a cookie in res header
        const token = await userFromDB.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 8*60*60*1000)});
        // res.cookie("token", token, {expires: '7d'});

        res.status(200).json(userFromDB);
   }catch(err){
        console.log(err);
        res.status(400).send(err.message);
   }

})


authRouter.post('/logout', auth, async (req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logout Successful.");

    
})

authRouter.patch('/forgot-password', async (req, res)=>{
    // TODO: verify user via OTP sent to email and allow to set new password

      // validate new password
    // if(req.body.password){
    //     if(!validator.isStrongPassword(req.body.password)){
    //         throw Error(`Strong password is required!!
    //             Constraints:
    //             1. Minimun 8 characters 
    //             2. Minimum 1 lowercase 
    //             3. Minimum 1 uppercase
    //             4. Minimum 1 number
    //             5. Minimum 1 special character
    //             `
    //         );
    //     }
    // }
})
module.exports = {
    authRouter,
}