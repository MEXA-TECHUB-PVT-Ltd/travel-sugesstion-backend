import pool from "../db.config/index.js";
export const createTip = async (req, res) => {
    try {
      const { place_id,description } = req.body;
      const createQuery = "INSERT INTO tips (place_id,description) VALUES($1,$2)";
      const result = await pool.query(createQuery, [place_id,description]);
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
  export const getTipByPlace = async (req, res) => {
    try {
      const {id} = req.params;
      const getQuery = "SELECT * FROM tips WHERE place_id=$1";
      const result = await pool.query(getQuery, [id]);
      if (result.rows.length>0) {
        return res
          .status(200)
          .json({ statusCode: 200, tips:result.rows });
      }
      res.status(404).json({ statusCode: 404, message: "No tip found" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
  };