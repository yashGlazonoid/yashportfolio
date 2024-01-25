const { validateToken } = require('../services/authentication')

function checkForAuthenticationCookie(cookieName){
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }

        try{
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        }catch(error){}
        return next();
    }
}

function checkAuth(){
    return (req,res,next) =>{
        const tokenCookieValue = req.cookies['token'];
        if(!tokenCookieValue){
            return res.redirect('/user/signin');
        }
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
    checkAuth
}