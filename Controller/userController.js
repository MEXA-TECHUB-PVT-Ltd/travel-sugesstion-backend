import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.config/index.js";
import { getAllRows, getSingleRow, userEmailExistQuery } from "../queries/Common.js";
import { emailSent } from "../utils/EmailSent.js";
import { handle_delete_photo_from_folder } from "../utils/handleDeletephoto.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(userEmailExistQuery, [email]);
    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: rows[0].id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ statusCode: 200, token, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(401).json({
        statusCode: 401,
        message: "Password and ConfirmPassword not matched",
      });
    }
    const existingUserResult = await pool.query(userEmailExistQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Email is already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id";
    const newUserResult = await pool.query(insertUserQuery, [
      email,
      hashedPassword,
    ]);
    const userId = newUserResult.rows[0].id;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ statusCode: 200, token, newUser: { id: userId, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userEmailExistResult = await pool.query(userEmailExistQuery, [email]);
    if (userEmailExistResult.rows.length === 0) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid Email" });
    }
    const otpCode = Math.floor(1000 + Math.random() * 9000);
    const updateQuery = "UPDATE users SET code =$1 WHERE email=$2";
    const updateQueryResult = await pool.query(updateQuery, [otpCode, email]);
    if (updateQueryResult.rowCount === 1) {
      const output = `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>OTP Verification</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  button{
                    background-color: #fff;
                    border:none;
                    color:#e50914;
                    cursor:pointer;
                  }
                  button:hover{
                    background-color: #e50914;
                    color: #fff;
                    font-weight: bold;
                  }
                  .button {
                    display: inline-block;
                    font-weight: 600;
                    color: #e50914;
                    border: 1px solid #e50914;
                    border-radius: 2px;
                    padding: 10px 20px;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                  }
                  .button:hover {
                    background-color: #e50914;
                    color: #fff;
                    font-weight: bold;
                  }
                  h2 {
                    color: #333;
                    margin-bottom: 20px;
                  }
                  p {
                    margin-bottom: 10px;
                  }
                  a {
                    color: #007bff;
                    text-decoration: none;
                  }
                  .footer {
                    margin-top: 30px;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Verify Your Email with OTP</h2>
                  <p>Hello,</p>
                  <p>We have sent you a one-time password (OTP) for verification. Please use the OTP code below:</p>
                  <p style="font-size: 24px; font-weight: bold;">${otpCode}</p>
                  <p>If you did not request this OTP, please ignore this email.</p>
                  <p class="footer">Thank you!</p>
                </div>
              </body>
            </html>
            `;
      await emailSent(email, output, "Verification Code");
      res.status(200).json({
        statusCode: 200,
        message: "Reset password link sent successfully!",
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "Reset passord link not sent",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const verifyOtp = async (req, res, next) => {
  try {
    const { Code, email } = req.body;
    const veritOtpQuery = "UPDATE users SET code=$1 WHERE email=$2 AND Code=$3";
    const VerifyResult = await pool.query(veritOtpQuery, [null, email, Code]);
    if (VerifyResult.rowCount === 1) {
      return res.status(200).json({
        statusCode: 200,
        message: "Otp Code verify successfully",
      });
    }
    return res
      .status(401)
      .json({ statusCode: 401, message: "Invalid Otp Code" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      statusCode: 500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({
          statusCode: 401,
          message: "Password and confirm password not matched",
        });
    }
    const userEmailExistResult = await pool.query(userEmailExistQuery, [email]);
    if (userEmailExistResult.rows.length === 0) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Invalid Email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = "UPDATE users SET password=$1 WHERE email=$2";
    const updateResult = await pool.query(updateQuery, [hashedPassword, email]);
    if (updateResult.rowCount === 1) {
      return res
        .status(200)
        .json({ statusCode: 200, message: "Password reset successfully" });
    }

    return res
      .status(401)
      .json({ statusCode: 401, message: "Password not updated" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      statusCode: 500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const SingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const condition = { column: "id", value: id };
    const user = await getSingleRow("users", condition);
    if (user.length === 0) {
      return res
        .status(401)
        .json({ statusCode: 401, message: "User Not found" });
    }
    res.status(200).json({ statusCode: 200, user });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      statusCode: 500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const AllUser = async (req, res, next) => {
  try {
    const user = await getAllRows('users');
    if (!user.length) {
      return res.status(401).json({statusCode:401, message: "No User exists" });
    }
    res.status(200).json({statusCode:200,user});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const blockUser = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateQuery="UPDATE users SET blocked=$1 WHERE id=$2";
    const result=await pool.query(updateQuery,[status,id])
    if(result.rowCount===1){
      return res.status(200).json({statusCode:200,message:"User block successfully"})
    }
     res.status(401).json({statusCode:401,message:"User not block due to some error"})
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode:500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const UnblockUser = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateQuery="UPDATE users SET blocked=$1 WHERE id=$2";
    const result=await pool.query(updateQuery,[status,id])
    if(result.rowCount===1){
      return res.status(200).json({statusCode:200,message:"User Unblock successfully"})
    }
     res.status(401).json({statusCode:401,message:"User not Unblock due to some error"})
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode:500,
      error: error.stack,
      message: "Server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { username,id } = req.body;
    let updateData = {
      username,
      image:null
    };
    if (req.file && req.file.filename) {
      updateData.image = `/userImages/${req.file.filename}`;
    }
    const condition={
      column:'id',
      value:id
    }
    const singleRow=await getSingleRow('users',condition)
    let oldImage=null
    if(singleRow){
      oldImage=singleRow.image
    }
   const updateQuery=`UPDATE users SET username=$1,image=$2,"updatedAt" = NOW() WHERE id=$3 RETURNING *`
   const result=await pool.query(updateQuery,[updateData.username,updateData.image,id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User profile not updated" });
    }
     handle_delete_photo_from_folder(oldImage,"userImages")
     res
      .status(200)
      .json({ message: "User profile updated successfully", updatedUser:result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
