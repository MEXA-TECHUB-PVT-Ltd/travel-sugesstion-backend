import pool from "../db.config/index.js";
export const getAllInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const totalInsights = {
      yes: 0,
      no: 0,
      not_sure: 0,
    };
    const query = `
    SELECT
    question_status,
    COUNT(*) AS insight_count
    FROM
    question_status
    WHERE
    question_id = $1
    GROUP BY
    question_status;
    `;

    const { rows } = await pool.query(query, [id]);

    rows.forEach((item) => {
      const questionStatus = item.question_status;
      const insightCount = parseInt(item.insight_count, 10);

      if (totalInsights.hasOwnProperty(questionStatus)) {
        totalInsights[questionStatus] += insightCount;
      }
    });
    if (rows.length > 0) {
      return res.status(200).json({ statusCode: 200, totalInsights });
    }
    res.status(404).json({ statusCode: 404, message: "No insight found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
