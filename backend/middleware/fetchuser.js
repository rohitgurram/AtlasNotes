var jwt= require('jsonwebtoken');
const JWT_SECRET= "rohit you are at a good pace";
const fetchuser=(req,res,next)=>{
  //get the user id from jwt token 
  const token= req.header('auth-token');
  if(!token) res.status(401).json({error:"please log in first"});
  try{
    const data=jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    console.log(req.user);
    next();
  }catch(err){
    res.status(401).json({error:"please log in first"});
  }
};
module.exports=fetchuser;