import { Router } from 'express';

import { UnSavePlace, createSavedPlaces, getAllSavedPlacesByUser } from '../Controller/SavedPlacesController.js';

const savedPlacesRoute = Router();

savedPlacesRoute.post('/create', createSavedPlaces);
savedPlacesRoute.get('/getAllSavedPlacesByUser/:user_id', getAllSavedPlacesByUser);
savedPlacesRoute.post('/unSavePlace', UnSavePlace);
export default savedPlacesRoute;
