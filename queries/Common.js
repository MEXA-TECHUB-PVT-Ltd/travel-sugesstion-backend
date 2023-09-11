import pool from "../db.config/index.js";

export const userEmailExistQuery="SELECT * FROM users WHERE email=$1";
export const getSingleRow = async (tableName, condition) => {
    const query = `SELECT * FROM ${tableName} WHERE ${condition.column} = $1`;
    const result = await pool.query(query, [condition.value]);
    return result.rows[0];
  };
export const getAllRows = async (tableName) => {
    const query = `SELECT * FROM ${tableName}`;
    const result = await pool.query(query);
    return result.rows;
  };
  