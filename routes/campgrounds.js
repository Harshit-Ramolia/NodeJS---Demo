var express = require("express")
var router = express.Router()
var camp = require("../modules/campgrounds")

// Show all campgrounds
router.get("/",function(req,res){
    camp.find({},function(err,camps){
        if (err){
            console.log("err")
        } else{
            res.render("campground/index",{camps:camps})
        }
    })    
})

// Add new campground
router.get("/new",isLogedIn,function(req,res){
    res.render("campground/new")
})

router.post("/",isLogedIn,function(req,res){
    camp.create(req.body.newCamp,function(err,Camp){
        Camp.author.id = req.user._id
        Camp.author.username = req.user.username
        Camp.save()
        res.redirect("/campgrounds")
    })
})

// Show particular campground
router.get("/:id",function(req,res){
    camp.findById(req.params.id).populate("comments").exec(function(err,newCamp){
        if (!newCamp){
            res.redirect("/campgrounds")
        }else{
        res.render("campground/show",{newCamp:newCamp})
        }
    })
})

//Edit Campground
router.get("/:id/edit",checkCampAuthor,function(req,res){
    camp.findById(req.params.id,function(err,newCamp){
        if(err){
            res.redirect("/campgrounds")
        } else{
            res.render("campground/edit",{newCamp:newCamp})
        }
    })
})

router.put("/:id/",checkCampAuthor,function(req,res){
    camp.findByIdAndUpdate(req.params.id,req.body.newCamp,function(err,newCamp){
        if(!newCamp){
            res.redirect("/campgrounds")
        } else{
            
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//Delete a Campground
router.delete("/:id",checkCampAuthor,function(req,res){
    camp.findByIdAndDelete(req.params.id,function(err,Camp){
        res.redirect("/campgrounds")
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


function checkCampAuthor(req,res,next){
    if(req.isAuthenticated()){
        camp.findById(req.params.id,function(err,Campground){
            if (!Campground){
                res.redirect("back")
            }else{
                if(Campground.author.id.equals(req.user.id)){
                    next()
                }
                else{
                    res.redirect("back")
                }
            }
        })
    }else{
        res.redirect("back")
    }

}
module.exports = router