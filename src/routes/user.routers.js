import {Router} from "express";
import {registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxcount:1
    },
    {
        name:"coverImage",
        maxcout:1
    }
]), registerUser);
router.route("/login").post(registerUser);

export {router as userRouter};