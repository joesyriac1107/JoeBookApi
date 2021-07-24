const User = require("../modals/user")
const router = require("express").Router()
const bcrypt = require("bcrypt")

router.get("/", (req,res)=>{
    res.send("hey its user route")
})

//update user
router.put("/:id", async (req,res) => {
    const modifiedUserDetails = req.body
    if(req.body.userId == req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
                return res.status(500).json(err)
            }
        }
        modifiedUserDetails = {...modifiedUserDetails,password}
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set: modifiedUserDetails})
            res.status(200).json("Account has been successfully updated")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("You can modift only your account")
    }
} )
//delete user

router.delete("/:id", async (req,res) => {
    const modifiedUserDetails = req.body
    if(req.body.userId == req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been successfully deleted ")
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("You can delete only your account")
    }
} )
//get a user
//follow user
//unfollow a user
module.exports = router