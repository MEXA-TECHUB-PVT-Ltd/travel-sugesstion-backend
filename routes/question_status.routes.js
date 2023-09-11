import { Router } from 'express';
import { addQuestionStatus, deleteQuestionStatus, updateQuestionStatus, viewQuestionStatus } from '../Controller/question_statusController.js';
const questionStatusRoute = Router();

questionStatusRoute.post('/addQuestionStatus', addQuestionStatus);
questionStatusRoute.put('/updateQuestionStatus', updateQuestionStatus);
questionStatusRoute.delete('/deleteQuestionStatus', deleteQuestionStatus);
questionStatusRoute.post('/ViewQuestionStatus', viewQuestionStatus);
export default questionStatusRoute;
