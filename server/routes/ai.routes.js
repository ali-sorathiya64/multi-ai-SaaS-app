import express from 'express';
import { generateArticle, 
    generateBlogTitle, 
    generateImage, 
    removeImageBackground,
    removeImageObject,
    summarizeDocument} 
    from '../controllers/ai.controller.js';
import auth from '../middlewares/auth.js';
import { upload } from '../config/Multer.js';

const airouter = express.Router();


airouter.post('/generate-article',auth,generateArticle);
airouter.post('/generate-blog-title',auth,generateBlogTitle);
airouter.post('/generate-image',auth,generateImage);
airouter.post('/remove-image-background',upload.single('image'),auth,removeImageBackground);
airouter.post('/remove-image-object',upload.single('image'),auth,removeImageObject);
airouter.post('/summary-docs', upload.single('resume'), auth, summarizeDocument);



export default airouter;