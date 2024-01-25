const { Router } = require('express');
const router = Router();
const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');
const Comment = require('../models/comment');
const { checkAuth} = require ('../middlewares/authentication');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.get('/add-blog',checkAuth(), (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.file.filename}`,
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        const comments = await Comment.find({blogId : req.params.id}).populate('createdBy');
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        return res.render('blog', {
            blog,
            user: req.user,
            comments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    });
    return res.status(302).redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
