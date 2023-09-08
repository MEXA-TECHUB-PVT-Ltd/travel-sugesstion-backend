import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createPlaceType, deletePlaceType, getAllPlaceTypes, getSpecificPlaceType, updatePlaceType } from '../Controller/placeTypeController.js';

const placeTypeRoute = Router();

placeTypeRoute.post('/create', createPlaceType);
placeTypeRoute.delete('/deletePlaceType/:id', deletePlaceType);
placeTypeRoute.get('/getAllPlaceType', getAllPlaceTypes);
placeTypeRoute.get('/getSpecificPlaceType/:id', getSpecificPlaceType);
placeTypeRoute.put('/updatePlaceType/:id', updatePlaceType);
export default placeTypeRoute;
