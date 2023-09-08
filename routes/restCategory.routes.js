import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createRestaurant, deleteRestaurant, getAllRestaurants, getSpecificRestaurant, updateRestaurant } from '../Controller/restaurantCategory.js';

const restaurantCategoryRoute = Router();

restaurantCategoryRoute.post('/create',upload("restaurantImages").single("image"), createRestaurant);
restaurantCategoryRoute.delete('/deleteRestaurant/:id', deleteRestaurant);
restaurantCategoryRoute.get('/getAllRestaurants', getAllRestaurants);
restaurantCategoryRoute.get('/getSpecificRestaurant/:id', getSpecificRestaurant);
restaurantCategoryRoute.put('/updateRestaurant/:id',upload("restaurantImages").single("image"), updateRestaurant);
export default restaurantCategoryRoute;
