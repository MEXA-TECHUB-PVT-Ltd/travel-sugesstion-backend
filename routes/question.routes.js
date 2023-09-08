import { Router } from 'express';
import { addQuestion, deleteQuestion, getAllQuestion, specificQuestion, updateQuestion } from '../Controller/questionController.js';
const questionRoute = Router();

questionRoute.post('/addQuestion', addQuestion);
questionRoute.put('/updateQuestion', updateQuestion);
questionRoute.delete('/deleteQuestion', deleteQuestion);
questionRoute.get('/specificQuestion/:id', specificQuestion);
questionRoute.get('/getAllQuestion', getAllQuestion);
export default questionRoute;
