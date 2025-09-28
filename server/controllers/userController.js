import userModel from "../model/userModel.js"

export const getUserData = async(req, res) => {
    try{
        const userId = req.userId;
        console.log("userId from middleware:", userId);

        const user = await userModel.findById(userId);
        console.log("fetched user:", user);

        if(!user){
            return res.json({ success: false, message: 'user not found'});
        }
        // if successful
        res.json({
            success: true, 
            userData: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }

        })

    }catch(error){
        res.json({success: false, message: error.message})
    }
}