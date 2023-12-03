var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const upload = require("./multer");


const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));



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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req, res, next){
  res.render('login',{error: req.flash('error')});
});

router.get('/feed',function(req, res, next){
  res.render('feed');
});

// router.post('/upload',isLoggedIn ,upload.single("file"),async function(req, res, next){
//   if(!req.file){
//     return res.status(404).send("no files were given");
//   }
//   const user = await userModel.findOne({username: req.session.passport.user});
//   const post = await postModel.create({
//     image: req.file.filename,
//     imageText: req.body.filecaption,
//     user: user._id
//   });

//   user.posts.push(post._id);
//   await user.save();
//   res.send("done"); 
//   // res.send("file uploaded successfully");
// });

//chatgpt
router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send("No files were given");
  }

  const user = await userModel.findOne({ username: req.session.passport.user });

  try {
    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption, // Make sure this field is present in the form
      user: user._id
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Send a more detailed response to help identify the issue
    res.status(500).json({ error: error.message });
  }
});




 
router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  console.log(user);
  res.render("profile",{user});
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
  failureRedirect: "/login",
  failureFlash: true
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
