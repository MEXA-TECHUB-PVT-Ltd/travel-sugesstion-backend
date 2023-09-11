import { Router } from 'express';
import { AllUser, SingleUser, UnblockUser, blockUser, forgetPassword, login, register, resetPassword, updateProfile, verifyOtp } from '../Controller/userController.js';
import { upload } from '../utils/ImageHandler.js';
const userRoute = Router();

userRoute.post('/login', login);
userRoute.post('/register', register);
userRoute.post("/forgetPassword",forgetPassword)
userRoute.post("/verifyOtp",verifyOtp)
userRoute.post("/resetPassword",resetPassword)
userRoute.get("/getUserById/:id",SingleUser)
userRoute.get("/getAllUser",AllUser)
userRoute.post("/blockUser",blockUser)
userRoute.post("/UnBlockUser",UnblockUser)
userRoute.post("/updateProfile",upload("userImages").single("image"), updateProfile)
export default userRoute;
