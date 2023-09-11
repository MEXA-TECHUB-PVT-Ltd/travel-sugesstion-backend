import { Router } from 'express';
import { createTip, getTipByPlace } from '../Controller/tipController.js';

const tipRoute = Router();

tipRoute.post('/createTip', createTip);
tipRoute.get('/getTipByPlace/:id', getTipByPlace);
// tipRoute.get('/getAllPlaceType', getAllPlaceTypes);
export default tipRoute;
