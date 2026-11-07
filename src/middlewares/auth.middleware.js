import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import{User} from "../models/user.model.js"






export const verifyJWT =asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        
    const decodeToken= await jwt.verify(token,process.env.Access_TOKEN_SECRET);
    console.log("decode token",decodeToken);
    const user = await User.findById(decodeToken?.userId).select("-password -refreshToken")
    console.log("user found",user);
    if(!user){
        throw new ApiError(401,"Invalid Token")
    }
    req.user =user;
    next()
    } 
    catch (error) {
    throw new ApiError(401,"INVALID ACCESS");
}
})