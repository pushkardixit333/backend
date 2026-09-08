import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


    
const uploadonCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            throw new Error("File path is required for upload.");
        }
        const result = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        console.log("File uploaded to Cloudinary:", result.url);
       return result;
    }
    catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary:", error);
return null;
         
    }
}


export { uploadonCloudinary };