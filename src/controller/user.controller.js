import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../util/cloudinary.js"
import { ApiResponse } from "../util/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) =>{
   //get user details from front end
   //validation - not empty
   //check if user already exists: username,email
   //check for images ,check for avatar
   //upload them on cloudinary , avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return res

   const {fullName, email, username, password } = req.body;
   //console.log("Email : ",email);

   if([fullName, email, username, password].some((field)=>
    field?.trim() === "")){

        throw new ApiError("400","All fields are required")
   }

   const existedUser = await User.findOne({
    $or: [{email},{username}]
   })

   if(existedUser){
    throw new ApiError("409","User with email or username already existed ")
   }
   
   //console.log(req.files)
   const avatarLocalPath =req.files?.avatar[0]?.path

   // const coverImageLocalPath =req.files?.coverImage[0]?.path

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    


   if(!avatarLocalPath){
    throw new ApiError("400","Avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError("400","Avatar file is required")
   }

   const user = await User.create({
    fullName, 
    email,
    username: username.toLowerCase(),
    password,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError("500","Failed to create user")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
   )
})

export {registerUser}