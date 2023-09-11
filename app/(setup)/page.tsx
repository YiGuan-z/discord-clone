import { redirect } from "next/navigation";

import { db } from "@/lib/db"
import { initialProfile } from "@/lib/inital-profile"
import { InitialModel } from "@/components/modules/initial-model";


const Setup = async () =>{
    const profile = await initialProfile()

    const server = await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })

    if (server){
        return redirect(`/server/${server.id}`)
    }
    return (
        <>
            <InitialModel />
        </>
    )
}

export default Setup