// import Amenities from "../model/amenitiesModel.js";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createRestaurant = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/restaurantImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO restaurant_categories (name,description,image) VALUES($1,$2,$3)";
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
export const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const condition={
      column:"id",
      value:id
  }
   const oldImage=await getSingleRow("hotel_type",condition)
   if(!oldImage){
   return res.status(404).json({statusCode:404,message:"restaurant not found "})
   }
    const oldImageSplit = oldImage.image.replace(
      "/restaurantImages/",
      ""
    );
    const delQuery = "DELETE FROM restaurant_categories WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Restaurant Category not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "restaurantImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "restaurant_categories deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllRestaurants = async (req, res) => {
  try {
    const result = await getAllRows("restaurant_categories");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, AllAmenities: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No Restaurant Category found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
      column:"id",
      value:id
  }
  const result=await getSingleRow("restaurant_categories",condition)

    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, restaurant_categorie: result});
    } else {
      res.status(404).json({ statusCode: 404, message: "No Restaurant Category found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = "SELECT * FROM restaurant_categories WHERE id=$1";
    const oldImage = await pool.query(query, [id]);
    let updateData = {
      name,
      description,
      image: null,
    };
    if (req.file && req.file.filename) {
      updateData.image = `/restaurantImages/${req.file.filename}`;
      const imageSplit = oldImage.rows[0].image.replace(
        "/restaurantImages/",
        ""
      );
      handle_delete_photo_from_folder(imageSplit, "restaurantImages");
    } else {
      updateData.image = oldImage.rows[0].image;
    }

    const updateAmenity =
      `UPDATE restaurant_categories SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
    const result = await pool.query(updateAmenity, [
      updateData.name,
      updateData.description,
      updateData.image,
      id,
    ]);
    if (result.rowCount === 1) {
      return res
        .status(200)
        .json({ statusCode: 200, restaurantCategory: result.rows[0] });
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
