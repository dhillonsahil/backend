const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body , validationResult } =require('express-validator') 

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
        // save into database
     user = await User.create({
         name : req.body.name,
         email : req.body.email,
         password : req.body.password,
     })
     
     return res.json(user)
   } catch (error) {
    console.error("internal server error");
    return res.status(500).json({error : "Internal Server error"})
   }
})

module.exports = router;