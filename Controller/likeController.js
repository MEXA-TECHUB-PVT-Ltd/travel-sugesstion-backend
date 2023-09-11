import pool from "../db.config/index.js";
import { getSingleRow } from "../queries/Common.js";
export const createLike = async (req, res) => {
  try {
    const { user_id, review_id } = req.body;
    const likeExistQuery = `SELECT * FROM user_likes WHERE user_id=$1 AND review_id=$2`;
    const likeExistresult = await pool.query(likeExistQuery, [
      user_id,
      review_id,
    ]);
    if (likeExistresult.rows.length > 0) {
      const UnlikeQuery = `DELETE FROM user_likes WHERE user_id=$1 AND review_id=$2`;
      const unlikeResult = await pool.query(UnlikeQuery, [user_id, review_id]);
      if (unlikeResult.rowCount === 1) {
        return res
          .status(200)
          .json({ statusCode: 200, message: "User unlike successfully" });
      }
    } else {
      const createQuery =
        "INSERT INTO user_likes(user_id,review_id) VALUES($1,$2)";
      const likeresult = await pool.query(createQuery, [user_id, review_id]);
      if (likeresult.rowCount === 1) {
        return res
          .status(200)
          .json({ statusCode: 200, message: "User like successfully" });
      }
    }
    res
      .status(400)
      .json({ statusCode: 400, message: "Operation not successfull" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};



export const getAllLikesOnSpecificReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const getquery = `SELECT
    l.id AS like_id,
    l.user_id AS user_like_id,
    r.id AS review_id,
    r.title AS review_title,
    r.description AS  review_description,
    r.select_visit AS  review_select_visit
    FROM user_likes l
    INNER JOIN review r ON l.review_id = r.id
    WHERE l.review_id = $1;`;
    const result = await pool.query(getquery, [review_id]);
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
