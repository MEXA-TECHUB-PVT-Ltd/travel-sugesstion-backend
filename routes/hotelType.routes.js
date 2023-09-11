import { Router } from 'express';
import { upload } from '../utils/ImageHandler.js';
import { createHotelType, deletehotelType, getAllhotelTypes, getSpecifichotelType, updatehotelType } from '../Controller/hotelTypeController.js';

const hotelType = Router();

hotelType.post('/create',upload("hotelTypeImages").single("image"), createHotelType);
hotelType.delete('/deletehotelType/:id', deletehotelType);
hotelType.get('/getAllhotelTypes', getAllhotelTypes);
hotelType.get('/getSpecifichotelType/:id', getSpecifichotelType);
// hotelType.get('/searchByHotelType', searchByHotelType);
hotelType.put('/updatehotelType/:id',upload("hotelTypeImages").single("image"), updatehotelType);
export default hotelType;
