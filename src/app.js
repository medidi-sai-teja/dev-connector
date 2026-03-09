require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database");
const port = process.env.PORT;

const app = express();


connectDB() 
.then(()=> {
    console.log("Successfully connected to the DB cluster!!");
    app.listen(port, ()=> console.log(`Server is running... on PORT ${port}`))
})
.catch(err=> console.log(`DataBase Connection Error: ${err}`));


