var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/alluserposts', async function(req, res, next) {
//   let user = await userModel.findOne({_id: "655c87672d9e0b1af532cb3a"})
//   .populate('posts')
//   res.send(user);
// });



// router.get('/createuser', async function(req, res, next) {
//   let createduser = await userModel.create({
//     username: "siddhant",
//     password: "siddhant",
//     posts: [],
//     email: "siddhant@male.com",
//     fullName: "Siddhant Sharma",
//   });
//   res.send(createduser);
// });

// router.get('/createpost', async function(req, res, next) {
//   let createdpost = await postModel.create({
//     postText: "hii from siddhant doosri baaar",
//     user: "655c87672d9e0b1af532cb3a",
//   });
//   let user = await userModel.findOne({_id: "655c87672d9e0b1af532cb3a"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("done");
// });

router.get('/login',function(req, res, next){
  res.render('login');
});

router.get('/feed',function(req, res, next){
  res.render('feed');
});
 
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render("profile")
});

router.post("/register",function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
   .then(function(){
     passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
     })
   })

})

router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req,res){
});

router.get("/logout", function(req,res){
  req.logOut(function(err){
    if(err) {return next(err); }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}




module.exports = router;
