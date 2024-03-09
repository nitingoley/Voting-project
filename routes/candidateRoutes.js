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



 router.put('/:candidateID', jwtAuthMiddleware , async (req , res)=>{
     try
    {
        if(!checkAdminRole(req.user))
          return res.status(403).json({error: 'user does not have admin role'})
     const candidateID = req.params.candidateID;
     const updatedCandidateData = req.body;
     const response = await Candidate.findById(candidateID, updatedCandidateData, {
        new : true, 
        runValidators: true
     });

     if(!response)
     {
        return res.status(403).json({error: 'Candidate does not  found'})
     }

       console.log("Candidate data updated");
       res.status(200).json(response)
         
    } 
        catch (error) 
        {
            console.log("oops data not found");
         res.status(403).json({error: "Internal server error"})
        
     }
 })






//   Logic for Delete user entry  


router.delete("/:candidateID" , jwtAuthMiddleware , async(req , res)=>{
    try 
    {
        if(!checkAdminRole(req.user.id))
        return res.status(403).json({message:'User does not have admin role'})
        
        const candidateID = req.params.candidateID;
        const response = await Candidate.findById(candidateID);
      
        if(! response)
        {
            return res.status(404).json({error: "User does not found"})
        }
        console.log("User delete successfully");

        res.status(200).json(response);
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({error : "Internal server error"})
    }
})





// Getting Users data; 

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