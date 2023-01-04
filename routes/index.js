const express=require('express');
const router=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const Story=require('../models/Story')
const app=express();

//login

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login',
    })
})


//dashboard
router.get('/dashboard',ensureAuth,async(req,res)=>{
    try {
        const stories=await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            disname:req.user.firstName,
            stories
         })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports=router