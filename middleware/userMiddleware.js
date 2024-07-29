const jwt = require('jsonwebtoken')
const users = require('../model/user')
const secret = process.env.JWT_SECRET

exports.userAuthMiddleware = async(req, resp, next)=>{
    const token = req.header('token')
    if(!token){
      return resp.status(401).json({msg : "please provide token"})
    }
    
    try {
        const decoded = jwt.verify(token,secret)
        req.user = await users.findById(decoded.id)
        if(!req.user){
            resp.status(401).json({msg: "Unauthorized entry"})
        }
        next()
        
    } catch (error) {
        console.error("Token verification error:", error);
        resp.status(401).json({ msg: "Token is not valid" });
    }
}