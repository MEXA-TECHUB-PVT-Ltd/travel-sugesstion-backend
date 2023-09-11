import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { create, deleteAmenities, getAllAmenities, getSpecificAmenities, updateAmenities } from '../Controller/amenitiesController.js';

const amenitiesRoute = Router();

amenitiesRoute.post('/createAmenitie',upload("amenitiesImages").single("image"), create);
amenitiesRoute.delete('/deleteAmenities/:id', deleteAmenities);
amenitiesRoute.get('/getAllAmenities', getAllAmenities);
amenitiesRoute.get('/getSpecificAmenitie/:id', getSpecificAmenities);
amenitiesRoute.put('/updateAmenities/:id',upload("amenitiesImages").single("image"), updateAmenities);
export default amenitiesRoute;
