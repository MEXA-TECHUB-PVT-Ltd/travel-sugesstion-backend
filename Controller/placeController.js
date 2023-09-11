import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
const updateCommonPlaceFields = async (
  place_id,
  user_id,
  place_type,
  newImage,
  name,
  loc_latitude,
  loc_longitude,
  state,
  country,
  city,
  street,
  postal_code,
  website_link,
  phone_no,
  description,
  amenity_id
) => {
  console.log(loc_latitude);
  const updateQuery = `UPDATE places SET 
name=$1,
image=$2,
location=POINT($3, $4),
state=$5,
country=$6,
city=$7,
street=$8,
postal_code=$9,
website_link=$10,
phone_no=$11,
description=$12,
amenity_id=$13,
place_type_id=$14,
user_id=$15 
WHERE id=$16
RETURNING id`;
  const result = await pool.query(updateQuery, [
    name,
    newImage,
    loc_latitude,
    loc_longitude,
    state,
    country,
    city,
    street,
    postal_code,
    website_link,
    phone_no,
    description,
    amenity_id,
    place_type,
    user_id,
    place_id,
  ]);
  if (result.rowCount === 0) {
    return false;
  }
  return true;
};
const updateHotelFields = async (
  place_id,
  hotel_type,
  num_rooms,
  staff_desk_availability,
  check_in_time,
  check_out_time,
  housekeeping_availability,
  hotel_certifying_representative
) => {
  const hotelQuery = `UPDATE  hotels SET
          hotel_type=$1, 
          num_rooms=$2, 
          staff_desk_availability=$3, 
          check_in_time=$4, 
          check_out_time=$5, 
          housekeeping_availability=$6, 
          certifying_representative=$7
          WHERE place_id=$8
          RETURNING id`;
  const hotelResult = await pool.query(hotelQuery, [
    hotel_type,
    num_rooms,
    staff_desk_availability,
    check_in_time,
    check_out_time,
    housekeeping_availability,
    hotel_certifying_representative,
    place_id,
  ]);

  if (hotelResult.rowCount === 1) {
    return true;
  }
  return false;
};
const updateRestaurantFields = async (
  place_id,
  restaurant_type,
  restaurant_cuisines_id,
  restaurant_meal_id,
  restaurant_open_hours,
  restaurant_housekeeping_availability,
  restaurant_certifying_representative
) => {
  const updateRestaurant = `UPDATE restaurants SET 
        restaurant_category_id=$1, 
        open_hours=$2, 
        housekeeping_availability=$3, 
        certifying_representative=$4 
        WHERE place_id=$5
       RETURNING id`;
  const restaurantResult = await pool.query(updateRestaurant, [
    restaurant_type,
    restaurant_open_hours,
    restaurant_housekeeping_availability,
    restaurant_certifying_representative,
    place_id,
  ]);
  if (restaurantResult.rowCount === 0) {
    return false;
  }

  const deleteQuery = "DELETE FROM restaurant_cuisine WHERE restaurant_id = $1";
  await pool.query(deleteQuery, [restaurantResult.rows[0].id]);

  const insertQuery =
    "INSERT INTO restaurant_cuisine (restaurant_id, cuisine_id) SELECT $1, unnest($2::int[])";
  await pool.query(insertQuery, [
    restaurantResult.rows[0].id,
    restaurant_cuisines_id,
  ]);
  if (insertQuery.rowCount === 0) {
    return false;
  }

  const deleteMealQuery =
    "DELETE FROM restaurant_meal WHERE restaurant_id = $1";
  await pool.query(deleteMealQuery, [restaurantResult.rows[0].id]);

  const insertMealQuery =
    "INSERT INTO restaurant_meal (restaurant_id, meal_id) SELECT $1, unnest($2::int[])";
  await pool.query(insertMealQuery, [
    restaurantResult.rows[0].id,
    restaurant_meal_id,
  ]);
  if (insertMealQuery.rowCount === 0) {
    return false;
  }

  return true;
};
export const createPlaceHotel = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "image not upload" });
    }
    const {
      user_id,
      place_type,
      select_staff_representative,
      select_role,
      currently_open,
      property_description,
      certifying_representative,
      name,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,
      hotel_type,
      num_rooms,
      staff_desk_availability,
      check_in_time,
      check_out_time,
      housekeeping_availability,
      hotel_certifying_representative,
    } = req.body;

    // Check if place_type is valid
    const condition = {
      column: "id",
      value: place_type,
    };
    const checkPlaceType = await getSingleRow("place_type", condition);
    if (!checkPlaceType) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Invalid place_type" });
    }
    // Create a staff representative if needed
    let staffId;
    // Create the place
    const createPlaceQuery = `
     INSERT INTO places (
      
       name,
       image,
       location,
       state,
       country,
       city,
       street,
       postal_code,
       website_link,
       phone_no,
       description,
       amenity_id,
       place_type_id,
       user_id
     )
     VALUES (
       $1, 
       $2, 
       POINT($3, $4), 
       $5, 
       $6, 
       $7, 
       $8, 
       $9, 
       $10,
       $11, 
       $12, 
       $13,
       $14,
       $15
     ) RETURNING id`;
    const image = `/placeImages/${req.file.filename}`;
    const placeResult = await pool.query(createPlaceQuery, [
      name,
      image,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,
      place_type,
      user_id,
      //  staffId || null, // Use staffId if it's available, otherwise use null
    ]);
    if (select_staff_representative === "yes" && placeResult.rowCount === 1) {
      const createStaffQuery =
        "INSERT INTO staff_representative(place_id,role, open, property_description, certifying_representative) VALUES ($1, $2, $3, $4,$5) RETURNING id";
      const staffResult = await pool.query(createStaffQuery, [
        placeResult.rows[0].id,
        select_role,
        currently_open,
        property_description,
        certifying_representative,
      ]);
      if (staffResult.rowCount === 1) {
        staffId = staffResult.rows[0].id;
      } else {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to create staff representative",
        });
      }
    }

    if (placeResult.rowCount === 1) {
      // Create the hotel if it's a hotel
      if (checkPlaceType.name === "hotel") {
        const hotelQuery =
          "INSERT INTO hotels (place_id, hotel_type, num_rooms, staff_desk_availability, check_in_time, check_out_time, housekeeping_availability, certifying_representative) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
        const hotelResult = await pool.query(hotelQuery, [
          placeResult.rows[0].id,
          hotel_type,
          num_rooms,
          staff_desk_availability,
          check_in_time,
          check_out_time,
          housekeeping_availability,
          hotel_certifying_representative,
        ]);

        if (hotelResult.rowCount === 1) {
          return res.status(200).json({
            statusCode: "200",
            message: "Place and hotel created successfully",
          });
        } else {
          return res
            .status(500)
            .json({ statusCode: 500, message: "Failed to create hotel" });
        }
      } else {
        return res
          .status(200)
          .json({ statusCode: "200", message: "Place created successfully" });
      }
    } else {
      return res
        .status(500)
        .json({ statusCode: 500, message: "Failed to create place" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const createPlaceRestaurant = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "image not upload" });
    }
    const {
      user_id,
      place_type,
      select_staff_representative,
      select_role,
      currently_open,
      property_description,
      certifying_representative,
      name,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,

      restaurant_type,
      cuisines_id,
      meal_id,
      open_hours,
      housekeeping_availability,
      restaurant_certifying_representative,
    } = req.body;
    const condition = {
      column: "id",
      value: place_type,
    };
    const checkPlaceType = await getSingleRow("place_type", condition);
    console.log(checkPlaceType);
    if (!checkPlaceType || checkPlaceType.name.trim() !== "restaurant") {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Invalid place_type" });
    }
    // Create the place
    const image = `/placeImages/${req.file.filename}`;
    const createPlaceQuery = `
     INSERT INTO places (
    
       name,
       image,
       location,
       state,
       country,
       city,
       street,
       postal_code,
       website_link,
       phone_no,
       description,
       amenity_id,
       place_type_id,
       user_id
     )
     VALUES (
       $1, 
       $2, 
       POINT($3, $4), 
       $5, 
       $6, 
       $7, 
       $8, 
       $9, 
       $10,
       $11, 
       $12, 
       $13,
       $14,
       $15
     ) RETURNING id`;
    const placeResult = await pool.query(createPlaceQuery, [
      name,
      image,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,
      place_type,
      user_id,
      // staffId || null,
    ]);
    let staffId;
    if (select_staff_representative === "yes") {
      const createStaffQuery =
        "INSERT INTO staff_representative(place_id,role, open, property_description, certifying_representative) VALUES ($1, $2, $3, $4,$5) RETURNING id";
      const staffResult = await pool.query(createStaffQuery, [
        placeResult.rows[0].id,
        select_role,
        currently_open,
        property_description,
        certifying_representative,
      ]);
      if (staffResult.rowCount === 1) {
        staffId = staffResult.rows[0].id;
      } else {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to create staff representative",
        });
      }
    }
    if (placeResult.rowCount === 1) {
      const hotelQuery =
        "INSERT INTO restaurants (place_id, restaurant_category_id, open_hours, housekeeping_availability, certifying_representative) VALUES ($1, $2, $3, $4, $5) RETURNING id";
      const restaurantResult = await pool.query(hotelQuery, [
        placeResult.rows[0].id,
        restaurant_type,
        // meal_id,
        open_hours,
        housekeeping_availability,
        restaurant_certifying_representative,
      ]);

      if (restaurantResult.rowCount === 1) {
        for (const cuisineId of cuisines_id) {
          const insertQuery =
            "INSERT INTO restaurant_cuisine (restaurant_id, cuisine_id) VALUES ($1, $2)";
          await pool.query(insertQuery, [
            restaurantResult.rows[0].id,
            cuisineId,
          ]);
        }
        for (const mealId of meal_id) {
          const insertQuery =
            "INSERT INTO restaurant_meal (restaurant_id, meal_id) VALUES ($1, $2)";
          await pool.query(insertQuery, [restaurantResult.rows[0].id, mealId]);
        }
        return res.status(200).json({
          statusCode: "200",
          message: "Place and restaurant created successfully",
        });
      } else {
        return res
          .status(500)
          .json({ statusCode: 500, message: "Failed to create restaurant" });
      }
    } else {
      return res
        .status(500)
        .json({ statusCode: 500, message: "Failed to create place" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const createOtherPlace = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "image not upload" });
    }
    const {
      user_id,
      place_type,
      select_staff_representative,
      select_role,
      currently_open,
      property_description,
      certifying_representative,
      name,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,
    } = req.body;
    const condition = {
      column: "id",
      value: place_type,
    };
    const checkPlaceType = await getSingleRow("place_type", condition);
    console.log(checkPlaceType);
    if (!checkPlaceType || checkPlaceType.name.trim() !== "visiting") {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Invalid place_type" });
    }
    // Create the place
    const image = `/placeImages/${req.file.filename}`;

    const createPlaceQuery = `
     INSERT INTO places (
     
       name,
       image,
       location,
       state,
       country,
       city,
       street,
       postal_code,
       website_link,
       phone_no,
       description,
       amenity_id,
       place_type_id,
       user_id
     )
     VALUES (
       $1, 
       $2, 
       POINT($3, $4), 
       $5, 
       $6, 
       $7, 
       $8, 
       $9, 
       $10,
       $11, 
       $12, 
       $13,
       $14,
       $15
     ) RETURNING id`;
    const placeResult = await pool.query(createPlaceQuery, [
      name,
      image,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,
      place_type,
      user_id,
      // staffId || null,
    ]);
    let staffId;
    if (select_staff_representative === "yes") {
      const createStaffQuery =
        "INSERT INTO staff_representative(place_id,role, open, property_description, certifying_representative) VALUES ($1, $2, $3, $4,$5) RETURNING id";
      const staffResult = await pool.query(createStaffQuery, [
        placeResult.rows[0].id,
        select_role,
        currently_open,
        property_description,
        certifying_representative,
      ]);
      if (staffResult.rowCount === 0) {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to create staff representative",
        });
      }
    }
    res.status(200).json({
      statusCode: 200,
      message: "Visiting place created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const updatePlace = async (req, res) => {
  try {
    const {
      place_id,
      user_id,
      place_type,
      name,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id,

      hotel_type,
      num_rooms,
      staff_desk_availability,
      check_in_time,
      check_out_time,
      housekeeping_availability,
      hotel_certifying_representative,

      restaurant_cuisines_id,
      restaurant_type,
      restaurant_meal_id,
      restaurant_open_hours,
      restaurant_housekeeping_availability,
      restaurant_certifying_representative,
    } = req.body;
    const alreadyExistQuery = `SELECT * FROM places WHERE id=$1 AND user_id=$2`;
    const alreadyExistResult = await pool.query(alreadyExistQuery, [
      place_id,
      user_id,
    ]);
    if (alreadyExistResult.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "You are not owner of this post " });
    }
    let newImage = alreadyExistResult.rows[0].image;
    if (req.file && req.file.filename) {
      const imageSplit = newImage.replace(
        "/placeImages/",
        ""
      );
      handle_delete_photo_from_folder(imageSplit,'placeImages')
      newImage = `/placeImages/${req.file.filename}`;

    }

    // Check if place_type is valid
    const condition = {
      column: "id",
      value: place_type,
    };
    const checkPlaceType = await getSingleRow("place_type", condition);
    if (!checkPlaceType) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Invalid place_type" });
    }
    const result = await updateCommonPlaceFields(
      place_id,
      user_id,
      place_type,
      newImage,
      name,
      loc_latitude,
      loc_longitude,
      state,
      country,
      city,
      street,
      postal_code,
      website_link,
      phone_no,
      description,
      amenity_id
    );
    if (!result) {
      return res.state(400).json({
        statusCode: 400,
        message: "Operation not fulfilled (Place not updated)",
      });
    }
    if (checkPlaceType.name === "hotel" && result) {
      const result1 = await updateHotelFields(
        place_id,
        hotel_type,
        num_rooms,
        staff_desk_availability,
        check_in_time,
        check_out_time,
        housekeeping_availability,
        hotel_certifying_representative
      );
      if (result1) {
        return res.status(200).json({
          statusCode: 200,
          message: "Place hotel updated successfully",
        });
      }
      return res.status(500).json({
        statusCode: 500,
        message: "Operation not fulfiled (hotel not updated)",
      });
    } else if (checkPlaceType.name.trim() === "restaurant") {
      console.log("--------------------");
      const result2 = await updateRestaurantFields(
        place_id,
        restaurant_type,
        restaurant_cuisines_id,
        restaurant_meal_id,
        restaurant_open_hours,
        restaurant_housekeeping_availability,
        restaurant_certifying_representative
      );
      if (!result2) {
        return res
          .status(400)
          .json({ statusCode: 400, message: "Place Restaurant not updated" });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "Place restaurant updated successfully",
      });
    } else if (checkPlaceType.name === "visiting") {
      const result3 = await updateCommonPlaceFields(
        place_id,
        user_id,
        place_type,
        newImage,
        name,
        loc_latitude,
        loc_longitude,
        state,
        country,
        city,
        street,
        postal_code,
        website_link,
        phone_no,
        description,
        amenity_id
      );
      if (result3) {
        const imageSplit = newImage.replace("/plcaeImages/", "");
        handle_delete_photo_from_folder(imageSplit, "placeImages");
        return res.status(200).json({
          statusCode: 200,
          message: "Visisig Place  updated successfully",
        });
      }
      return res.status(500).json({
        statusCode: 500,
        message: "Operation not fulfiled (Visisig Place not updated)",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getSpecificPlace = async (req, res) => {
  try {
    const { place_id } = req.params;
    const id = place_id;
    const getQuery = `SELECT 
p.id AS place_id,
p.image AS place_image,
p.name AS place_name,
p.location AS place_location,
p.state AS place_state,
p.country AS place_country,
p.city AS place_city,
p.street AS place_street,
p.postal_code AS place_postal_code,
p.website_link AS place_website_link,
p.phone_no AS place_phone_no,
p.description AS place_description,
p.state,
am.id AS amenities_id,
am.name AS amenities_name,
sr.role AS staff_representative_role,
sr.open, 
h.id AS hotel_id,
h.num_rooms AS hotel_num_rooms,
h.staff_desk_availability AS hotel_staff_desk_availability,
h.check_in_time AS hotel_check_in_time,
h.check_out_time AS hotel_check_out_time,
h.housekeeping_availability AS hotel_housekeeping_availability,
h.certifying_representative AS hotel_certifying_representative,
ht.id AS hotel_type_id,
ht.name AS hotel_type_name,

r.open_hours AS restaurant_open_hours, 
r.housekeeping_availability AS restaurant_housekeeping_availability,
rc.cuisine_id
FROM places p
LEFT JOIN amenities am ON p.amenity_id=am.id
LEFT JOIN staff_representative sr ON p.id = sr.place_id

LEFT JOIN hotels h ON p.id = h.place_id
LEFT JOIN hotel_type ht ON h.hotel_type=ht.id
LEFT JOIN restaurants r ON p.id = r.place_id
LEFT JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id

WHERE p.id = $1;
`;
    // m.id AS meal_id,
    // m.name AS meal_name,
    // LEFT JOIN meal m ON r.meal_id = m.id
    const result = await pool.query(getQuery, [place_id]);
    // const getQuery="SELECT * FROM places WHERE id=$1"
    // const result = await pool.query(getQuery, [id]);
    // const getAmenityQuery="SELECT * FROM amenities WHERE id=$1"
    // const resultAmenity = await pool.query(getAmenityQuery, [result.rows[0].amenity_id]);
    // const getStaffQuery="SELECT * FROM staff_representative WHERE id=$1"
    // const resultStaff = await pool.query(getStaffQuery, [result.rows[0].select_staff_representative]);
    if (result.rows.length) {
      return res.status(200).json({ statusCode: 200, place: result.rows[0] });
      // return res.status(200).json({ statusCode: 200, place: result.rows[0],Amenity:resultAmenity.rows[0],Staff:resultStaff.rows[0] });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPlaces = async (req, res) => {
  try {
    const getQuery = `SELECT 
p.id AS place_id,
p.image AS place_image,
p.name AS place_name,
p.location AS place_location,
p.state AS place_state,
p.country AS place_country,
p.city AS place_city,
p.street AS place_street,
p.postal_code AS place_postal_code,
p.website_link AS place_website_link,
p.phone_no AS place_phone_no,
p.description AS place_description,
p.state,
am.id AS amenities_id,
am.name AS amenities_name,
sr.role AS staff_representative_role,
sr.open, 
h.id AS hotel_id,
h.num_rooms AS hotel_num_rooms,
h.staff_desk_availability AS hotel_staff_desk_availability,
h.check_in_time AS hotel_check_in_time,
h.check_out_time AS hotel_check_out_time,
h.housekeeping_availability AS hotel_housekeeping_availability,
h.certifying_representative AS hotel_certifying_representative,
ht.id AS hotel_type_id,
ht.name AS hotel_type_name,

r.open_hours AS restaurant_open_hours, 
r.housekeeping_availability AS restaurant_housekeeping_availability,
rc.cuisine_id AS restaurant_cuisine_id,
c.name AS restaurant_cuisine_name
FROM places p
LEFT JOIN amenities am ON p.amenity_id=am.id
LEFT JOIN staff_representative sr ON p.id = sr.place_id
LEFT JOIN hotels h ON p.id = h.place_id
LEFT JOIN hotel_type ht ON h.hotel_type=ht.id
LEFT JOIN restaurants r ON p.id = r.place_id
LEFT JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id
LEFT JOIN cuisine c ON rc.cuisine_id = c.id

`;
    // m.id AS meal_id,
    // m.name AS meal_name,
    // LEFT JOIN meal m ON r.meal_id = m.id;
    const result = await pool.query(getQuery);
    if (result.rows.length > 0) {
      return res.status(200).json({ statusCode: 200, place: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("places", condition);
    if (!oldImage) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Place not found " });
    }
    const oldImageSplit = oldImage.image.replace("/placeImages/", "");
    const deleteQuery = `DELETE FROM places WHERE id=$1
`;
    const result = await pool.query(deleteQuery, [id]);
    if (result.rowCount === 1) {
      handle_delete_photo_from_folder(oldImageSplit, "placeImages");
      return res
        .status(200)
        .json({ statusCode: 200, message: "Place deleted successfully" });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const SearchPlaceByName = async (req, res) => {
  try {
    const { name } = req.query;
    const getQuery = `SELECT 
    p.id AS place_id,
    p.image AS place_image,
    p.name AS place_name,
    p.location AS place_location,
    p.state AS place_state,
    p.country AS place_country,
    p.city AS place_city,
    p.street AS place_street,
    p.postal_code AS place_postal_code,
    p.website_link AS place_website_link,
    p.phone_no AS place_phone_no,
    p.description AS place_description,
    p.state,
    am.id AS amenities_id,
    am.name AS amenities_name,
    sr.role AS staff_representative_role,
    sr.open, 
    h.id AS hotel_id,
    h.num_rooms AS hotel_num_rooms,
    h.staff_desk_availability AS hotel_staff_desk_availability,
    h.check_in_time AS hotel_check_in_time,
    h.check_out_time AS hotel_check_out_time,
    h.housekeeping_availability AS hotel_housekeeping_availability,
    h.certifying_representative AS hotel_certifying_representative,
    ht.id AS hotel_type_id,
    ht.name AS hotel_type_name,
    m.id AS meal_id,
    m.name AS meal_name,
    r.open_hours AS restaurant_open_hours, 
    r.housekeeping_availability AS restaurant_housekeeping_availability,
    rc.cuisine_id
    FROM places p
    LEFT JOIN amenities am ON p.amenity_id=am.id
    LEFT JOIN staff_representative sr ON p.id = sr.place_id
    
    LEFT JOIN hotels h ON p.id = h.place_id
    LEFT JOIN hotel_type ht ON h.hotel_type=ht.id
    LEFT JOIN restaurants r ON p.id = r.place_id
    LEFT JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id
    LEFT JOIN meal m ON r.meal_id = m.id
    WHERE LOWER(p.name) LIKE LOWER('%' || $1 || '%');
    `;
    const result = await pool.query(getQuery, [name]);
    if (result.rows.length > 0) {
      return res.status(200).json({ statusCode: 200, place: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getPlaceByPlaceType = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `SELECT 
    p.id AS place_id,
    p.image AS place_image,
    p.name AS place_name,
    p.location AS place_location,
    p.state AS place_state,
    p.country AS place_country,
    p.city AS place_city,
    p.street AS place_street,
    p.postal_code AS place_postal_code,
    p.website_link AS place_website_link,
    p.phone_no AS place_phone_no,
    p.description AS place_description,
    p.state,
    am.id AS amenities_id,
    am.name AS amenities_name,
    sr.role AS staff_representative_role,
    sr.open, 
    h.id AS hotel_id,
    h.num_rooms AS hotel_num_rooms,
    h.staff_desk_availability AS hotel_staff_desk_availability,
    h.check_in_time AS hotel_check_in_time,
    h.check_out_time AS hotel_check_out_time,
    h.housekeeping_availability AS hotel_housekeeping_availability,
    h.certifying_representative AS hotel_certifying_representative,
    ht.id AS hotel_type_id,
    ht.name AS hotel_type_name,
    m.id AS meal_id,
    m.name AS meal_name,
    r.open_hours AS restaurant_open_hours, 
    r.housekeeping_availability AS restaurant_housekeeping_availability,
    rc.cuisine_id
    FROM places p
    LEFT JOIN amenities am ON p.amenity_id=am.id
    LEFT JOIN staff_representative sr ON p.id = sr.place_id
    
    LEFT JOIN hotels h ON p.id = h.place_id
    LEFT JOIN hotel_type ht ON h.hotel_type=ht.id
    LEFT JOIN restaurants r ON p.id = r.place_id
    LEFT JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id
    LEFT JOIN meal m ON r.meal_id = m.id
    WHERE p.place_type_id=$1;
    `;
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length > 0) {
      return res.status(200).json({ statusCode: 200, place: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllCuisineByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `WITH restaurant_cuisine_info AS (
  SELECT rc.restaurant_id AS restaurant_id,
         cuisine.id AS cuisine_id,
         cuisine.name AS cuisine_name,
         cuisine.description AS cuisine_description,
         cuisine.image AS cuisine_image
  FROM restaurant_cuisine rc
  LEFT JOIN cuisine ON rc.cuisine_id = cuisine.id
)
SELECT *
FROM restaurant_cuisine_info
WHERE restaurant_id = $1;`;
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllCuisineByRestaurant: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No cuisine found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllMealByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `WITH restaurant_meal_info AS (
  SELECT rm.restaurant_id AS restaurant_id,
         meal.id AS meal_id,
         meal.name AS meal_name,
         meal.description AS meal_description,
         meal.image AS meal_image
  FROM restaurant_meal rm
  LEFT JOIN meal ON rm.meal_id = meal.id
)
SELECT *
FROM restaurant_meal_info
WHERE restaurant_id = $1;`;
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllMealByRestaurant: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No meal found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPlacesByCuisineId = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `SELECT
p.id AS place_id,
p.name AS place_name,
p.location AS place_location,
p.state AS place_state,
p.country AS place_country,
p.city AS place_city,
p.street AS place_street,
p.postal_code AS place_postal_code,
p.website_link AS place_website_link,
p.phone_no AS place_phone_no,
p.description AS place_description,
r.id AS restaurant_id,
r.open_hours AS restaurant_open_hours,
r.housekeeping_availability AS restaurant_housekeeping_availability,
r.certifying_representative AS restaurant_certifying_representative,
restC.id AS restaurant_category_id,
restC.name AS restaurant_category_name,
c.id AS cuisine_id,
c.name AS cuisine_name,
c.description AS cuisine_description,
c.image AS cuisine_image
FROM places p
INNER JOIN restaurants r ON p.id = r.place_id
INNER JOIN restaurant_categories restC ON r.restaurant_category_id = restC.id
INNER JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id
INNER JOIN cuisine c ON rc.cuisine_id = c.id
WHERE c.id = $1;
`;
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllMealByRestaurant: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPlacesByMealId = async (req, res) => {
  try {
    const { id } = req.params;
    const getQuery = `SELECT
p.id AS place_id,
p.name AS place_name,
p.location AS place_location,
p.state AS place_state,
p.country AS place_country,
p.city AS place_city,
p.street AS place_street,
p.postal_code AS place_postal_code,
p.website_link AS place_website_link,
p.phone_no AS place_phone_no,
p.description AS place_description,
r.id AS restaurant_id,
r.open_hours AS restaurant_open_hours,
r.housekeeping_availability AS restaurant_housekeeping_availability,
r.certifying_representative AS restaurant_certifying_representative,
restC.id AS restaurant_category_id,
restC.name AS restaurant_category_name,
m.id AS meal_id,
m.name AS meal_name,
m.description AS meal_description,
m.image AS meal_image
FROM places p
INNER JOIN restaurants r ON p.id = r.place_id
INNER JOIN restaurant_categories restC ON r.restaurant_category_id = restC.id
INNER JOIN restaurant_meal rc ON r.id = rc.restaurant_id
INNER JOIN meal m ON rc.meal_id = m.id
WHERE m.id = $1;
`;
    const result = await pool.query(getQuery, [id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllMealByRestaurant: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
