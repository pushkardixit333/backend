import {asyncHandler} from "../utils/asynchandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadonCloudinary} from "../utils/cloudinary.js" 
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";



const generateAccessTokenandrefreshtoken= async(userId)=>{
  try{
    const user = await User.findById(userId)
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ValidateBeforeSave:false});
   return{accessToken,refreshToken};


  }
  catch(error){
    throw new ApiError(500,"Something went error")

  }
}


const registerUser = asyncHandler( async (req, res) => {
const { username, email, password } = req.body;
  console.log("Email:", email);
 
  const userexisted = await User.findOne({
    $or:[{username},{email}]
  })
  if(userexisted){
    throw new ApiError(409,"User with email is Existed")
  }

   const avatarLocalPath= req.files?.avatar?.[0]?.path;
   const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
 if(!avatarLocalPath){
     throw new ApiError(400,"Avatar file required")
 }
   const avatar = await uploadonCloudinary(avatarLocalPath)
   const coverImage = await uploadonCloudinary(coverImageLocalPath)
   if (!avatar){
     throw new ApiError(400,"Avatar file required")
   }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()

  })
const created= await User.findById(user._id).select(
  "-password -refreshToken "
)
if(!created){
  throw new ApiError(500,"User Not Created")
}

return res.status(201).json(
  new ApiResponse(200,created,"user created successfully")
)
});
 
const loginUser =asyncHandler(async(req,res)=>{
  const {email,password}=req.body;
  if(!email && !password){
    throw new ApiError(400,"All fields are required")
  }
const user =await User.findOne({
  $or:[{email}]
});
if(!user){
  throw new ApiError(404,"User doesn't exist")
}

const valid = await user.comparePassword(password);
if(!valid){
  throw new ApiError(401,"Invalid user credentials")
}
const {accessToken,refreshToken}=await generateAccessTokenandrefreshtoken(user._id)
const loggedIdUser=await User.findById(User._id)
.select("-password -refreshToken")
const options={
  httpOnly:true,
  secure:true
}
return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
  new ApiResponse(200,{user:loggedIdUser,accessToken,refreshToken},"User logged in successfully")

)


})

const logoutuser  =asyncHandler(async(req,res)=>
{ User.findByIdAndUpdate (
  req.user._id,{
 $set:{
  refreshToken:undefined
 }
  },{
    new:true
  }
)
const options={
  httpOnly:true,
  secure:true
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"logout successfully"))

})
const refreshaccesstoken =asyncHandler(async(req,res)=>{
const incomingrefreshtoken=   req.cookies.refreshToken || req.body.refreshToken
if(!incomingrefreshtoken){
  throw new ApiError(402,"unauthorized request")
}
try {
  const decodedToken =jwt.verify(incomingrefreshtoken,process.env.Refresh_TOKEN_SECRET)
  
  const user = await User.findById(decodedToken?.userId)
  if(!user){
    throw new ApiError(401,"user doesn't exist")
  }
  if(incomingrefreshtoken !== user?.refreshToken){
    throw new ApiError(402,"refresh token expired")
  }
  const options={
    httpOnly:true,
    secure:true
  }
  const {accessToken,newrefreshToken} = await generateAccessTokenandrefreshtoken(user._id)
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newrefreshToken,options)
  .json( new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},"Access token refreshed"
  
  ))
} catch (error) {
  throw new ApiError(401,"invalid refresh token")
  
}
}) 


const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const{oldpassword,newpassword}=req.body
   
  const user =await User.findById(req.user?.userId)
  const ispasswordcoreect = await user.comparePassword(oldpassword)
  if(!ispasswordcoreect){
    throw new ApiError(401,"wrong credentials")
  }

   user.password=newpassword
  await  user.save({validateBeforeSave:false
   })
  return res.status(200).json(new ApiResponse(200,{},"password changed successfully"))



})


const getcurrentuser =asyncHandler(async(req,res)=>{
  return res.status(200).json(new ApiResponse(200,req.user,"current user fetch successfully")
)})
const updateuserdetails =asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body
    if(!fullName || !email){
      throw new ApiError(400,"all field require")
    }

   const user= await User.findByIdAndUpdate(req.user?.userId,{$set:{
    fullName:fullName,email:email
   }},{new:true}).select("-password")
   return req.status(200).json(new ApiResponse(200,user,"user updated successfully"))
})

const avataruser=asyncHandler(async(req,res)=>{
   const avatarLocalPath= req.file?.path
   if(!avatarLocalPath){
    throw new ApiError(200,"avatar file is missing")
   }
   const avatar = await uploadonCloudinary(avatarLocalPath)
   if(!avatar.url){
    throw new ApiError(400,"Error while uploading")
   }
     
  const user  =  await User.findByIdAndUpdate(req.user?.userId,{
    $set:{
      avatar:avatar.url
    }
  },{new:true}).select("-password")
return res.status(200).json((200),user,"avatar updated successfully")



})
const coverimageuser=asyncHandler(async(req,res)=>{
   const coverImageLocalPath= req.file?.path
   if(!coverImageLocalPath){
    throw new ApiError(200,"cover image  file is missing")
   }
   const coverImage = await uploadonCloudinary(coverImageLocalPath)
   if(!coverImage.url){
    throw new ApiError(400,"Error while uploading")
   }
     
  const user =await User.findByIdAndUpdate(req.user?.userId,{
    $set:{
      coverIamge:coverImage.url
    }
  },{new:true}).select("-password")

  return res.status(200).json((200),user,"coveriamge updated successfully")



})
    
const getuserchannelprofile=asyncHandler(async(req,res)=>{
  const {username}=req.params
  if(!username?.trim()){
    throw new ApiError(400,"username is missing")
  }

  const channel = await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }},
      {
      $lookup:{
        from:"subscriptions",
        localField:"userId",
        foreignField:"channel",
        as:"subscriber"

      }},
      {
      $lookup:{
        from:"subscriptions",
        localField:"userId",
        foreignField:"subscriber",
        as:"subscribedTo"

      }},
      {
        $addfileds:{
          subscribercount:{
            $size:"$subscriber"
          },
          channelsubscribertocount:{
            $size:"substribedTo"
          },
          issubscribed:{
            $cond:{
              if:{
                $in:[req.user?.userId,"subscriptions.subscriber"]
              },then:true,else:false
            }
          }
        }
      },
      {
        $project:{
          fullName:1,
          username:1,
          subscribercount:1,
          channelsubscribertocount:1,
          issubscribed:1,
          avatar:1,
          coverImage:1,
          email:1


        }
      }

      
      
    
  ])
  if(!channel?.length){
    throw new ApiError(400,"channel doesn't exist")
  }
  return res.status(200).json(new ApiResponse(200,channel[0],"user channel fetch successfully "))
})

const getwatchhistory=asyncHandler(async(req,res)=>{
  const user=await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user.userId)
      }
    },{
      $lookup:{
        from:"videos",
        localfield:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"user",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1
                  }
                }
              ]

            }
          },{
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
        
      }
    }
  ])

  return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"watch history ftch successfully"))
})











export { registerUser, 
  loginUser ,logoutuser , refreshaccesstoken,
  changeCurrentPassword,getcurrentuser,updateuserdetails,avataruser,coverimageuser,getuserchannelprofile,getwatchhistory
  
};