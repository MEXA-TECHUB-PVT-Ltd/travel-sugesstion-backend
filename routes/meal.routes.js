import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createHotelType, deletehotelType, getAllhotelTypes, getSpecifichotelType, updatehotelType } from '../Controller/hotelTypeController.js';
import { createMeal, deleteMeal, getAllMeals, getSpecificMeal, updateMeal } from '../Controller/mealController.js';

const mealRoute = Router();

mealRoute.post('/create',upload("mealImages").single("image"), createMeal);
mealRoute.delete('/deleteMeal/:id', deleteMeal);
mealRoute.get('/getAllmeals', getAllMeals);
mealRoute.get('/getSpecificMeal/:id', getSpecificMeal);
mealRoute.put('/updateMeal/:id',upload("mealImages").single("image"), updateMeal);
export default mealRoute;
