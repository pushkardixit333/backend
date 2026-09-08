import {asyncHandler} from "../utils/asynchandler.js";
import{ApiError} from "../utils/Apierror.js"
import {User} from "../models/user.model.js"
import {uploadonCloudinary} from "../utils/fileUpload.js" 

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Email:", email);
  if(fullName==null){
    throw new ApiError(400,"All fields are required")
}
  User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"User with email is Existed")
  }
  const avatarLocalpath= req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;
if(!avatarLocalpath){
    throw new ApiError(400,"Avatar file required")
}
});
export { registerUser };