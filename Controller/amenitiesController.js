// import Amenities from "../model/amenitiesModel.js";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/amenitiesImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO amenities (name,description,image) VALUES($1,$2,$3)";
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
export const deleteAmenities = async (req, res) => {
  const { id } = req.params;
  try {
    // const query = "SELECT * FROM amenities WHERE id=$1";
    // const oldImage = await pool.query(query, [id]);
    const condition={
      column:"id",
      value:id
  }
    const oldImage=await getSingleRow("amenities",condition)
    if(!oldImage){
    return res.status(404).json({statusCode:404,message:"amenities not found "})
    }
    const oldImageSplit = oldImage.image.replace(
      "/amenitiesImages/",
      ""
    );
    const delQuery = "DELETE FROM amenities WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Amenitie not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "amenitiesImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "Amenity deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllAmenities = async (req, res) => {
  try {
    const result = await getAllRows("amenities");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllAmenities: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No amenties found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificAmenities = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
      column:"id",
      value:id
  }
  const result=await getSingleRow("amenities",condition)

    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, Amenitie: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No amenties found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateAmenities = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = "SELECT * FROM amenities WHERE id=$1";
    const oldImage = await pool.query(query, [id]);
    let updateData = {
      name,
      description,
      image: null,
    };
    if (req.file && req.file.filename) {
      updateData.image = `/amenitiesImages/${req.file.filename}`;
      const imageSplit = oldImage.rows[0].image.replace(
        "/amenitiesImages/",
        ""
      );
      handle_delete_photo_from_folder(imageSplit, "amenitiesImages");
    } else {
      updateData.image = oldImage.rows[0].image;
    }

    const updateAmenity =
      `UPDATE amenities SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
    const result = await pool.query(updateAmenity, [
      updateData.name,
      updateData.description,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      return res
        .status(200)
        .json({ statusCode: 200, Amenitie: result.rows[0] });
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
