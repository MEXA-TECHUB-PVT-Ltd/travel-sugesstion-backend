import pool from "../db.config/index.js";
import {
  getAllRows,
  getSingleRow,
} from "../queries/Common.js";

export const addQuestion = async (req, res) => {
  const { questions } = req.body;
  try {
    const addQuestionQuery = "INSERT INTO question (questions) VALUES ($1)";
    const add = await pool.query(addQuestionQuery, [questions]);
    if (add.rowCount === 1) {
      res
        .status(200)
        .json({ statusCode: 200, message: "created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const updateQuestion = async (req, res) => {
  const { questions, id } = req.body;
  try {
    const updateQuestionQuery = `UPDATE question SET questions=$1,"updatedAt" = NOW() WHERE id=$2 RETURNING *`;
    const update = await pool.query(updateQuestionQuery, [questions, id]);
    if (update.rowCount === 1) {
      res
        .status(200)
        .json({
          statusCode: 200,
          message: "update successfully",
          question: update.rows[0],
        });
    } else {
      res
        .status(400)
        .json({ statusCode: 400, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const deleteQuestion = async (req, res) => {
  const { id } = req.body;
  try {
    const deleteQuestionQuery = `DELETE FROM question WHERE id=$1`;
    const del = await pool.query(deleteQuestionQuery, [id]);
    if (del.rowCount === 1) {
      res.status(200).json({ statusCode: 200, message: "delete successfully" });
    } else {
      res
        .status(400)
        .json({ statusCode: 400, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const specificQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const condition = {
      column: "id",
      value: id,
    };
    const question = await getSingleRow("question", condition);
    if (question) {
      res.status(200).json({ statusCode: 200, question });
    } else {
      res
        .status(400)
        .json({ statusCode: 400, message: "Operation not successfull" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const getAllQuestion = async (req, res) => {
    try {
      const questions = await getAllRows("question");
      if (questions) {
        res.status(200).json({ statusCode: 200, questions });
      } else {
        res
          .status(400)
          .json({ statusCode: 400, message: "Operation not successfull" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
  };