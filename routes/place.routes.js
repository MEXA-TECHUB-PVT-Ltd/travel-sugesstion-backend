import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import {  SearchPlaceByName, createOtherPlace, createPlaceHotel, createPlaceRestaurant, deletePlace, getAllCuisineByRestaurant, getAllMealByRestaurant, getAllPlaces, getAllPlacesByCuisineId, getAllPlacesByMealId, getPlaceByPlaceType, getSpecificPlace, updatePlace } from '../Controller/placeController.js';

const placeRoute = Router();
placeRoute.post('/createPlaceHotel', upload("placeImages").single("image"),createPlaceHotel);
placeRoute.post('/createPlaceRestaurant', upload("placeImages").single("image"),createPlaceRestaurant);
placeRoute.post('/createVisitingPlace', upload("placeImages").single("image"),createOtherPlace);
placeRoute.post('/updatePlace', upload("placeImages").single("image"),updatePlace);
placeRoute.delete('/deletePlace/:id', deletePlace);
placeRoute.get('/getAllPlace', getAllPlaces);
placeRoute.get('/searchPlaceByName', SearchPlaceByName);
placeRoute.get('/getSpecificPlace/:place_id', getSpecificPlace);
placeRoute.get('/getPlaceByPlaceType/:id', getPlaceByPlaceType);
placeRoute.get('/getAllCuisineByRestaurant/:id', getAllCuisineByRestaurant);
placeRoute.get('/getAllMealByRestaurant/:id', getAllMealByRestaurant);
placeRoute.get('/getAllPlacesByCuisineId/:id', getAllPlacesByCuisineId);
placeRoute.get('/getAllPlacesByMealId/:id', getAllPlacesByMealId);
export default placeRoute;
