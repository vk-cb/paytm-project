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

// exports.userSignin = async(req, res)=>{
//     try {
//         const {email, password} = req.body;
       
//         const findUser = await users.findOne({email})
//         if(!findUser){
//             res.status(400).json({msg : "please use valid email"})
//         }
       
//         const matchPassword = await bcrypt.compare(password,findUser.password)

//         if(!matchPassword){
//             res.status(400).json({msg : "please enter correct password"})
//         }

//         const payload = {
//             id : findUser._id,
//             email : findUser.email,
//             name : findUser.name,
//             wallet : findUser.wallet
//         }
        

//         const token =  jwt.sign(payload, secret, {expiresIn: '1h'})
//         // console.log("token", token)
//         res.status(200).json({msg : "user logedin successfully",data : payload, token})
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({msg : "Server error"})
//     }
// }
exports.userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const findUser = await users.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ msg: "Please use a valid email" }); // Use return to prevent further execution
        }

        // Compare passwords
        const matchPassword = await bcrypt.compare(password, findUser.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: "Please enter the correct password" }); // Use return to prevent further execution
        }

        // Create JWT payload and token
        const payload = {
            id: findUser._id,
            email: findUser.email,
            name: findUser.name,
            wallet: findUser.wallet
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        // Send success response
        return res.status(200).json({ msg: "User logged in successfully", data: payload, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" }); // Use return to prevent further execution
    }
};

exports.getProfile = async (req, resp)=>{

    console.log(req.user, "sdfsdfsdf    ")
    try {
        const user = await users.findById({_id:req.user.id});
        if(!user){
            return resp.status(404).json({msg : "User not found"})
        }
        resp.status(200).json({ msg: "User data", data: {
            id: user._id,
            name: user.name,
            email: user.email,
            wallet: user.wallet
        } });
    } catch (error) {
        console.log(error)
        resp.status(500).json({msg : "Server error"})
    }
}


exports.getUserById = async (req, resp)=>{
    console.log(req.params.id)
    try {
        const user = await users.findById(req.params.id);
        if(!user){
            return resp.status(404).json({msg : "User not found"})
        }
        resp.status(200).json({ msg: "User data", data: {
            id: user._id,
            name: user.name,
            email: user.email,
            wallet: user.wallet
        } });
    } catch (error) {
        console.log(error)
        resp.status(500).json({msg : "Server error"})
    }
}


exports.addInWallet = async (req, resp)=>{
    try {
        const {amount} = req.body;
        if(amount<=0){
            resp.status(401).json({msg : "Please enter valid amount"})
        }
        const user = req.user;
        user.wallet +=amount;
        await user.save()
        resp.status(200).json({ msg: "Amount added successfully", wallet: user.wallet });
    } catch (error) {
        resp.status(500).json({msg : "Server error"})    
    }
}

exports.transferMoney = async (req, resp)=>{
    try {
        const {recipientId, amount} = req.body;
        console.log(recipientId, req.user._id.toString())
        if(recipientId === req.user._id.toString()){
            return resp.status(400).json({msg : "You can't transfer money in own account"})
        }
        if(amount<=0){
            return resp.status(400).json({ msg: "Please enter a valid amount" });
        }
        const sender = req.user;
        if(sender.wallet <amount){
            return resp.status(400).json({ msg: "Insufficient balance" });
        }

        const recipient = await users.findById(recipientId)
        
        if(!recipient){
            return resp.status(404).json({ msg: "Recipient not found" });
        }

        sender.wallet -=amount;
        recipient.wallet +=amount;
        await sender.save();
        await recipient.save();

        resp.status(200).json({ msg: "Transfer successful", senderWallet: sender.wallet, recipientWallet: recipient.wallet });
    } catch (error) {
        console.error(error);
        resp.status(500).json({ msg: "Server error" });
    }
}