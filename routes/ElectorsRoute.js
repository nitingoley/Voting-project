const express = require('express');
const router = express.Router();
const User = require("../models/user.js")
// const 
const Electors = require("../models/electors.js");
const Candidate = require("../models/candidate.js")
const {jwtAuthMiddleware, generateToken} = require('../jwt');




const checkAdminRole = async(userID)=>{
  
     try
    { 
     const user =  await User.findById(userID);         

      if(user.userID == 'admin')
      {
        return true;
      }
      else
      {
       return false
      }

     } catch (error) {
        console.log(error);
     }
}



  router.post("/" , jwtAuthMiddleware , async (req ,res)=>{
     
    try 
    {
        if(!(await checkAdminRole(req.user.id)))
        return res.status(403).json({message: 'You does not have admin authority'})
    
         const data = req.body;
        const newCandidate = new Candidate(data);
     
        const dataResponse = await newCandidate.save();
         
        res.status(200).json({response: dataResponse});
        console.log(dataResponse);


    } catch (error) {
        console.log(error);
    }

  })


  module.exports = router;