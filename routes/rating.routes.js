import { Router } from 'express';
import { createRating, getAllRatingsByUser, getRatingByPlace } from '../Controller/ratingController.js';

const ratingRoute = Router();

ratingRoute.post('/create', createRating);
ratingRoute.get('/getRatingsByPlace/:place_id', getRatingByPlace);
ratingRoute.get('/getAllRatingsByUser/:user_id', getAllRatingsByUser);
export default ratingRoute;
