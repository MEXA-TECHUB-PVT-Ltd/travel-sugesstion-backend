import pool from "../db.config/index.js";
export const addQuestionStatus = async (req, res) => {
  const { user_id, question_id, question_status } = req.body;
  try {
    const checkQuery="SELECT * FROM question_status WHERE user_id=$1 AND question_id=$2";
    const checkResult=await pool.query(checkQuery,[user_id,question_id])
    if(checkResult.rows.length>0){
      return res.status(400).json({statusCode:400,message:"you have already add question status"})
    }
    const addQuestionStatusQuery =
      "INSERT INTO question_status (user_id,question_id,question_status) VALUES ($1,$2,$3)";
    const add = await pool.query(addQuestionStatusQuery, [
      user_id,
      question_id,
      question_status,
    ]);
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
export const updateQuestionStatus = async (req, res) => {
  const { user_id, question_id, question_status, id } = req.body;
  try {
    const userExistsQuery = "SELECT 1 FROM users WHERE id = $1";
    const userExistsResult = await pool.query(userExistsQuery, [user_id]);

    if (userExistsResult.rows.length === 0) {
      res.status(400).json({ statusCode: 400, message: "Invalid user_id" });
      return;
    }
    const questionExistsQuery = "SELECT 1 FROM question WHERE id = $1";
    const questionExistResult = await pool.query(questionExistsQuery, [
      question_id,
    ]);

    if (questionExistResult.rows.length === 0) {
      res.status(400).json({ statusCode: 400, message: "Invalid question_id" });
      return;
    }
    const updateQuestionStatusQuery = `UPDATE question_status SET user_id = $1, question_id = $2, question_status = $3,"updatedAt" = NOW()
    FROM question
    WHERE question_status.id = $4 AND question.id = question_status.question_id
    RETURNING question_status.id AS question_status_id,question_status.user_id,question_status.question_id,question_status.question_status, question.questions AS question
`;

    const update = await pool.query(updateQuestionStatusQuery, [
      user_id,
      question_id,
      question_status,
      id,
    ]);

    if (update.rowCount === 1) {
      res
        .status(200)
        .json({
          statusCode: 200,
          message: "Update successful",
          updatedData: update.rows[0],
        });
    } else {
      res.status(404).json({ statusCode: 404, message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const deleteQuestionStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const deleteQuestionStatusQuery = "DELETE FROM question_status WHERE id=$1";
    const del = await pool.query(deleteQuestionStatusQuery, [id]);
    if (del.rowCount === 1) {
      res
        .status(200)
        .json({ statusCode: 200, message: "deleted successfully" });
    } else {
      res.status(400).json({ statusCode: 400, message: "Not deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const viewQuestionStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const ViewQuestionStatusQuery = "SELECT * FROM question_status WHERE id=$1";
    const view = await pool.query(ViewQuestionStatusQuery, [id]);
    if (view.rows.length > 0) {
      res
        .status(200)
        .json({
          statusCode: 200,
          questionStatus: view.rows[0].question_status,
        });
    } else {
      res
        .status(400)
        .json({ statusCode: 400, message: "No question status exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
