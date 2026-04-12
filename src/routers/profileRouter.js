const {auth} = require("../middlewares/authMiddleware.js");
const {validateEditProfile} = require("../utils/userInputValidation.js")
const express = require('express');




const profileRouter = express.Router();


profileRouter.get('/profile/view', auth, async (req, res)=>{
  
    try{
        res.status(200).send(req.user);
    }catch(err){ 
        console.log(err);
        res.status(404).send(err)
    }

})



profileRouter.patch('/profile/edit', auth, validateEditProfile, async (req, res)=>{
    
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
profileRouter.delete('/profile/delete-account', auth, async (req, res)=>{
  
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

module.exports = {
    profileRouter,
}