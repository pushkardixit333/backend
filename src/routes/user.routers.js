import {Router} from "express";
import {avataruser, changeCurrentPassword, coverimageuser, getcurrentuser, getuserchannelprofile, getwatchhistory, loginUser, logoutuser, refreshaccesstoken, registerUser, updateuserdetails} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxcount:1
    },
    {
        name:"coverImage",
        maxcount:1
    }
]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT , logoutuser);
router.route("/refresh-token").post(refreshaccesstoken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getcurrentuser);
router.route("/update-account").patch(verifyJWT,updateuserdetails);
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),avataruser);
router.route("/coverImage").post(verifyJWT,upload.single("coverImage"),coverimageuser);
router.route("/c/:username").get(verifyJWT,getuserchannelprofile);
router.route("/history").get(verifyJWT,getwatchhistory);
export {router as userRouter};