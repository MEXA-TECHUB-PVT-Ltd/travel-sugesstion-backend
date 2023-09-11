import pool from "../db.config/index.js";
export const createSavedPlaces = async (req, res) => {
  try {
    const { user_id,place_id } = req.body;
    const alreadyQuery="SELECT * FROM saved_places WHERE user_id=$1 AND place_id=$2"
    const alreadyResult=await pool.query(alreadyQuery,[user_id,place_id])
    if(alreadyResult.rows.length>0){
        return res.status(401).json({ statusCode: 401, message: "User already saved this place" });
    }
    const createQuery = "INSERT INTO saved_places (user_id,place_id) VALUES($1,$2)";
    const result = await pool.query(createQuery, [user_id,place_id]);
    if (result.rowCount === 1) {
      return res
        .status(201)
        .json({ statusCode: 201, message: "placed saved successfully" });
    }
    res.status(400).json({ statusCode: 400, message: "Not saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const getAllSavedPlacesByUser = async (req, res) => {
  try {
    const {user_id} =req.params
    const getPlaces=`SELECT 
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
    r.id AS restaurant_id,
    r.open_hours AS restaurant_open_hours, 
    r.housekeeping_availability AS restaurant_housekeeping_availability

    FROM saved_places sp
    LEFT JOIN places p ON sp.place_id=p.id
    LEFT JOIN staff_representative sr ON p.id = sr.place_id
    LEFT JOIN amenities am ON p.amenity_id = am.id
    LEFT JOIN hotels h ON p.id = h.place_id
    LEFT JOIN hotel_type ht ON h.hotel_type=ht.id
    LEFT JOIN restaurants r ON p.id = r.place_id
   
    WHERE sp.user_id = $1;`
    // rc.cuisine_id
    // LEFT JOIN restaurant_cuisine rc ON r.id = rc.restaurant_id
    // LEFT JOIN restaurant_meal rm ON r.id = rm.restaurant_id
  //  const getPlaces=`
  // SELECT * FROM saved_places WHERE user_id=$1;
  //  `
   const result=await pool.query(getPlaces,[user_id])
    if (result.rows.length> 0) {
      return res.status(200).json({ statusCode: 200, AllPlaces: result.rows });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};
export const UnSavePlace = async (req, res) => {
    try {
      const {user_id,place_id} =req.body
     const unsaveQuery=`
   DELETE FROM saved_places WHERE user_id=$1 AND place_id=$2
     `
     const result=await pool.query(unsaveQuery,[user_id,place_id])
      if (result.rowCount > 0) {
        return res.status(200).json({ statusCode: 200, message:"Place unsave successfull" });
      } else {
        res.status(404).json({ statusCode: 404, message: "Operation not successfull" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };