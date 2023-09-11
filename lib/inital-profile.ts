import { currentUser,redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
/**
 * get an userProfile.
 * if the user is not logged in, retrieve the user's profile and navigate to the Sign In view.
 * @returns userProfile
 */
export const initialProfile = async () =>{
    const user = await currentUser()

    if (!user){
        return redirectToSignIn()
    }

    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
    })

    if (profile){
        return profile
    }

    const newProfile = await db.profile.create({
        data:{
            userId:user.id,
            name:buildName(user.firstName,user.lastName),
            imageUrl: user.imageUrl,
            email:user.emailAddresses[0].emailAddress,            
        }
    })


    return newProfile
}

const buildName = (firstName:string|null,lastName:string|null):string=>{
    return firstName||"" + lastName||""
}