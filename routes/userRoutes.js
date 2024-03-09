const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
// const { replace } = requ`1ire('lodash');




router.post("/signup", async (req, res) => {
    try {
        const data = req.body;

        const adminUser = await User.findOne({ role: 'admin' });

        if (data.role == 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exist' })
        }


        // Adding constraint for Adhar card number   must contain 12 digits  

        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        
        const existingUser = await User.findOne({ adharCardNumber: data.adharCardNumber })
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same adhar card number' })
        }

        const newUser = new User(data);

        const response = await newUser.save();
        console.log('Data saved');

        const payload = {
            id: response.id,
         }
         console.log(JSON.stringify(payload));
         let token = generateToken(payload);
         res.json({token});
          console.log(token);
        console.log(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server error' })

    }
})



// Create Login Route 

router.post("/login" , async (req , res)=>{
    try 
    {
        const{adharCardNumber  , password} = req.body;

        if(!adharCardNumber || !password)
        {
            return res.status(400).json({error: 'Adhar card and password required'})
        }

        const user = await User.findOne({adharCardNumber: adharCardNumber});
 
         if(!user || !(await user.findOne({adharCardNumber:adharCardNumber})))
         {
            return res.status(401).json({error: "Invalid Adhar card Number or password"})
         }

         const payload = {
            id: user.id,
         }
         let token = generateToken(payload);
         res.json({token});
    } catch (error) {
        console.log(error);
      res.status(500).json({error: 'Internal server error'  })
    }

})

 
//   this is the profile route 

 router.get("/profile" , jwtAuthMiddleware , async(req , res)=>{
      try {
         const userData = req.user;
         const userId = userData.id;

         const user = await User.findById(userId)
       res.status(200).json({user});
      } 
      catch (err) 
      {
        console.log(err);
        res.status(500).json({err: 'Internal server error'})        
      }
 })


//  This is the Logic for profile password upadate & change 

 router.put("/profile/password" , jwtAuthMiddleware , async (req , res)=>{
    try 
    {
        
    const userId = req.user.id;
    const {currentpassword , newpassword} = req.body;
    if(!currentpassword || !newpassword)
    {
        return res.status(400).json({error: "new password and old password are same"})
    }     

    const user = await User.findById({userId});

    if(!user || ! (await user.comparePassword(currentpassword)))
     {
        return res.status(401).json({error: 'Invalid currentpassword'}) 
    }


    //  Logic for Upadate new password and we can say replace  old password  with new password 
   
     user.password = newpassword;

      await user.save();
     
      console.log("Password Update Successfully");
  res.status(200).json({message: "Password has been Changed Successfully"})

    }
     catch (err) 
    {
      console.log(err);
      res.status(500).json({err: 'Internal server error'});   
    }
 })


//   change old password to new password  

router.put("/profile/password", jwtAuthMiddleware , async(req , res)=>{
    try {
        const userID = req.user.id;
        let{currentpassword , newpassword} = req.body;

        if(!currentpassword || !newpassword)
        {
            return res.status(400).json({error:"Current password or old password are same"});
        }
 
        const user = await User.findById(userID);

        if(!user || !(await user.comparePassword(currentpassword)))
        {
            return res.status(401).json({error:"Error password Invalid"})
        }
   
         user.password = newpassword;
         await user.save();
         
         console.log("Password update");

         res.status(200).json({message:"Password has been updated"})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server issue'})
    }
} )

module.exports = router;