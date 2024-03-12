import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"  
console.log(process.env.CLOUDINARY_CLOUD_NAME)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

          

const uploadCloudinary = async (localFilePath)=>{
  try {
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    }
      )
      console.log("file is uploaded on cloudnary", response.url)
      return response 
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return null
    
  }
}
export {uploadCloudinary}