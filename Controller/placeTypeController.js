import pool from "../db.config/index.js";
import { getAllRows, getSingleRow } from "../queries/Common.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";
export const createPlaceType = async (req, res) => {
  try {
    const { name } = req.body;
    const createQuery = "INSERT INTO place_type (name) VALUES($1)";
    const result = await pool.query(createQuery, [name]);
    if (result.rowCount === 1) {
      return res
        .status(201)
        .json({ statusCode: 201, message: "created successfully" });
    }
    res.status(400).json({ statusCode: 400, message: "Not created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const deletePlaceType = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const exist = await getSingleRow("place_type", condition);
    if (!exist) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Place type not found " });
    }
    const delQuery = "DELETE FROM place_type WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Place type not deleted" });
    }
    res
      .status(200)
      .json({ statusCode: 200, message: "Place Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllPlaceTypes = async (req, res) => {
  try {
    const result = await getAllRows("place_type");
    if (result.length > 0) {
      return res.status(200).json({ statusCode: 200, PlaceTypes: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place type found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getSpecificPlaceType = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = {
      column: "id",
      value: id,
    };
    const result = await getSingleRow("place_type", condition);
    if (result) {
      return res.status(200).json({ statusCode: 200, PlaceType: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No place type found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updatePlaceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const condition = {
      column: "id",
      value: id,
    };
    const oldImage = await getSingleRow("place_type", condition);
    if (!oldImage) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Place type not found " });
    }
    const updateType = `UPDATE place_type SET name=$1, "updatedAt"=NOW() WHERE id=$2 RETURNING *`;
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
