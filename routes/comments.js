var express = require("express")
var router = express.Router({mergeParams:true})
var camp = require("../modules/campgrounds")
var comment = require("../modules/comments")

// Add new comment
router.get("/new",isLogedIn,function(req,res){
    camp.findById(req.params.id,function(err,newCamp){
        if (!newCamp){
            res.redirect("/campgrounds")
        }else{
            res.render("comment/new",{newCamp:newCamp})
        }
    })
})

router.post("/",isLogedIn,function(req,res){
   
    camp.findById(req.params.id,function(err,Camp){
        if (!Camp){
            res.redirect("/campgrounds")
        }else{
            comment.create(req.body.newComment,function(err,newCom){
                newCom.author.id = req.user._id
                newCom.author.username = req.user.username
                newCom.save()
                console.log(newCom)
                Camp.comments.push(newCom)
                Camp.save()
                res.redirect("/campgrounds/"+req.params.id)
            })
        }
    })
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