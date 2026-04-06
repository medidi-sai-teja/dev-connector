require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database.js");
const {User} = require('./models/user.js')
const {validateSignUpData, validateUpdateData} = require("./utils/validation.js")
const validator = require("validator");
const bcrypt = require('bcryptjs');


const port = process.env.PORT;

const app = express();


connectDB() 
.then(()=> {
    console.log("Successfully connected to the DB cluster!!");
    app.listen(port, ()=> console.log(`Server is running... on PORT ${port}`))
})
.catch(err=> console.log(`DataBase Connection Error: ${err}`));


app.use(express.json());

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
        
        // If user already exists, check Passoword matched or not
        const isPasswordCorrect = await bcrypt.compare(password, userFromDB.password); 
        if(!isPasswordCorrect){
            console.log('Invalid credentials.');
            throw Error('Invalid credentials.');
        }
        res.status(200).send("Login Successful.");
   }catch(err){
        console.log(err);
        res.status(400).send(err.message);
   }

})

app.get('/user/:email', async (req, res)=>{
  
    const email = validator.normalizeEmail(req.params?.email);
    try{
        if(!email){
            console.log("Invalid user.");
            throw new Error("Invalid user.");
        }
        const userFromDB = await User.findById(email);
        res.status(200).send(userFromDB);
    }catch(err){ 
        console.log(err);
        res.status(404).send(err)
    }

})

// Allow user to findById in params and update user data 
app.patch('/user/:userId',validateUpdateData, async (req, res)=>{
    
    try{
        let userFromDB = await User.findById(req.params?.userId);
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
app.delete('/user/', async (req, res)=>{
  
    try{
        if(!req.body){
            throw Error("Input is required.")
    }
        if(!validator.isEmail(req.body.email)){
            throw Error("Invalid credentials");
        }
        const userFromDB = await User.findOneAndDelete(validator.normalizeEmail(req.body?.email));
        if(!userFromDB){
            throw Error("User does not exist.")
        }
        console.log(userFromDB);
        res.send("Successfully deleted user!!");
    }
    catch(err){
        console.log(err);
        res.send(err.message);
    }

})

