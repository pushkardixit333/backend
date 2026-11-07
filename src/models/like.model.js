import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { comment } from "./comment.model";
const likeSchema=new Schema({
     video:{
        type:Schema.Types.ObjectId,ref:"video"
    },
     comment:{
        type:Schema.Types.ObjectId,ref:"comment"
    },
     tweet:{
            type:Schema.Types.ObjectId,ref:"tweet"
        },
    likedBY:{
            type:Schema.Types.ObjectId,ref:"User"
        }
},{timestamps:true})
export  const Like=mongoose.model("like",likeSchema)