const express = require('express');
const {auth} = require('../middlewares/authMiddleware');
const {ConnectionRequestModel} = require('../models/connectionRequestModel');
const {UserModel} = require('../models/userModel')

const userRouter = express.Router();
const exposableUserData = 'name about age gender profilePictureURL skills';


userRouter.get('/user/connections', auth, async (req, res)=>{
    try{
        const loggedInUser = req.user;

        // query all the connections(both accepted and was accepted) of logged in user
        const connections = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        })
        .populate('fromUserId', exposableUserData)
        .populate('toUserId', exposableUserData);

        // show profile details of the person I have connected to, rather than including my profile details also in the connection info
       const data = connections.map((connection)=>{
            if(connection.fromUserId._id.equals( loggedInUser._id)){
                return {_id: connection._id, toUserId: connection.toUserId}
            }
            return  {_id: connection._id, fromUserId: connection.fromUserId}
       }) 
        

        console.log(data);
        res.status(200).json({urConnections: data});

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})

userRouter.get('/user/feed', auth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50? 50: limit;
        let page = parseInt(req.query.page)
        page = page>0? page: 1;
    
        const skip = (page-1) * 10;
        
        const userInvolvedConnections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        })
        .select('fromUserId toUserId')

        const hideUserProfiles = new Set();
        userInvolvedConnections.forEach(ConReq=>{
            hideUserProfiles.add(ConReq.fromUserId.toString());
            hideUserProfiles.add(ConReq.toUserId.toString());
        })

        const unknownUsers = await UserModel.find({
                $and:[
                    {_id: {$nin: Array.from(hideUserProfiles)}},
                    {_id: {$ne: loggedInUser._id}}
                ]
        })
        .select(exposableUserData)
        .skip(skip)
        .limit(limit)

        
        res.status(200).json({data:unknownUsers});
    }catch(err){
        console.log(err)
        res.status(500).send(err.message);
    }
})

module.exports = {userRouter}

