

//  middleware to check userid and hashPremium of the user

import { clerkClient } from "@clerk/express";


 const auth = async (req , res ,next) =>{

    try{

        const {has, userId} = await req.auth();
        const hashPremium = await has ({plan :'premium'});
        const user = await clerkClient.users.getUser(userId);


        if (!hashPremium && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        }
       else{
        await clerkClient.users.updateUserMetadata(userId,{
            privateMetadata:{
                free_usage:0
            }
        })
        req.free_usage=0;
       }
       req.plan = hashPremium ? 'premium' :'free';
       next();
    }
     catch (err){
        res.json({
            success:"false",
            message:err.message
        })

     }

}
export default auth;