import { Router } from 'express';
import { createReview, deleteReview, getAllReviewByPlace, getReviewByUserId, getSpecificReview, getTotalReviewByPlace, updateReview } from '../Controller/reviewController.js';

const reviewRoute = Router();

reviewRoute.post('/create', createReview);
reviewRoute.delete('/deleteReview/:id', deleteReview);
// reviewRoute.get('/getAllPlaceType', getAllPlaceTypes);
reviewRoute.get('/getSpecificReview/:id', getSpecificReview);
reviewRoute.get('/getReviewByuser/:user_id', getReviewByUserId);
reviewRoute.get('/getAllReviewByPlace/:place_id', getAllReviewByPlace);
reviewRoute.get('/getTotalReviewByPlace/:place_id', getTotalReviewByPlace);
reviewRoute.put('/updateReview/:id', updateReview);
export default reviewRoute;
