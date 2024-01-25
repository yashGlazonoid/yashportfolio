const { Router } = require('express');
const router = Router();
const User = require('../models/user');


router.get('/signin',(req,res)=>{
    res.render('signin');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.post('/signin',async (req,res)=>{
    const { email , password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password)
        return res.cookie('token',token).status(302).redirect('/');
    }catch(error ){
        return res.render('signin',{
            error : "Incorrect Email or password"
        });
    }
    
});

router.post('/signup',async (req,res)=>{
    const { fullName , email , password } = req.body;
    const user = await User.create({
        fullName,
        email,
        password
    });
    return res.status(300).redirect('/');
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').status(302).redirect('/');
})



module.exports = router;