const jwt = requre('jsonwebtoken')
const users = require('../model/user')
const secret = process.env.JWT_SECRET
exports.userAuthMiddleware = async(req, resp, next)=>{
    const token = req.header('token')
    if(!token){
      return resp.status(401).json({msg : "please provide token"})
    }
    
    try {
        const decoded = jwt.verify(token,secret)
        const userDetail = await findOne(decoded.id)
        if(!userDetail){
            resp.status(401).json({msg: "Please provide valid token"})
        }

        
    } catch (error) {
        
    }
}