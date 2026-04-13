const express = require('express');
const {auth} = require('../middlewares/authMiddleware');
const {ConnectionRequestModel} = require('../models/connectionRequestModel');


const connectionRouter = express.Router();

connectionRouter.get('/user/connections', auth, async (req, res)=>{
    try{

        const loggedInUser = req.user;

        // query all the connections(both accepted and was accepted) of logged in user
        const connections = await ConnectionRequestModel.find({
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        })
        .populate('fromUserId', 'name about age gender profilePictureURL skills')
        .populate('toUserId', 'name about age gender profilePictureURL skills');

        // show profile details of the person I have connected to, rather than including my profile details also in the connection info
       const data = connections.map((connection)=>{
            if(connection.fromUserId._id.equals( loggedInUser._id)){
                return {_id: connection._id, toUserId: connection.toUserId}
            }
            return  {_id: connection._id, fromUserId: connection.fromUserId}
       })
        

        console.log(data);
        res.status(200).json(data);

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = {connectionRouter}