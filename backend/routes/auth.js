const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const fetchuser=require('./../middleware/fetchuser');
const { body, validationResult } = require("express-validator");
const User = require("./../models/User");
const JWT_SECRET= "rohit you are at a good pace";
const jwt=require('jsonwebtoken');
//create a user using: POST "/api/auth"
router.post(
  "/create-user",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      var user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ error: "email already exists" });
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data={
        user:{
            id:user.id
        }
      };
      const authToken=jwt.sign(data,JWT_SECRET);
      console.log(authToken);
      if (user)
        res.status(200).json({
          user,
        });
    } catch (err) {
      res.status(400).send("some error occured");
    }
  }
);
//login user
router.post('/login',[
    body("email", "Enter a valid email").isEmail(),
    body("password", "enter a valid password").isLength({ min: 5 }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {email,password}=req.body;
    try{
     let user=await User.findOne({email:email});
     if(!user) return res.status(400).json({error:"please enter correct credentials"});
     const passwordcomp=await bcrypt.compare(password,user.password);
     if(!passwordcomp) return res.status(400).json({error:"please enter correct credentials"});
     const data={
        user:{
            id:user.id
        }
      };
      const authToken=jwt.sign(data,JWT_SECRET);
      console.log(authToken);
      res.status(200).json({token:authToken});
    }catch(err){
        console.log(err.message);
        res.status(400).send("some error occured");
    }
});
//get logged in user details
router.get('/getuser',fetchuser,async(req,res)=>{
    try{
      const user_id=req.user.id;
      const user=await User.findById(user_id).select("-password");
      return res.status(200).json(user);
    }catch(err){
        console.log(err.message);
        return res.status(400).send("log in please");
    }
  

});
module.exports = router;
