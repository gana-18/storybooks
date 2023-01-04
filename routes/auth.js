const express=require('express');
const router=express.Router();
const passport=require('passport')

const app=express();
//google

router.get('/google',passport.authenticate('google',{scope:['profile']}))


//callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    res.redirect('/dashboard')
})


//logout
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports=router