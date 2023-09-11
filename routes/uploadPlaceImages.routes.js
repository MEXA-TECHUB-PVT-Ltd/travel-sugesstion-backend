import { Router } from 'express';
import { getAllImagesByPlace, getAllImagesByUser, uploadPlaceImage } from '../Controller/uploadPlaceImagesController.js';
import { upload } from '../utils/ImageHandler.js';

const uploadPlaceImageRoute = Router();

uploadPlaceImageRoute.post('/create',upload("placeImages").array("images"), uploadPlaceImage);
uploadPlaceImageRoute.get('/getAllImagesByPlace/:place_id', getAllImagesByPlace);
uploadPlaceImageRoute.get('/getAllImagesByUser/:user_id', getAllImagesByUser);
export default uploadPlaceImageRoute;
