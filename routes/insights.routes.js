import { Router } from 'express';
import {  getAllInsight } from '../Controller/insightController.js';

const insightRoute = Router();

insightRoute.get('/getAllInsight/:id', getAllInsight);
export default insightRoute;
