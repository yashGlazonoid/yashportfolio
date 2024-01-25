require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8000;
const connectToMongoDB = require('./mongodbConnection');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require ('./middlewares/authentication');

const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
connectToMongoDB(process.env.MONGO_URL);

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));


app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
//to get imnages
app.use(express.static(path.resolve('./public')));

app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
        res.render('home',{
            user: req.user,
            blogs : allBlogs,
        });
});


app.listen(PORT , ()=>console.log(`Server started at port ${PORT}`));