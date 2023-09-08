// import Amenities from "../model/amenitiesModel.js";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createCuisines = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/cuisinesImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO cuisine (name,description,image) VALUES($1,$2,$3)";
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
export const deleteCuisines = async (req, res) => {
  const { id } = req.params;
  try {
    const condition={
        column:"id",
        value:id
    }
     const oldImage=await getSingleRow("cuisine",condition)
     if(!oldImage){
     return res.status(404).json({statusCode:404,message:"Cuisine not found "})
     }
    const oldImageSplit = oldImage.image.replace(
      "/cuisinesImages/",
      ""
    );
    const delQuery = "DELETE FROM cuisine WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Cuisine not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "cuisinesImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "Cuisine deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllCuisiness = async (req, res) => {
  try {
    const result = await getAllRows("cuisine");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, allCuisines: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No cuisine found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificCuisines = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("cuisine",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, Cuisine: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No cuisine found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCuisines = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const condition={
        column:"id",
        value:id
    }
    const oldImage=await getSingleRow("cuisine",condition)
    if(!oldImage){
        return res.status(404).json({statusCode:404,message:"Cuisine not found "})
    }
    let updateData = {
      name,
      description,
      image: null,
    };
    if (req.file && req.file.filename) {
      updateData.image = `/cuisinesImages/${req.file.filename}`;
      const imageSplit = oldImage.image.replace(
        "/cuisinesImages/",
        ""
      );
      handle_delete_photo_from_folder(imageSplit, "cuisinesImages");
    } else {
      updateData.image = oldImage.image;
    }

    const updateType =
      `UPDATE cuisine SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
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
