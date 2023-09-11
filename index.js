import express from 'express';
import pkg from 'body-parser';
import userRoute from './routes/user.routes.js';
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import setCorsHeaders from './midllewares/corsMiddleware.js';
import questionRoute from './routes/question.routes.js';
import questionStatusRoute from './routes/question_status.routes.js';
import pool from './db.config/index.js'
import amenitiesRoute from './routes/amenities.routes.js';
import restaurantCategoryRoute from './routes/restCategory.routes.js';
import hotelType from './routes/hotelType.routes.js';
import cuisinesRoute from './routes/cuisines.routes.js';
import mealRoute from './routes/meal.routes.js';
import placeTypeRoute from './routes/place_type.routes.js';
import placeRoute from './routes/place.routes.js';
import tipRoute from './routes/tip.routes.js';
import ratingRoute from './routes/rating.routes.js';
import reviewRoute from './routes/review.routes.js';
import likeRoute from './routes/likes.routes.js';
import savedPlacesRoute from './routes/savedPlaces.routes.js';
import uploadPlaceImageRoute from './routes/uploadPlaceImages.routes.js';
import blogRoute from './routes/blog.routes.js';
import accessTypeRoute from './routes/accessType.routes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;
const { json } = pkg;
dotenv.config();
app.use(express.json());
app.use(setCorsHeaders);
app.use(bodyParser.urlencoded({ extended: true, limit: 0 }));
app.use(bodyParser.json({ limit: 0 }));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(json());
app.use('/users', userRoute);
app.use('/questions', questionRoute);
app.use('/question_status', questionStatusRoute);
app.use('/amenities', amenitiesRoute);
app.use('/hotelType', hotelType);
app.use('/cuisine', cuisinesRoute);
app.use('/meal', mealRoute);
app.use('/placeType', placeTypeRoute);
app.use('/place', placeRoute);
app.use('/tip', tipRoute);
app.use('/rating', ratingRoute);
app.use('/like', likeRoute);
app.use('/review', reviewRoute);
app.use('/savedPlaces', savedPlacesRoute);

app.use('/restaurantCategory', restaurantCategoryRoute);
app.use('/uploadPlaceImages', uploadPlaceImageRoute);
app.use('/blog', blogRoute);
app.use('/accessType', accessTypeRoute);
const corsOptions = {
  origin: 'http://127.0.0.1:5173'
};
app.use(cors());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
