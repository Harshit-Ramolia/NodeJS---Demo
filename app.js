var bodyParser = require("body-parser"),
mongoose = require("mongoose"),
express = require("express")
app = express(),
methodOverride = require("method-override"),
passport = require("passport"),
localStrategy = require("passport-local")

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

var camp = require("./modules/campgrounds"),
    comment = require("./modules/comments"),
    user = require("./modules/user")

var campRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

//PASSPORT Config.
app.use(require("express-session")({
    secret: "Harshit",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

// Adding user variable to every routes
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next()
})

// Using routes
app.use("/campgrounds",campRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/",indexRoutes)

// Server http://localhost:3000/
app.listen(3000,function(){
    console.log("app is running...")
})