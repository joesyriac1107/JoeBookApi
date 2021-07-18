const router = require("express").Router()
const User = require("../modals/user")
const  bcrypt = require("bcrypt")

//Register
router.post("/register", async (req,res)=>{
    console.log("body: "+req.body)

   try {

    //hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    //create new user
    const newUser = new User({
        userName: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    //save user to DB
    const user = await newUser.save()
    res.status(200).json(user)
   }catch(err){
    res.status(500).json(err)
   }

})

//LOGIN
router.post("/login", async (req,res) => {

    try{
    const user = await User.findOne({email: req.body.email})
    !user && res.status(404).send("User not found")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.send(400).send("Invalid Credentials")

    res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router