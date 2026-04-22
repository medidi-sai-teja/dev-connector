const express = require('express');
const {ConnectionRequestModel} = require('../models/connectionRequestModel');
const {UserModel} = require('../models/userModel');
const {auth} = require('../middlewares/authMiddleware');


const connectionRequestRouter = express.Router();


connectionRequestRouter.post('/feed/requests/send/:status/:toUserId', auth, async (req, res)=>{
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

        const toUser = await UserModel.findById(toUserId);

        // toUser must exist in the DB
        if(!toUser){
            return res.status(404).send('toUser not found')
        }

        // Restrict user from sending connection request to themselves
        if(fromUserId.equals(toUserId))
            return res.status(400).send('You cannot send connection request to yourself!');

        
            // Restrict duplicate connection requests
            
        const existingConnectionRequest = await ConnectionRequestModel.findOne({

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
    
        const newConnectionRequest = new ConnectionRequestModel({fromUserId, toUserId, status});
        await newConnectionRequest.save();
        res.status(200).json({
            message: `Connection request was ${status}.`, 
            connectionInfo: newConnectionRequest
        })        

    }catch(err){
        console.log(err);
        res.send(err.message)
    }
})

connectionRequestRouter.get('/user/requests/:requestType', auth, async (req,res)=>{
    try{
        if(!req.params){
            return res.status(400).send(`requestType input is required`);
        }

        const loggedInUser = req.user;
        const {requestType} = req.params;
        const allowedRequestTypes = ['sent', 'received'];

        if(!allowedRequestTypes.includes(requestType)){
            return res.status(400).send('Invalid requestType');
        }

        if(requestType === 'received'){
            // get received requests
            const receivedRequests = await ConnectionRequestModel.find({
                toUserId: loggedInUser._id,
                status: 'interested'
            }).populate('fromUserId', 'name about age gender profilePictureURL skills');
                
            res.status(200).send(receivedRequests)
        }
        else if(requestType === 'sent'){
            // get sent requests
            const sentRequests = await ConnectionRequestModel.find({
                fromUserId: loggedInUser._id,
                status: 'interested'
            })
            .populate('toUserId', 'name about age gender profilePictureURL skills');

            res.status(200).send(sentRequests)
        }

    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
   

})


// Allow user to accept/reject received requests 

connectionRequestRouter.post("/request/review/:status/:requestId",
  auth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Cancel sent connection request
connectionRequestRouter.patch('/user/requests/sent/:connectionId', auth, async (req, res)=>{
    try{
        if(!req.params){
            return res.status(400).send(`requestType input is required`);
        }

        const {user: loggedInUser} = req;
        const {connectionId} = req.params;
        
        if(!connectionId){
            return res.status(400).send('ConnetionId is required')
        }

        const sentConnectionRequest = await ConnectionRequestModel.findOne({
            _id: connectionId,
            fromUserId: loggedInUser._id,
            status: 'interested'
        })

        if(!sentConnectionRequest){
            return res.status(404).send('Connection Request might be invalid or does not exist.');
        }
        sentConnectionRequest.status = 'cancelled';
        await sentConnectionRequest.save();
        res.status(200).json({message: 'Connection request cancelled successfully.', sentConnectionRequest})
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})

module.exports = {connectionRequestRouter}






