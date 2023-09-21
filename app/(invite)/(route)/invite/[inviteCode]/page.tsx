import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

/**
 * 接受邀请
 * @param params
 * @constructor
 */
const InviteCodePage = async ({params}: InviteCodePageProps) => {
    const profile = await currentProfile()

    if (profile == null) {
        return redirectToSignIn()
    }
    // 如果没有附带，直接重定向到主页
    if (!params.inviteCode) {
        return redirect("/")
    }
    //检查用户是否存在于服务器
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }

        }
    })
    //如果用户存在于服务器上
    if (existingServer) {
        return redirect("/")
    }
    //如果用户不存在于服务器，则向服务器加入用户
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id

                    }
                ]
            }
        }
    })
    //如果操作成功，返回到服务器页面
    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return null
}

export default InviteCodePage