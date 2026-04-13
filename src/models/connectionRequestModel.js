const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({   
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
   
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },

    status:{
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected', 'canceled'],
            message: `{VALUE} is not a valid connection status!`
        },
        required: true,
    
    },

    

}, {timestamps: true})



// compound Index 
connectionRequestSchema.index({fromUserId:1, toUserId:1, status:1},{ unique: true });

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);


module.exports = {ConnectionRequestModel};

