// import Amenities from "../model/amenitiesModel.js";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createHotelType = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/hotelTypeImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO hotel_type (name,description,image) VALUES($1,$2,$3)";
      const result = await pool.query(createQuery, [
        name,
        description,
        imagePath,
      ]);
      if (result.rowCount === 1) {
        return res
          .status(201)
          .json({ statusCode: 201, message: "created successfully" });
      }
      res.status(400).json({ statusCode: 400, message: "Not created" });
    } else {
      res.status(400).json({ statusCode: 400, message: "image not uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const deletehotelType = async (req, res) => {
  const { id } = req.params;
  try {
    const condition={
        column:"id",
        value:id
    }
     const oldImage=await getSingleRow("hotel_type",condition)
     if(!oldImage){
     return res.status(404).json({statusCode:404,message:"Hotel Type not found "})
     }
    const oldImageSplit = oldImage.image.replace(
      "/hotelTypeImages/",
      ""
    );
    const delQuery = "DELETE FROM hotel_type WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Hotel Type not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "hotelTypeImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "Hotel Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllhotelTypes = async (req, res) => {
  try {
    const result = await getAllRows("hotel_type");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllHotelType: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No Hotel Type found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecifichotelType = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("hotel_type",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, hotelType: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No hotel_type found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updatehotelType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = "SELECT * FROM hotel_type WHERE id=$1";
    const oldImage = await pool.query(query, [id]);
    let updateData = {
      name,
      description,
      image: null,
    };
    if (req.file && req.file.filename) {
      updateData.image = `/hotelTypeImages/${req.file.filename}`;
      const imageSplit = oldImage.rows[0].image.replace(
        "/hotelTypeImages/",
        ""
      );
      handle_delete_photo_from_folder(imageSplit, "hotelTypeImages");
    } else {
      updateData.image = oldImage.rows[0].image;
    }

    const updateType =
      `UPDATE hotel_type SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
    const result = await pool.query(updateType, [
      updateData.name,
      updateData.description,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      return res
        .status(200)
        .json({ statusCode: 200, updateType: result.rows[0] });
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
