const jwt = require('jsonwebtoken')
const jwt_secret = "IcanSeeYou$"

const fetchuser = (req,res,next) =>{
    // get user from jwt token and add id to request token
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error :"Please authenticate yourself using valid token"})
    }
    try {
        const data = jwt.verify(token,jwt_secret)
        req.user= data.user;
        next()
        
    } catch (error) {
        res.status(401).send({error :"Please authenticate yourself using valid token"})
    }
}


module.exports= fetchuser;