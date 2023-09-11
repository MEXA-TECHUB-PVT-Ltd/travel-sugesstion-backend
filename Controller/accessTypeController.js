
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createAccessType = async (req, res) => {
  try {
    const { name } = req.body;
      const createQuery =
        "INSERT INTO access_type (name) VALUES($1)";
      const result = await pool.query(createQuery, [
        name,
      ]);
      if (result.rowCount === 1) {
        return res
          .status(201)
          .json({ statusCode: 201, message: "Access Type created successfully" });
      }
      res.status(400).json({ statusCode: 400, message: "Not created" });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const deleteAccessType = async (req, res) => {
  const { id } = req.params;
  try {
    const delQuery = "DELETE FROM access_type WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "access_type not deleted" });
    }
    res
      .status(200)
      .json({ statusCode: 200, message: "access_type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllAccessType = async (req, res) => {
  try {
    const result = await getAllRows("access_type");
    if (result.length > 0) {
      return res
        .status(200)
        .json({ statusCode: 200, Blogs: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No access type found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificAccessType = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("access_type",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, AccessType: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No access type found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateAccessType = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const condition={
          column:"id",
          value:id
      }
      const oldType=await getSingleRow("access_type",condition)
      if(!oldType){
          return res.status(404).json({statusCode:404,message:"Access Type not found "})
      }
      const updateType =
        `UPDATE access_type SET name=$1,"updatedAt"=NOW() WHERE id=$2 RETURNING *`;
      const result = await pool.query(updateType, [
        name,
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
