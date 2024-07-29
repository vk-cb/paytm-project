const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.PORT
const userRouter = require('./routes/userRoutes')
app.use(express.json())
 
// databse connection
const dbUrl = process.env.MONGO_URL

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to mongoDB")
    const PORT = port;
    app.listen(PORT, ()=>{
        console.log(`Server is running at port ${PORT}`);
    });
})
.catch((error)=>{
    console.log("Error in conection to MongoDB",error)
})

// routes 


app.use('/v1/user', userRouter)



module.exports = app;
