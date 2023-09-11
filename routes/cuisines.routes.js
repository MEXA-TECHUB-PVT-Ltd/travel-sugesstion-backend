import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createCuisines, deleteCuisines, getAllCuisiness, getSpecificCuisines, updateCuisines } from '../Controller/CuisinesControler.js';

const cuisinesRoute = Router();

cuisinesRoute.post('/create',upload("cuisinesImages").single("image"), createCuisines);
cuisinesRoute.delete('/deleteCuisines/:id', deleteCuisines);
cuisinesRoute.get('/getAllCuisines', getAllCuisiness);
cuisinesRoute.get('/getSpecificCuisine/:id', getSpecificCuisines);
cuisinesRoute.put('/updateCuisine/:id',upload("cuisinesImages").single("image"), updateCuisines);
export default cuisinesRoute;
