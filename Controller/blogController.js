
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createBlog = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (req.file) {
      let imagePath = `/blogImages/${req.file.filename}`;
      const createQuery =
        "INSERT INTO blog (name,description,image_url) VALUES($1,$2,$3)";
      const result = await pool.query(createQuery, [
        name,
        description,
        imagePath,
      ]);
      if (result.rowCount === 1) {
        return res
          .status(201)
          .json({ statusCode: 201, message: "Blog created successfully" });
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
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const condition={
        column:"id",
        value:id
    }
     const oldImage=await getSingleRow("blog",condition)
     if(!oldImage){
     return res.status(404).json({statusCode:404,message:"Blog not found "})
     }
    const oldImageSplit = oldImage.image_url.replace(
      "/blogImages/",
      ""
    );
    const delQuery = "DELETE FROM blog WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "BlogImages not deleted" });
    }
    handle_delete_photo_from_folder(oldImageSplit, "blogImages");
    res
      .status(200)
      .json({ statusCode: 200, message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllBlog = async (req, res) => {
  try {
    const result = await getAllRows("blog");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, Blogs: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No blog found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("blog",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, Blog: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No blog found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateBlog = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const condition={
          column:"id",
          value:id
      }
      const oldImage=await getSingleRow("blog",condition)
      if(!oldImage){
          return res.status(404).json({statusCode:404,message:"Blog not found "})
      }
      let updateData = {
        name,
        description,
        image: oldImage,
      };
      if (req.file && req.file.filename) {
        updateData.image = `/blogImages/${req.file.filename}`;
        const imageSplit = oldImage.image_url.replace(
          "/blogImages/",
          ""
        );
        handle_delete_photo_from_folder(imageSplit, "blogImages");
      } else {
        updateData.image = oldImage.image_url;
      }
  
      const updateType =
        `UPDATE blog SET name=$1,description=$2,image_url=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
      const result = await pool.query(updateType, [
        updateData.name,
        updateData.description,
        updateData.image,
        id,
      ]);
      if (result.rowCount === 1) {
        return res
          .status(200)
          .json({ statusCode: 200, updateBlog: result.rows[0] });
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
