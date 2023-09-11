import { Router } from 'express';
import { createAccessType, deleteAccessType, getAllAccessType, getSpecificAccessType, updateAccessType } from '../Controller/accessTypeController.js';

const accessTypeRoute = Router();

accessTypeRoute.post('/create', createAccessType);
accessTypeRoute.delete('/deleteAccessType/:id', deleteAccessType);
accessTypeRoute.get('/getAllAccessType', getAllAccessType);
accessTypeRoute.get('/getSpecificAccessType/:id', getSpecificAccessType);
accessTypeRoute.put('/updateAccessType/:id', updateAccessType);
export default accessTypeRoute;
