// import Amenities from "../model/amenitiesModel.js";
import pool from "../db.config/index.js";
import { getSingleRow } from "../queries/Common.js";
export const createReview = async (req, res) => {
  try {
    const { user_id, place_id,title,description,select_visit } = req.body;
      const createQuery =
        "INSERT INTO review (user_id,place_id,title,description,select_visit) VALUES($1,$2,$3,$4,$5)";
      const result = await pool.query(createQuery, [
        user_id, place_id,title,description,select_visit
      ]);
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
export const updateReview = async (req, res) => {
    try {
        const {id}=req.params
      const { user_id, place_id,title,description,select_visit } = req.body;
        const updateQuery =
          `UPDATE review SET title=$1,description=$2,select_visit=$3,"updatedAt"=NOW() WHERE id=$4 AND user_id=$5 AND place_id=$6 RETURNING *`;
        const result = await pool.query(updateQuery, [
          title,description,select_visit,id,user_id, place_id,
        ]);
        if (result.rowCount === 1) {
          return res
            .status(200)
            .json({ statusCode: 200, updatedReview:result.rows[0] });
        }
        res.status(400).json({ statusCode: 400, message: "Not Updated " });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
  };
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const delQuery = "DELETE FROM review WHERE id=$1";
    const result = await pool.query(delQuery, [id]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "review not deleted" });
    }
    res
      .status(200)
      .json({ statusCode: 200, message: "review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
// export const getAllhotelTypes = async (req, res) => {
//   try {
//     const result = await getAllRows("hotel_type");
//     if (result.length > 0) {
//       return res
//         .status(200)
//         .json({ statusCode: 200, AllHotelType: result });
//     } else {
//       res.status(404).json({ statusCode: 404, message: "No Hotel Type found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ statusCode: 500, message: "Internal server error", error });
//   }
// };

export const getSpecificReview = async (req, res) => {
  try {
    const { id } = req.params;
    const condition={
        column:"id",
        value:id
    }
    const result=await getSingleRow("review",condition)
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 200, review: result });
    } else {
      res.status(404).json({ statusCode: 404, message: "No review found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getReviewByUserId = async (req, res) => {
    try {
      const { user_id } = req.params;
     const getQuery=`SELECT * FROM review WHERE user_id=$1`
     const result=await pool.query(getQuery,[user_id])
      if (result.rows.length>0) {
        return res
          .status(200)
          .json({ statusCode: 200, UserReview: result.rows });
      } else {
        res.status(404).json({ statusCode: 404, message: "No review found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const getAllReviewByPlace = async (req, res) => {
    try {
      const { place_id } = req.params;
     const getQuery=`SELECT * FROM review WHERE place_id=$1`
     const result=await pool.query(getQuery,[place_id])
      if (result.rows.length>0) {
        return res
          .status(200)
          .json({ statusCode: 200, PlaceReview: result.rows });
      } else {
        res.status(404).json({ statusCode: 404, message: "No review found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const getTotalReviewByPlace = async (req, res) => {
    try {
      const { place_id } = req.params;
     const getQuery=`SELECT COUNT(*) AS total_reviews
     FROM review
     WHERE place_id = $1;`
     const result=await pool.query(getQuery,[place_id])
     console.log(result);
      if (result.rows.length>0) {
        return res
          .status(200)
          .json({ statusCode: 200, TotalReview: result.rows[0].total_reviews });
      } else {
        res.status(404).json({ statusCode: 404, message: "No review found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
// export const updatehotelType = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     const query = "SELECT * FROM hotel_type WHERE id=$1";
//     const oldImage = await pool.query(query, [id]);
//     let updateData = {
//       name,
//       description,
//       image: null,
//     };
//     if (req.file && req.file.filename) {
//       updateData.image = `/hotelTypeImages/${req.file.filename}`;
//       const imageSplit = oldImage.rows[0].image.replace(
//         "/hotelTypeImages/",
//         ""
//       );
//       handle_delete_photo_from_folder(imageSplit, "hotelTypeImages");
//     } else {
//       updateData.image = oldImage.rows[0].image;
//     }

//     const updateType =
//       `UPDATE hotel_type SET name=$1,description=$2,image=$3,"updatedAt"=NOW() WHERE id=$4 RETURNING *`;
//     const result = await pool.query(updateType, [
//       updateData.name,
//       updateData.description,
//       updateData.image,
//       id,
//     ]);
//     if (result.rowCount === 1) {
//       return res
//         .status(200)
//         .json({ statusCode: 200, updateType: result.rows[0] });
//     } else {
//       res
//         .status(404)
//         .json({ statusCode: 404, message: "Operation not successfull" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
