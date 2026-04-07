require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database.js");
const {User} = require('./models/user.js');
const {validateSignUpData, validateUpdateData} = require("./utils/validation.js")
const validator = require("validator");
const {auth} = require("./middlewares/authentication");
const cookieParser = require("cookie-parser");

const port = process.env.PORT;

const app = express();


connectDB() 
.then(()=> {
    console.log("Successfully connected to the DB cluster!!");
    app.listen(port, ()=> console.log(`Server is running... on PORT ${port}`))
})
.catch(err=> console.log(`DataBase Connection Error: ${err}`));


app.use(express.json());
app.use(cookieParser());

app.post('/signup', validateSignUpData, async (req, res)=>{
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
        const existingUser = await User.findOne({'cleanEmail': cleanEmail});
        if(existingUser){
            console.log(`Error: ${req.body.email} email already registered!`)
            res.status(409).send(`${req.body.email} already registered! Please login.`)
        }
        else{
            // Create a new user document and save it to the DB
            const user = new User({
                name,
                email, 
                password, 
                cleanEmail
            });
            await user.save();
            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 1*60*1000)});

            res.status(200).send("Signed up Successfully!!");
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err.message)
    }

})

app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
   try{
        // check body is not empty
        if(!req.body)
            throw Error(`Input is required.`);


        // validate email
        if(!email || !validator.isEmail(email)){
            throw Error("Invalid credentials");
        }

        // clean the email
        const cleanEmail = validator.normalizeEmail(email);

        // check if exists already in the DB
        const userFromDB = await User.findOne({cleanEmail:cleanEmail});
        if(!userFromDB){
            throw Error('Invalid credentials');
        }
        
        // If user already exists, check Password matched or not
        const isPasswordCorrect = await userFromDB.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            console.log('Invalid credentials.');
            throw Error('Invalid credentials.');
        }
        // After successful authentication, generate a JWT and set as a cookie in res header
        const token = await userFromDB.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 1*60*1000)});

        res.status(200).send("Login Successful.");
   }catch(err){
        console.log(err);
        res.status(400).send(err.message);
   }

})

app.get('/profile', auth, async (req, res)=>{
  
    try{
        res.status(200).send(req.user);
    }catch(err){ 
        console.log(err);
        res.status(404).send(err)
    }

})


app.patch('/profile', auth, validateUpdateData, async (req, res)=>{
    
    try{
        let userFromDB = req.user;
        if(userFromDB){
            Object.assign(userFromDB, req.body);
            await userFromDB.save();

            console.log(userFromDB);
            res.send(`Successfully updated user data.`);
        }
    }catch(err){
        console.log(err)
        res.status(400).send(err.message)
    }

})

// find by email in the body and delete
app.delete('/profile', auth, async (req, res)=>{
  
    try{    
        const userFromDB = req.user;
        await userFromDB.deleteOne()
        console.log(userFromDB);
        res.send("Successfully deleted user!!");
    }
    catch(err){
        console.log(err);
        res.send(err.message);
    }

})

