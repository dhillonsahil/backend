const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body , validationResult } =require('express-validator') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

// jwt secret usually kept in config file etc
const jwt_secret = "IcanSeeYou$"
// create a user using POST "/api/auth" . Does not required auth
router.post('/createuser', [
    // validating correct details entered or not
    body('name',"Name should be atleast 3 digits").isLength({min:3}),
    body('email','Please enter a valid email').isEmail(),
    body('password','Password length must be atleast 5').isLength({min : 5}),
], async (req, res) => {// if not added correctly errors

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

   try {
    // if user already exists then show user already exists
       let user = await User.findOne({email : req.body.email})
       if(user){
           return res.status(400).json({error : "Email already exists"})
        }

        // creating hashpassword to add security in database we will store hashpassword
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password , salt);
        // save into database
     user = await User.create({
         name : req.body.name,
         email : req.body.email,
         password : secpass
     })
     

     // sending auth token to user authToken:- user can access the site and we can verify it the user and not anyone else
     const data = {
        user:{
            id : user.id
        }
     }
     const authToken = jwt.sign(data,jwt_secret)
     return res.json({authToken})
   } catch (error) {
    console.error("internal server error");
    return res.status(500).json({error : "Internal Server error"})
   }
})

// User login using POST : "api/auth/login" No authenticatiomn(auth token) required
router.post('/login', [
    // validating correct details entered or not
    body('email','Please enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
], async (req, res) => {// if not added correctly errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {email, password} = req.body;
    try {
        // let user =await User.findOne({email})
        let user = await User.findOne({email: { $regex: new RegExp('^' + email + '$', 'i') }}); // Use $regex with 'i' option for case-insensitive search
        if(!user){
            return res.status(400).json({error : "Please check Your Login Credentials"})
        }

        const passwordCompare =await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({error : "Please check Your Login Credentials"})
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,jwt_secret)
        res.json(authToken)
    } catch (error) {
        console.error("internal server error");
        return res.status(500).json({error : "Internal Server error"})
    }
})

// Route 3 : Get logged in User details using Post "api/auth/getuser" . Login required(need to send authtoken)

router.post('/getuser',fetchuser ,async (req, res)=>{
    // middle ware :- is basically a function which will be called when login required routes gets any request
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
    
    }


})
module.exports = router;