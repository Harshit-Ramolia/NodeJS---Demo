var express = require("express")
var router = express.Router()
var passport = require("passport")
var user = require("../modules/user")

router.get("/",function(req,res){
    res.render("landing")
})

//Register
router.get("/register",function(req,res){
    res.render("register")
})

router.post("/register",function(req,res){
    var newUser = new user({username : req.body.username})
    user.register(newUser,req.body.password,function(err,User){
        if(err){
            console.log(err)
            res.redirect("/register")
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds")
            })
        }
    })
})

//LogIn
router.get("/login",function(req,res){
    res.render("login")
})

router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),function(req,res){
})

//Logout
router.get("/logout",function(req,res){
    req.logout()
    res.redirect("/campgrounds")
})

//Middleware isLogedIn
function isLogedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login")
    }
}

module.exports = router