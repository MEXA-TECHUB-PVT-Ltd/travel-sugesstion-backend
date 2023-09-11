import { Router } from 'express';
import { createLike, getAllLikesOnSpecificReview } from '../Controller/likeController.js';

const likeRoute = Router();

likeRoute.post('/likeReview', createLike);
likeRoute.get('/getAllLikesOnSpecificReview/:review_id', getAllLikesOnSpecificReview);
// likeRoute.get('/getAllRatingsByUser/:user_id', getAllRatingsByUser);
export default likeRoute;
