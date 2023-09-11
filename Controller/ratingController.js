import pool from "../db.config/index.js";
import { getSingleRow } from "../queries/Common.js";
export const createRating = async (req, res) => {
  try {
    const { user_id,place_id,no_of_stars } = req.body;
    const createQuery = "INSERT INTO rating (user_id,place_id,no_of_stars) VALUES($1,$2,$3)";
    const result = await pool.query(createQuery, [user_id,place_id,no_of_stars]);
    if (result.rowCount === 1) {
      return res
        .status(201)
        .json({ statusCode: 201, message: "Rating created successfully" });
    }
    res.status(400).json({ statusCode: 400, message: "Not created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const getRatingByPlace = async (req, res) => {
  try {
    const {place_id} =req.params
   const getRating=`
   SELECT ROUND(AVG(no_of_stars),1) AS average_rating
   FROM rating
   WHERE place_id = $1;
   `
   const result=await pool.query(getRating,[place_id])
    if (result.rows.length> 0) {
      return res.status(200).json({ statusCode: 200, avg_rating: result.rows[0].average_rating });
    } else {
      res.status(404).json({ statusCode: 404, message: "No rating found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", error });
  }
};

export const getAllRatingsByUser = async (req, res) => {
    try {
      const {user_id} =req.params
     const getquery = `SELECT * FROM rating WHERE user_id = $1`;
     const result=await pool.query(getquery,[user_id])
      if (result.rows.length) {
        return res.status(200).json({ statusCode: 200, Allratings: result.rows });
      } else {
        res.status(404).json({ statusCode: 404, message: "No rating found" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", error });
    }
  };