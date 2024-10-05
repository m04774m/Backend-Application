import { asyncHandler } from "../util/asyncHandler.js";

const registerUser = asyncHandler( async (req,res) =>{
    return res.status(200).json({
        message: "moazzam"
    })
})

export {registerUser}