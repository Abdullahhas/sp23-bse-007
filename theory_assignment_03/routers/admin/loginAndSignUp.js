const express = require("express")
const User = require("../../models/user");
const router = express.Router()

router.get("/login" , (req , res)=> {
    res.render("admin/login" , { layout: "layouts/panel"  , user : []})
})

router.post ("/login" ,  async (req , res)=> {
    let user = await User.findOne(req.body)

    if (!user) {
       
        return res.render("admin/login", { 
            layout: "layouts/panel", 
            user:
            {
              message: "Invalid username or password"
            }
           
        });
    }

    req.session.user = user
    res.redirect("/admin")
})


router.get("/signup" , (req , res)=>{
    res.render("admin/signup" , {layout : "layouts/panel"})
})

router.post("/signup", async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if user already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.send("User already exists");
      }
  
      
      const user = new User(req.body);
      await user.save();
  
     
      res.redirect("/login");
    } catch (err) {
      console.error("Error during sign-up:", err);
      res.status(500).send("An error occurred during sign-up.");
    }
  });
  

router.get('/logout' , (req , res)=>{
    req.session.user = null
    res.redirect('/login')
})

module.exports = router