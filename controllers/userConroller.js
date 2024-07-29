const jwt = require('jsonwebtoken')
const users = require("../model/user");
const bcrypt = require('bcrypt')
const secret = process.env.JWT_SECRET
exports.userSignup = async(req, res)=>{

    try {
        const {email, password, name} = req.body;
        // console.log(email, password, name)
        const findUser = await users.findOne({email})
        if(findUser){
          return  res.send({msg : "User is already exist for this email adderss use another email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser =new users({email, password : hashedPassword, name, wallet : 100}) 
        // console.log(newUser)
       await newUser.save()
       
        const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email, wallet: newUser.wallet }, secret, { expiresIn: '1h' });

        
        const payload = { id: newUser._id, name: newUser.name, email: newUser.email, wallet: newUser.wallet };

        
        console.log('Payload:', payload);
        console.log('Token:', token);

        
        res.status(200).json({ msg: "User created successfully", data: payload, token });
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.userSignin = async(req, res)=>{
    try {
        const {email, password} = req.body;
       
        const findUser = await users.findOne({email})
        if(!findUser){
            res.status(400).json({msg : "please use valid email"})
        }
       
        const matchPassword = await bcrypt.compare(password,findUser.password)

        if(!matchPassword){
            res.status(400).json({msg : "please enter correct password"})
        }

        const payload = {
            id : findUser._id,
            email : findUser.email,
            name : findUser.name,
            wallet : findUser.wallet
        }
        

        const token = jwt.sign(payload, secret, {expiresIn: '1h'})
        // console.log("token", token)
        res.status(200).json({msg : "user logedin successfully",data : payload, token})
    } catch (error) {
        res.status(500).json({msg : "Server error"})
    }
}

exports.transferMoney = async (req, resp)=>{
    try {
        
        
    } catch (error) {
        
    }
}

exports.addInWallet = async (req, resp)=>{
    try {
        
    } catch (error) {
        
    }
}

