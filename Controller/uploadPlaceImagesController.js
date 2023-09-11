import pool from "../db.config/index.js";
import { getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const uploadPlaceImage = async (req, res) => {
  try {
    const {place_id,user_id}=req.body
    if (req.files) {
        if(req.files.length>2){
            for (let index = 0; index < req.files.length; index++) {
                handle_delete_photo_from_folder(req.files[index].filename,"placeImages")
                
            }
        
            return res.status(400).json({statusCode:400,message:"Maximum 2 images are allowed"})
        }
      let files = [];
      for (let index = 0; index < req.files.length; index++) {
        files.push(req.files[index].filename);
      }
      const insertQuery =
        "INSERT INTO upload_place_images (place_id, user_id, image_url) VALUES ($1, $2, unnest($3::text[]))";
      const result=await pool.query(insertQuery, [place_id, user_id, files]);
      if (result.rowCount >0) {
        return res
          .status(201)
          .json({ statusCode: 201, message: "Place Image created successfully" });
      }
      res.status(400).json({ statusCode: 400, message: "Not created" });
    }else{
        res.status(400).json({ statusCode: 400, message: "Image Error" });
    }
   
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const getAllImagesByPlace = async (req, res) => {
  try {
    const { place_id } = req.params;
    const getImages = `
  SELECT * FROM upload_place_images WHERE place_id=$1
   `;
    const result = await pool.query(getImages, [place_id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllUploadImages: result.rows });

    } else {
      res.status(404).json({ statusCode: 404, message: "No image found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getAllImagesByUser = async (req, res) => {
    try {
      const { user_id } = req.params;
      const getImages = `
    SELECT * FROM upload_place_images WHERE user_id=$1
     `;
      const result = await pool.query(getImages, [user_id]);
      if (result.rows.length > 0) {
        return res
          .status(200)
          .json({ statusCode: 200, AllUploadImages: result.rows });
  
      } else {
        res.status(404).json({ statusCode: 404, message: "No image found" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };