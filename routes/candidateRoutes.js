const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const Candidate = require('../models/candidate');




// for checking the admin is valid or not 


const checkAdminRole = async (userID) => {
   try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
   }catch(err){
        return false;
   }
}

// POST route to add a candidate
// router.post('/',  async (req, res) =>{
//     try{
//         if(!(await checkAdminRole(req.user.id)))
//             return res.status(403).json({message: 'user does not have admin role'});

//         const data = req.body // Assuming the request body contains the candidate data

//         // Create a new User document using the Mongoose model
//         const newCandidate = new Candidate(data);

//         // Save the new user to the database
//         const response = await newCandidate.save();
//         console.log('data saved'+response);
//         res.status(200).json({response: response});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

router.post('/', jwtAuthMiddleware, async (req, res) =>{
    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body // Assuming the request body contains the candidate data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})



router.get("/profile" , jwtAuthMiddleware, async(req , res)=>{
   
    try 
    {
        const dataU = req.user;
        let userId = dataU.id;
        let user = await User.findById({userId});
      
        res.status(200).json({user})
         console.log(user);
    } catch (err) 
    {
        res.status(403).json({err:'Internal Server error'})
        console.log(err);
        
    }

})






module.exports = router;