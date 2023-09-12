import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createBlog, deleteBlog, getAllBlog, getSpecificBlog, updateBlog } from '../Controller/blogController.js';

const blogRoute = Router();

blogRoute.post('/create',upload("blogImages").single("image"), createBlog);
blogRoute.delete('/deleteBlog/:id', deleteBlog);
blogRoute.get('/getAllBlogs', getAllBlog);
blogRoute.get('/getSpecificBlog/:id', getSpecificBlog);
blogRoute.put('/updateBlog/:id',upload("blogImages").single("image"), updateBlog);
export default blogRoute;
