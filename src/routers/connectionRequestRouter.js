const express = require('express');
const {ConnectionRequest} = require('../models/connectionRequestModel');
const {User} = require('../models/userModel');
const {auth} = require('../middlewares/authMiddleware');

const connectionRequestRouter = express.Router();

// send connection request or ignore (status: interested, ignored)
connectionRequestRouter.post('/request/send/:status/:toUserId', auth, async (req, res)=>{

    try{
        if(!req.params){
            return res.status(400).send('params input is required!')
        }
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatuses = ['interested', 'ignored'];

        // validate status
        if(!allowedStatuses.includes(status)){
            return res.status(400).send('Invalid status provided!');
        }

        if(!toUserId){
            return res.status(404).send('toUser input is required')
        }

        const toUser = await User.findById(toUserId);

        // toUser must exist in the DB
        if(!toUser){
            return res.status(404).send('toUser not found')
        }

        // Restrict user from sending connection request to themselves
        if(fromUserId.equals(toUserId))
            return res.status(400).send('You cannot send connection request to yourself!');

        //status should be interested
        if(status === 'interested'){
            // Restrict duplicate connection requests
            
            const existingConnectionRequest = await ConnectionRequest.findOne({

                $or:[
                        {fromUserId, toUserId},
                        {fromUserId : toUserId, toUserId : fromUserId}
                ]
            });

            if(existingConnectionRequest){
                return res.status(400).json({
                    message:`Connection request already exists!`, 
                    existingConnectionRequest
                });
            }
        
            const newConnectionRequest = await new ConnectionRequest({fromUserId, toUserId, status});
            await newConnectionRequest.save();
            res.status(200).json({
                message: 'Connection request sent successfully.', 
                connectionInfo: newConnectionRequest
            })
        }       
        
    }catch(err){
        console.log(err);
        res.send(err.message)
    }
})

// toUser suppsed to accept/reject connection request (status: accepted/rejected)
// fromUser supposed to cancel already sent connection request(status: canceled)

connectionRequestRouter.patch('/request/review/:reviewType/:connectionRequestId/:status', auth, async (req, res)=>{
    try{
        if(!req.params){
           return res.status(400).send('params input is required!');
        }

        const loggedInUserId = req.user._id;
        const {reviewType, status, connectionRequestId} = req.params;
        const allowedStatus = ['accepted', 'rejected', 'canceled'];
        const allowedreviewType = ['sent', 'received'];

        if(!reviewType || !connectionRequestId || !status){
            return res.status(400).send('reviewType, connectionId and status input is required!');
        }

        if(!allowedreviewType.includes(reviewType)){
            return res.status(400).send('Invalid reviewType input!');
        }
        if(!allowedStatus.includes(status)){
            return res.status(400).send('Invalid status input!');
        }

        if(reviewType === 'received'){

            const existingConnectionRequest = await ConnectionRequest.findOne({
                _id: connectionRequestId,
                toUserId: loggedInUserId,
                status: 'interested'
            });

            if(!existingConnectionRequest){
                console.log(existingConnectionRequest);
                return res.status(404).send('Connection Request does not exist!');
            }


            if(status === 'accepted'){
                existingConnectionRequest.status = status;
                await existingConnectionRequest.save();
                return res.status(200).send(`Connection Request ${status}!!`)
            }
            else if(status === 'rejected'){
                await existingConnectionRequest.deleteOne();
                return res.status(200).send(`Connection Request ${status} and deleted!!`);
            }
        }

        // if fromUser is logged in and want to cancel sent connection request
        if(reviewType === 'sent'){
            
            const existingConnectionRequest = await ConnectionRequest.findOne({
                _id: connectionRequestId,
                fromUserId: loggedInUserId,
                status: 'interested'
            });

            if(!existingConnectionRequest){
                return res.status(404).send('Connection Request does not exist!');
            }

            if(status === 'canceled'){
                await existingConnectionRequest.deleteOne();
                return res.status(200).send(`Connection Request ${status} and deleted!!`);
            }

        }
        
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
})

module.exports = {connectionRequestRouter}