
export const asyncHandler = (controller)=>{
    return (req,res,next)=>{
        return controller(req,res,next).catch(async(err)=>{
            return next(new Error(err))
        })
    }
}