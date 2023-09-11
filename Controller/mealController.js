
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createMeal = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/mealImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO meal (name,description,image) VALUES($1,$2,$3)";
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
export const deleteMeal = async (req, res) => {
  const { id } = req.params;
  try {
    const condition={
        column:"id",
        value:id
    }
     const oldImage=await getSingleRow("meal",condition)
     if(!oldImage){
     return res.status(404).json({statusCode:404,message:"Meal not found "})
     }
    const oldImageSplit = oldImage.image.replace(
      "/mealImages/",
      ""
    );
    const delQuery = "DELETE FROM meal WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "MealImages not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "mealImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "Meal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllMeals = async (req, res) => {
  try {
    const result = await getAllRows("meal");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, Meals: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No meal found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("meal",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, Meal: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No meal found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateMeal = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const condition={
          column:"id",
          value:id
      }
      const oldImage=await getSingleRow("meal",condition)
      if(!oldImage){
          return res.status(404).json({statusCode:404,message:"Meal not found "})
      }
      let updateData = {
        name,
        description,
        image: null,
      };
      if (req.file && req.file.filename) {
        updateData.image = `/mealImages/${req.file.filename}`;
        const imageSplit = oldImage.image.replace(
          "/mealImages/",
          ""
        );
        handle_delete_photo_from_folder(imageSplit, "mealImages");
      } else {
        updateData.image = oldImage.image;
      }
  
      const updateType =
        `UPDATE meal SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
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
