require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database.js");
const {profileRouter} = require("./routers/profileRouter.js")
const {authRouter} = require("./routers/authRouter.js")
const {connectionRequestRouter} = require('./routers/connectionRequestRouter');
const {userRouter} = require('./routers/userRouter');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT;

const app = express();


connectDB() 
.then(()=> {
    console.log("Successfully connected to the DB cluster!!");
    app.listen(port, ()=> console.log(`Server is running... on PORT ${port}`))
})
.catch(err=> console.log(`DataBase Connection Error: ${err}`));

app.use(cors(
    {
    origin: process.env.CLIENT_URL,
    credentials: true
    }
))
app.use(express.json());
app.use(cookieParser());
app.use(profileRouter);
app.use(authRouter);
app.use(connectionRequestRouter);
app.use(userRouter);
